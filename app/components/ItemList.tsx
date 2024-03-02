import { useState } from "react";
import useSWR from "swr";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import SortableItem from "@/components/SortableItem";
import AddItemForm from "@/components/AddItemForm";
import { Item } from "@/types/models";
import { reorderItem, deleteItem, addItem, fetcher } from "@/util/api";

type ItemListProps = {
  listId: number;
};

export default function ItemList({ listId }: ItemListProps) {
  const [dragEnabled, setDragEnabled] = useState(true);
  const [activeItem, setActiveItem] = useState<Item | null>(null);

  const {
    data: items,
    error,
    isLoading,
    mutate: refreshItems,
  } = useSWR<Item[]>(`/api/list/${listId}/item`, fetcher);

  if (error) return <div>Error loading list</div>;
  if (isLoading) return <div>Loading...</div>;
  if (!items) return null;

  return (
    <div className={`item-list${activeItem ? " item-list-dragging" : ""}`}>
      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext items={items}>
          {items.map((item) => (
            <SortableItem
              key={item.id}
              listId={listId}
              item={item}
              selected={item.checked}
              onDelete={onDelete}
              onSelectedChange={refreshItems}
              dragEnabled={dragEnabled && !item.isOptimistic}
            />
          ))}
        </SortableContext>
      </DndContext>
      <AddItemForm listId={listId} onAdd={onAdd} />
    </div>
  );

  function handleDragStart(event: any) {
    const id = event.active.id;
    const item = items?.find((item) => item.id == id);
    setActiveItem(item || null);
  }

  async function handleDragEnd(event: any) {
    const { active, over } = event;

    if (items && active && over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);

      setDragEnabled(false);

      await refreshItems(
        reorderItem({ listId, from: oldIndex + 1, to: newIndex + 1 }),
        {
          optimisticData: newItems,
        }
      );

      setDragEnabled(true);
    }

    setActiveItem(null);
  }

  function handleDragCancel() {
    setActiveItem(null);
  }

  function onDelete(itemId: number) {
    const optimisticData = (items as Item[]).filter(
      (item) => item.id !== itemId
    );
    refreshItems(deleteItem({ id: itemId, listId }), { optimisticData });
  }

  function onAdd(name: string) {
    const optimisticData = buildOptimisticItems(items || [], name, listId);
    refreshItems(addItem({ listId, name }), { optimisticData });
  }
}

function buildOptimisticItems(
  items: Item[],
  name: string,
  listId: number
): Item[] {
  const maxId = items.length ? Math.max(...items.map((item) => item.id)) : 0;
  const itemId = maxId + 1000000;
  const createdAt = new Date().toJSON();
  const itemCopy = items?.length
    ? items[0]
    : {
        createdAt,
      };

  const newItem = {
    ...itemCopy,
    id: itemId,
    name,
    order: Math.max(...(items || [0]).map((item) => item.order)) + 1,
    checked: true,
    listId,
    isOptimistic: true,
  };

  return items.concat([newItem]);
}
