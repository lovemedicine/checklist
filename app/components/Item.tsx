import { useState } from 'react'
import { Draggable } from '@hello-pangea/dnd'
import { Checkbox, CircularProgress } from '@mui/material'
import { DeleteForever } from '@mui/icons-material'
import { Item as ItemType } from '@/types/models'
import { addListItem, removeListItem, deleteItem } from '@/util/api'

type ItemProps = {
  listId: number
  item: ItemType
  selected: boolean
  index: number
  onDelete: (id: number) => any
  enableDrag: boolean
}

export default function Item({ item, listId, selected, index, onDelete, enableDrag }: ItemProps) {
  const [checked, setChecked] = useState(selected)
  const [isDeleting, setIsDeleting] = useState(false)

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
    setIsDeleting(true)
    await deleteItem(item.id)
    setIsDeleting(false)
    onDelete(item.id)
  }

  return (
    <Draggable draggableId={`draggable-${item.id}`} index={index} isDragDisabled={!enableDrag}>
      { provided => (
        <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
          <div className="item" style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <Checkbox checked={checked} onChange={handleChange} sx={{ padding: '5px' }} />
              &nbsp;
              <div className="item-name">
                {item.name}
              </div>
            </div>
            <div className="item-delete" style={{ display: "inline-block", verticalAlign: "middle" }}>
              { isDeleting &&
                <CircularProgress size="1.5rem" sx={{ position: "relative", top: "7px" }} />
              }
              { !isDeleting &&
                <DeleteForever
                  className="item-delete-button"
                  sx={{ color: 'grey', position: 'relative', top: 10 }}
                  onClick={handleDelete}
                  />
              }
            </div>
          </div>
        </div>
      )}
    </Draggable>
  )
}
