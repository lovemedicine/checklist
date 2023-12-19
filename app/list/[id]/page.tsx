'use client'

import useSWR from 'swr'
import { Box, Typography } from '@mui/material'
import ItemList from '../../components/ItemList'
import { List } from '../../types/models'
import { fetcher } from '../../util/api'

type ListPageProps = {
  params: {
    id: string
  }
}

export default function ListPage({ params: { id } }: ListPageProps) {
  const { data: list, error, isLoading, mutate: refreshList } = useSWR<List>(`/api/list/${id}`, fetcher)

  if (error) return <div>Error loading list</div>
  if (isLoading) return <div>Loading...</div>
  if (!list) return null

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5">List: {list.name} {list.date}</Typography>
      </Box>

      <div style={{ columnWidth: '200px', columnGap: '20px', columnFill: 'auto', height: 'calc(100vh - 130px)' }}>
        <ItemList listId={list.id} />
      </div>
    </>
  )
}
