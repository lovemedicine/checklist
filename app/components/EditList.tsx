import ListForm from '@/components/ListForm'
import { List } from '@/types/models'
import { updateList } from '@/util/api'

type EditListProps = {
  list: List,
  onSave: () => any
}

export default function EditList({ list, onSave }: EditListProps) {
  async function onSubmit(name: string) {
    await updateList({ id: list.id, name })
    await onSave()
  }

  return (
    <ListForm list={list} onSubmit={onSubmit} />
  )
}