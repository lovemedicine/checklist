import { useState } from 'react'
import { Box, TextField, Button, CircularProgress } from '@mui/material'
import { List } from '@/types/models'

type ListFormProps = {
  list?: List,
  onSubmit: (name: string) => any
}

export default function ListForm({ list, onSubmit }: ListFormProps) {
  let [name, setName] = useState(list?.name || "")
  let [isValid, setIsValid] = useState(true)
  let [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedName = name.trim()

    if (trimmedName.length > 0) {
      setIsLoading(true)
      await onSubmit(trimmedName)
      if (!list) setName("")
      setIsValid(true)
      setIsLoading(false)
    } else {
      setIsValid(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
      <Box sx={{ display: "flex", width: "100%", maxWidth: "400px" }}>
        <Box sx={{ flexGrow: 4 }}>
          <TextField
            sx={{ width: "100%" }}
            variant="outlined"
            size="small"
            placeholder="List name"
            onChange={event => setName(event.target.value)}
            value={name}
            error={!isValid}
            helperText={isValid ? "" : "Name can't be blank"}
            disabled={isLoading}
            />
        </Box>

        <Box sx={{ flexGrow: 2, ml: 1 }}>
          <Button
            sx={{ textTransform: 'none', height: "40px", width: "100%" }}
            variant="outlined"
            type="submit"
            disabled={isLoading}
          >{ list ? 'Done' : 'Create' }</Button>
        </Box>

        <Box sx={{ flexGrow: 1, pl: 1 }}>
          <CircularProgress
            size="1.5rem"
            sx={{ position: "relative", top: "7px", visibility: isLoading ? "visible" : "hidden" }}
            />
        </Box>
      </Box>
    </form>
  )
}