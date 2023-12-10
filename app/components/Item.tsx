import { useState } from 'react'
import { Card, CardContent, Checkbox } from '@mui/material'
import { Item as ItemType } from '../types/models'
import { addListItem, removeListItem } from '../util/api'

type ItemProps = {
  listId: number
  item: ItemType
  selected: boolean
}

export default function Item({ item, listId, selected }: ItemProps) {
  const [checked, setChecked] = useState<boolean>(selected)

  async function handleChange(event) {
    const data = { listId, itemId: item.id }
    const { checked } = event.target

    if (checked) {
      await addListItem(data)
    } else {
      await removeListItem(data)
    }

    setChecked(checked)
  }

  return (
    <div>
      <Checkbox checked={checked} onChange={handleChange} /> {item.name}
    </div>
  )
}
