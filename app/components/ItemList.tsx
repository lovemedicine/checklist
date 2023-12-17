import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, DroppableProps } from '@hello-pangea/dnd'
import { Checkbox, TextField, Button } from '@mui/material'
import Item from './Item'
import { Item as ItemType } from '../types/models'
import { addItem, fetchAllItems, reorderItem } from '../util/api'

type ItemListProps = {
  listId: number
}

// taken from:
// https://github.com/atlassian/react-beautiful-dnd/issues/2399#issuecomment-1175638194
const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true))

    return () => {
      cancelAnimationFrame(animation)
      setEnabled(false)
    }
  }, [])

  if (!enabled) {
    return null
  }

  return <Droppable {...props}>{children}</Droppable>
}

export default function ItemList({ listId }: ItemListProps) {
  const [newItem, setNewItem] = useState<string>("")
  const [items, setItems] = useState<ItemType[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    refreshItems()
  }, [])

  async function refreshItems() {
    const data = await fetchAllItems(listId)
    setItems(data)
    setIsLoading(false)
  }

  async function handleDragEnd(result) {
    const { destination, source } = result

    if (!destination) {
      return
    }

    if (destination.index === source.index) {
      return
    }

    let newItems = [...items]
    newItems.splice(source.index, 1)
    newItems.splice(destination.index, 0, items[source.index])

    setItems(newItems)
    await reorderItem({ from: source.index + 1, to: destination.index + 1 })
  }

  async function handleAddItem(event) {
    event.preventDefault()

    if (newItem.length > 0) {
      await addItem({ listId, name: newItem })
      await refreshItems()
      setNewItem("")
    }
  }

  return (
    <>
      { isLoading && <div>Loading...</div> }
      { !isLoading &&
        <>
          <DragDropContext onDragEnd={handleDragEnd}>
            <StrictModeDroppable droppableId={`droppable-${listId}`}>
              { provided => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  { items.map((item, index) => (
                    <Item key={item.id} listId={listId} item={item} selected={item.lists.length > 0} index={index} />
                  )) }
                  { provided.placeholder }
                </div>
              ) }
            </StrictModeDroppable>
          </DragDropContext>

          <form onSubmit={handleAddItem} cx={{ display: 'inline-block' }}>
            <Checkbox checked={true} disabled={true} />&nbsp;
            <TextField
              variant="outlined"
              size="small"
              placeholder="New item"
              onChange={event => setNewItem(event.target.value)}
              value={newItem}
              />
          </form>
        </>
      }
    </>
  )
}

