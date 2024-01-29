import ListForm from "@/components/ListForm";
import { List } from "@/types/models";
import { updateList } from "@/util/api";

type EditListProps = {
  list: List;
  onSave: (id: number, name: string) => any;
};

export default function EditList({ list, onSave }: EditListProps) {
  async function onSubmit(name: string) {
    await onSave(list.id, name);
  }

  return <ListForm list={list} onSubmit={onSubmit} />;
}
