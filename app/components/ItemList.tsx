import React, { useState, useEffect } from 'react'
import { DragDropContext, Droppable, DroppableProps } from '@hello-pangea/dnd'
import { Checkbox, TextField } from '@mui/material'
import Item from './Item'
import { Item as ItemType } from '../types/models'
import { addItem, reorderItem, fetcher } from '../util/api'

type ItemListProps = {
  listId: number,
  items: ItemType[] | undefined,
  refreshItems: () => any,
  error: any,
  isLoading: boolean
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

export default function ItemList({ listId, items, refreshItems, error, isLoading }: ItemListProps) {
  const [newItem, setNewItem] = useState<string>("")
  const [orderedItems, setOrderedItems] = useState<ItemType[]>(items || [])

  useEffect(() => {
    setOrderedItems(items || [])
  }, [items])

  async function handleDragEnd(result: any) {
    const { destination, source } = result

    if (!destination) {
      return
    }

    if (destination.index === source.index) {
      return
    }

    let newItems = [...(items as ItemType[])]
    newItems.splice(source.index, 1)
    newItems.splice(destination.index, 0, (items as ItemType[])[source.index])
    setOrderedItems(newItems)

    await reorderItem({ from: source.index + 1, to: destination.index + 1 })
  }

  async function handleAddItem(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (newItem.length > 0) {
      await addItem({ listId, name: newItem })
      await refreshItems()
      setNewItem("")
    }
  }

  if (error) return <div>Error loading list</div>
  if (isLoading) return <div>Loading...</div>
  if (!items) return null

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <StrictModeDroppable droppableId={`droppable-${listId}`}>
          { provided => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              { orderedItems.map((item, index) => (
                <Item key={item.id} listId={listId} item={item} selected={item.lists.length > 0} index={index} onDelete={refreshItems} />
              )) }
              { provided.placeholder }
            </div>
          ) }
        </StrictModeDroppable>
      </DragDropContext>

      <form onSubmit={handleAddItem} style={{ display: 'inline-block' }}>
        <Checkbox checked={true} disabled={true} />&nbsp;
        <TextField
          variant="outlined"
          size="small"
          placeholder="New item"
          onChange={event => setNewItem(event.target.value)}
          value={newItem}
          sx={{ width: '180px' }}
          />
      </form>
    </>
  )
}

