'use client'

import useSWR from 'swr'
import AddListForm from '@/components/AddListForm'
import ListList from '@/components/ListList'
import { List } from '@/types/models'
import { fetcher } from '@/util/api'

export default function Home() {
  const { data: lists, error, isLoading, mutate: refreshLists } = useSWR<List[]>('/api/list', fetcher)

  if (error) return <div>Error loading lists</div>
  if (isLoading) return <div>Loading...</div>
  if (!lists) return null

  return (
    <>
      <AddListForm refreshLists={refreshLists} />
      <ListList lists={lists} refreshLists={refreshLists} />
    </>
  )
}
