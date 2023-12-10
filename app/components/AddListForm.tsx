import { useState } from 'react'
import { Grid, TextField, Button } from '@mui/material'
import { addList } from '../util/api'

type AddListFormProps = {
  refreshSkills: () => any
}

export default function AddListForm({ refreshLists }: AddListFormProps) {
  let [name, setName] = useState<string>("")
  let [date, setDate] = useState<string>("")
  let [isValid, setIsValid] = useState<boolean>(true)

  async function handleAddList(event) {
    event.preventDefault()

    if (date.length === 0 || date.match(/\d{4}-\d{2}-\d{2}/i)) {
      await addList({ name, date })
      setName("")
      setDate("")
      setIsValid(true)
      refreshLists()
    } else {
      setIsValid(false)
    }
  }

  return (
    <form onSubmit={handleAddList}>
      <Grid container>
        <Grid item>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Name"
            onChange={event => setName(event.target.value)}
            value={name}
            />
        </Grid>
        <Grid item>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Date (YYYY-MM-DD)"
            onChange={event => setDate(event.target.value)}
            value={date}
            error={!isValid}
            helperText={isValid ? "" : "Dates must be YYYY-MM-DD"}
            />
        </Grid>
        <Grid item alignItems="stretch" style={{ display: "flex" }}>
          &nbsp;
          <Button
            sx={{ textTransform: 'none' }}
            variant="outlined"
            type="submit"
          >Create</Button>
        </Grid>
      </Grid>
    </form>
  )
}
