import { useState, useEffect } from "react";
import useSWR from "swr";
import { DragDropContext, Droppable, DroppableProps } from "@hello-pangea/dnd";
import Item from "@/components/Item";
import AddItemForm from "@/components/AddItemForm";
import { Item as ItemType } from "@/types/models";
import { reorderItem, deleteItem, addItem, fetcher } from "@/util/api";

type ItemListProps = {
  listId: number;
  enableDrag: boolean;
};

function buildOptimisticItems(
  items: ItemType[],
  name: string,
  listId: number,
): ItemType[] {
  const maxId = items.length ? Math.max(...items.map((item) => item.id)) : 0;
  const itemId = maxId + 1000000;
  const createdAt = new Date().toJSON();
  const itemCopy = items?.length
    ? items[0]
    : {
        createdAt,
        lists: [{ id: 999999, listId, itemId, name: "dummy list", createdAt }],
        userId: 9999999,
      };

  const newItem = {
    ...itemCopy,
    id: itemId,
    name,
    order: Math.max(...(items || [0]).map((item) => item.order)) + 1,
    isOptimistic: true,
  };

  return items.concat([newItem]);
}

// taken from:
// https://github.com/atlassian/react-beautiful-dnd/issues/2399#issuecomment-1175638194
const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));

    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return <Droppable {...props}>{children}</Droppable>;
};

export default function ItemList({ listId, enableDrag }: ItemListProps) {
  const {
    data: items,
    error,
    isLoading,
    mutate: refreshItems,
  } = useSWR<ItemType[]>(`/api/list/${listId}/item`, fetcher);

  if (error) return <div>Error loading list</div>;
  if (isLoading) return <div>Loading...</div>;
  if (!items?.length) return null;

  const itemNames = items.map((item) => item.name);

  async function handleDragEnd(result: any) {
    const { destination, source } = result;

    if (!destination) return;
    if (destination.index === source.index) return;

    let newItems = [...(items as ItemType[])];
    newItems.splice(source.index, 1);
    newItems.splice(destination.index, 0, (items as ItemType[])[source.index]);
    refreshItems(
      reorderItem({ from: source.index + 1, to: destination.index + 1 }),
      { optimisticData: newItems },
    );
  }

  function onDelete(itemId: number) {
    const optimisticData = (items as ItemType[]).filter(
      (item) => item.id !== itemId,
    );
    refreshItems(deleteItem(itemId), { optimisticData });
  }

  function onAdd(name: string) {
    const optimisticData = buildOptimisticItems(items || [], name, listId);
    refreshItems(addItem({ listId, name }), { optimisticData });
  }

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <StrictModeDroppable droppableId={`droppable-${listId}`}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {items.map((item, index) => (
                <Item
                  key={item.id}
                  listId={listId}
                  item={item}
                  selected={
                    !!item.lists?.some((listItem) => listItem.listId === listId)
                  }
                  index={index}
                  onDelete={onDelete}
                  enableDrag={enableDrag}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </StrictModeDroppable>
      </DragDropContext>

      <AddItemForm listId={listId} itemNames={itemNames} onAdd={onAdd} />
    </>
  );
}
