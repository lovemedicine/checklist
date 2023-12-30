import ListForm from '@/components/ListForm'
import { List } from '@/types/models'
import { updateList } from '@/util/api'

type EditListProps = {
  list: List,
  onSave: (updated: boolean) => any
}

export default function EditList({ list, onSave }: EditListProps) {
  async function onSubmit(name: string) {
    const updated = name !== list.name

    if (updated) {
      await updateList({ id: list.id, name })
    }

    await onSave(updated)
  }

  return (
    <ListForm list={list} onSubmit={onSubmit} />
  )
}