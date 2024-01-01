import { useState } from 'react'
import { Button, CircularProgress } from '@mui/material'
import { Add } from '@mui/icons-material'
import { addList } from '@/util/api'

type AddListButtonProps = {
  refreshLists: () => any
}

export default function AddListButton({ refreshLists }: AddListButtonProps) {
  const [isSending, setIsSending] = useState(false)

  async function handleClick(event: React.MouseEvent<HTMLElement>) {
    setIsSending(true)
    await addList({ name: 'untitled list' })
    await refreshLists()
    setIsSending(false)
  }

  return (
    <>
      <Button variant="contained" size="large" startIcon={<Add />} disabled={isSending} onClick={handleClick}>
        Create
      </Button>
      { isSending &&
        <CircularProgress size="1.3rem" sx={{ ml: 1.5, position: 'relative', top: '5px' }} />
      }
    </>
  )
}
