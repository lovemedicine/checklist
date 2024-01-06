import List from "@/components/List";
import { List as ListType } from "@/types/models";

type ListListProps = {
  lists: ListType[];
  onUpdate: (id: number, name: string) => any;
  onDelete: (id: number) => any;
};

export default function ListList({ lists, onUpdate, onDelete }: ListListProps) {
  return (
    <>
      {lists.map((list) => (
        <List
          key={list.id}
          list={list}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </>
  );
}
