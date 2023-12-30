'use client'

import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { Typography, Button, Grid, Box } from '@mui/material'
import { ContentCopy, BackHandOutlined, CheckCircleOutlined } from '@mui/icons-material'
import ItemList from '@/components/ItemList'
import { List, Item } from '@/types/models'
import { fetcher } from '@/util/api'

type ListPageProps = {
  params: {
    id: string
  }
}

export default function ListPage({ params: { id } }: ListPageProps) {
  const { data: list, error, isLoading, mutate: refreshList } = useSWR<List>(`/api/list/${id}`, fetcher)
  const {
    data: items, error: itemsError, isLoading: isLoadingItems, mutate: refreshItems
  } = useSWR<Item[]>(`/api/list/${id}/item`, fetcher)
  const [copied, setCopied] = useState(false)
  const [isReorderMode, setIsReorderMode] = useState(false)

  useEffect(() => {
    if (copied) {
      const timeout = window.setTimeout(() => {
        setCopied(false)
      }, 5000)

      return () => {
        clearTimeout(timeout)
      }
    }

  }, [copied])

  if (error) return <div>Error loading list</div>
  if (isLoading) return <div>Loading...</div>
  if (!list) return null

  function handleCopy(event: React.MouseEvent<HTMLButtonElement>) {
    const itemsText = (items as Item[]).filter(item => item.lists.length > 0).map(item => item.name).join("\n")
    navigator.clipboard.writeText(itemsText)
    setCopied(true)
  }

  function handleToggleReorderMode() {
    setIsReorderMode(!isReorderMode)
  }

  return (
    <>
      <Box sx={{ mb: 1 }}>
        <Typography variant="h4">{list.name}</Typography>
      </Box>
      <Grid container sx={{ mb: 2 }}>
        <Grid item>
          <Button
            variant="outlined"
            size="small"
            startIcon={isReorderMode ? <CheckCircleOutlined /> : <BackHandOutlined />}
            onClick={handleToggleReorderMode}
          >
            { isReorderMode ? "Finish Reorder" : "Reorder Items" }
          </Button>
        </Grid>
        <Grid item sx={{ ml: 2 }}>
          <Button variant="outlined" size="small" startIcon={<ContentCopy />} onClick={handleCopy}>
            Copy selected
          </Button>
        </Grid>
        <Grid item sx={{ p: '5px', pl: '10px', color: 'grey' }}>
          { copied && "Copied to clipboard" }
        </Grid>
      </Grid>

      <div className={isReorderMode ? 'item-list-reorder' : 'item-list-fixed'}>
        <ItemList
          listId={list.id}
          items={items}
          refreshItems={refreshItems}
          error={itemsError}
          isLoading={isLoadingItems}
          enableDrag={isReorderMode}
          />
      </div>
    </>
  )
}
