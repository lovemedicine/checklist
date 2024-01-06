'use client'

import useSWR from 'swr'
import AddListButton from '@/components/AddListButton'
import ListList from '@/components/ListList'
import { List } from '@/types/models'
import { fetcher, addList, updateList, deleteList } from '@/util/api'
import { gql, useQuery } from '@apollo/client'

const listsQuery = gql`
  query {
    lists {
      id
      name
      createdAt
    }
  }
`

export default function Home() {
  const { data: lists, error, loading, refetch: refreshLists } = useQuery<List[]>(listsQuery)

  if (error) return <div>Error loading lists</div>
  if (loading) return <div>Loading...</div>
  if (!lists) return null

  function onAdd(name: string) {
    const maxId = lists?.length ? Math.max(...lists.map(list => list.id)) : 0
    const optimisticData = [
      { id: maxId + 1000000, name, createdAt: new Date().toJSON(), userId: 9999999, isOptimistic: true },
      ...lists || []
    ]
    refreshLists(addList({ name }), { optimisticData })
  }

  function onUpdate(id: number, name: string) {
    const optimisticData = (lists as List[]).map(list => list.id === id ? { ...list, name }: list)
    refreshLists(updateList({ id, name }), { optimisticData })
  }

  function onDelete(id: number) {
    const optimisticData = (lists || []).filter(list => list.id !== id)
    refreshLists(deleteList(id), { optimisticData })
  }

  return (
    <>
      <AddListButton onAdd={onAdd} />
      <ListList lists={lists} onUpdate={onUpdate} onDelete={onDelete} />
    </>
  )
}
