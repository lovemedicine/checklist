import { useState } from 'react'
import { Grid, TextField, Button } from '@mui/material'
import { addList } from '@/util/api'

type AddListFormProps = {
  refreshLists: () => any
}

export default function AddListForm({ refreshLists }: AddListFormProps) {
  let [name, setName] = useState<string>("")
  let [isValid, setIsValid] = useState<boolean>(true)

  async function handleAddList(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedName = name.trim()

    if (trimmedName.length > 0) {
      await addList({ name: trimmedName })
      setName("")
      setIsValid(true)
      refreshLists()
    } else {
      setIsValid(false)
    }
  }

  return (
    <form onSubmit={handleAddList}>
      <Grid sx={{ height: "64px" }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Name"
          onChange={event => setName(event.target.value)}
          value={name}
          error={!isValid}
          helperText={isValid ? "" : "Name can't be blank"}
          />
        <Button
          sx={{ textTransform: 'none', ml: 1, height: "40px" }}
          variant="outlined"
          type="submit"
        >Create</Button>
      </Grid>
    </form>
  )
}
