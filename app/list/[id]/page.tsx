'use client'

import { useState, useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import ItemList from '../../components/ItemList'
import { List, Item } from '../../types/models'
import { fetchList, fetchAllItems } from '../../util/api'

type ListPageProps = {
  params: {
    id: string
  }
}

export default function ListPage({ params: { id } }: ListPageProps) {
  let [list, setList] = useState<List | null>(null)
  let [items, setItems] = useState<Item[]>([])
  let [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    refreshList()
  }, [])

  async function refreshList() {
    const list = await fetchList(id)
    setList(list)
    await refreshItems(id)
  }

  async function refreshItems(id) {
    const items = await fetchAllItems(id)
    setItems(items)
    setIsLoading(false)
  }

  return (
    <>
      { isLoading && <div>Loading...</div> }
      { !isLoading &&
        <>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h5">List: {list.name} {list.date}</Typography>
          </Box>

          <ItemList listId={list.id} items={items} refreshList={refreshList} />
        </>
      }
    </>
  )
}
