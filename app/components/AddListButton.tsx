import { useState } from 'react'
import { Card, CardContent, CardActionArea, Typography, CircularProgress } from '@mui/material'
import { Add } from '@mui/icons-material'
import { addList } from '@/util/api'

type AddListButtonProps = {
  refreshLists: () => any
}

export default function AddListButton({ refreshLists }: AddListButtonProps) {
  const [isSending, setIsSending] = useState(false)

  async function onClick(event: React.MouseEvent<HTMLElement>) {
    setIsSending(true)
    await addList({ name: 'untitled list' })
    await refreshLists()
    setIsSending(false)
  }

  return (
    <Card className="add-list" variant="outlined" sx={{ mt: 1 }}>
      <CardActionArea onClick={onClick} disabled={isSending}>
        <CardContent sx={{ p: 1, backgroundColor : isSending ? '#eee' : 'inherit' }}>
          <Add fontSize="medium" sx={{ position: 'relative', top: '2px' }} />
          <Typography variant="h5" sx={{ display: 'inline-block', ml: 1 }}>Create List</Typography>
          { isSending &&
            <CircularProgress size="1.5rem" sx={{ ml: 1.5, position: 'relative', top: '3px' }} />
          }
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
