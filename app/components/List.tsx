import { useState } from 'react'
import TimeAgo from 'react-timeago'
import Link from 'next/link'
import { Box, Card, CardContent, Typography, IconButton } from '@mui/material'
import { DeleteForever, Edit } from '@mui/icons-material'
import EditList from '@/components/EditList'
import { deleteList } from '@/util/api'
import { List } from '@/types/models'

type ListProps = {
  list: List
  refreshLists: () => any
}

export default function List({ list, refreshLists }: ListProps) {
  const [isEditMode, setIsEditMode] = useState(false)

  const timeFormatter = (value: number, unit: TimeAgo.Unit, suffix: TimeAgo.Suffix) => {
    if (unit === 'second') return 'just now';
    const plural: string = value !== 1 ? 's' : '';
    return `${value} ${unit}${plural} ${suffix}`;
  }

  async function handleDelete(id: number) {
    await deleteList(id)
    refreshLists()
  }

  function toggleEditMode() {
    setIsEditMode(!isEditMode)
  }

  async function onSave() {
    await refreshLists()
    setIsEditMode(false)
  }

  return (
    <Card key={list.id} variant="outlined" sx={{ mt: 1 }}>
      <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          { isEditMode && <EditList list={list} onSave={onSave} /> }
          { !isEditMode &&
            <Box sx={{ display: "flex", height: "40px" }}>
              <Typography variant="h5" sx={{ mt: 0.5 }}>
                <Link href={`/list/${list.id}`}>
                  {list.name}
                </Link>
              </Typography>
              <IconButton aria-label="edit" size="small" sx={{ ml: 1 }} onClick={toggleEditMode}>
                <Edit fontSize="inherit" />
              </IconButton>
            </Box>
          }
          <DeleteForever sx={{ color: 'grey' }} onClick={() => handleDelete(list.id)} />
        </Box>
        <Typography variant="body2">
          <TimeAgo date={list.createdAt} live={false} formatter={timeFormatter} />
        </Typography>
      </CardContent>
    </Card>
  )
}
