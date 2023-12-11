import { useState } from 'react'
import { Draggable } from '@hello-pangea/dnd'
import { Card, CardContent, Checkbox } from '@mui/material'
import { Item as ItemType } from '../types/models'
import { addListItem, removeListItem } from '../util/api'

type ItemProps = {
  listId: number
  item: ItemType
  selected: boolean
  index: number
}

export default function Item({ item, listId, selected, index }: ItemProps) {
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
    <Draggable draggableId={`draggable-${item.id}`} index={index}>
      { provided => (
        <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
          <Checkbox checked={checked} onChange={handleChange} /> {item.name}
        </div>
      )}
    </Draggable>
  )
}
