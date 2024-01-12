import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Item, { ItemProps } from "@/components/Item";

export default function SortableItem(props: ItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Item
      {...props}
      ref={setNodeRef}
      style={style}
      {...attributes}
      listeners={listeners}
    />
  );
}
