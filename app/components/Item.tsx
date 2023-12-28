import { useState } from 'react'
import { Draggable } from '@hello-pangea/dnd'
import { Checkbox } from '@mui/material'
import { DeleteForever } from '@mui/icons-material'
import { Item as ItemType } from '../types/models'
import { addListItem, removeListItem, deleteItem } from '../util/api'

type ItemProps = {
  listId: number
  item: ItemType
  selected: boolean
  index: number
  onDelete: () => any
  enableDrag: boolean
}

export default function Item({ item, listId, selected, index, onDelete, enableDrag }: ItemProps) {
  const [checked, setChecked] = useState<boolean>(selected)

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const data = { listId, itemId: item.id }
    const { checked } = event.target

    if (checked) {
      await addListItem(data)
    } else {
      await removeListItem(data)
    }

    setChecked(checked)
  }

  async function handleDelete() {
    await deleteItem(item.id)
    onDelete()
  }

  return (
    <Draggable draggableId={`draggable-${item.id}`} index={index} isDragDisabled={!enableDrag}>
      { provided => (
        <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
          <div className="item" style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <Checkbox checked={checked} onChange={handleChange} sx={{ padding: '5px' }} />
              &nbsp;{item.name}
            </div>
            <div>
              <DeleteForever className="item-delete-button" sx={{ color: 'grey', position: 'relative', top: 5 }} onClick={handleDelete} />
            </div>
          </div>
        </div>
      )}
    </Draggable>
  )
}
