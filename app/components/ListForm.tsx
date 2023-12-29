import { useState } from 'react'
import { Grid, TextField, Button, CircularProgress } from '@mui/material'
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
      console.log("handler", isLoading)
      await onSubmit(trimmedName)
      if (!list) setName("")
      setIsValid(true)
      setIsLoading(false)
      console.log("handler", isLoading)
    } else {
      setIsValid(false)
    }
  }

  console.log("component", isLoading)

  return (
    <form onSubmit={handleSubmit}>
      <Grid>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Name"
          onChange={event => setName(event.target.value)}
          value={name}
          error={!isValid}
          helperText={isValid ? "" : "Name can't be blank"}
          disabled={isLoading}
          />

        <Button
          sx={{ textTransform: 'none', ml: 1, height: "40px" }}
          variant="outlined"
          type="submit"
          disabled={isLoading}
        >{ list ? 'Save' : 'Create' }</Button>

        { isLoading && <CircularProgress size="1.5rem" sx={{ ml: 1, position: "relative", top: "7px" }} /> }
      </Grid>
    </form>
  )
}