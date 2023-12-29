import List from '@/components/List'
import { List as ListType } from '@/types/models'

type ListListProps = {
  lists: ListType[]
  refreshLists: () => any
}

export default function ListList({ lists, refreshLists }: ListListProps) {
  return (
    <>
      { lists.map(list => (
        <List key={list.id} list={list} refreshLists={refreshLists} />
      )) }
    </>
  )
}

