'use client'

import { useState, useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import AddListForm from './components/AddListForm'
import ListList from './components/ListList'
import { List } from './types/models'
import { fetchLists } from './util/api'

export default function Home() {
  let [lists, setLists] = useState<List[]>([])
  let [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    refreshLists()
    return () => {}
  }, [])

  async function refreshLists() {
    setIsLoading(true)
    const result = await fetchLists()
    setLists(result)
    setIsLoading(false)
  }

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">Create a list</Typography>
        <AddListForm refreshLists={refreshLists} />
      </Box>

      <Typography variant="h6">All lists</Typography>
      <ListList lists={lists} isLoading={isLoading} refreshLists={refreshLists} />
    </>
  )
}
