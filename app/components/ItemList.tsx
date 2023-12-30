import React, { useState, useEffect } from 'react'
import { DragDropContext, Droppable, DroppableProps } from '@hello-pangea/dnd'
import Item from '@/components/Item'
import AddItemForm from '@/components/AddItemForm'
import { Item as ItemType } from '@/types/models'
import { reorderItem } from '@/util/api'

type ItemListProps = {
  listId: number,
  items: ItemType[] | undefined,
  refreshItems: () => any,
  error: any,
  isLoading: boolean,
  enableDrag: boolean
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

export default function ItemList({ listId, items, refreshItems, error, isLoading, enableDrag }: ItemListProps) {
  const [orderedItems, setOrderedItems] = useState<ItemType[]>(items || [])

  useEffect(() => {
    setOrderedItems(items || [])
  }, [items?.map(item => item.order.toString() + item.name).join(",")])


  if (error) return <div>Error loading list</div>
  if (isLoading) return <div>Loading...</div>
  if (!orderedItems) return null

  async function handleDragEnd(result: any) {
    const { destination, source } = result

    if (!destination) {
      return
    }

    if (destination.index === source.index) {
      return
    }

    let newItems = [...orderedItems]
    newItems.splice(source.index, 1)
    newItems.splice(destination.index, 0, orderedItems[source.index])
    setOrderedItems(newItems)

    await reorderItem({ from: source.index + 1, to: destination.index + 1 })
  }

  async function onDelete(id: number) {
    setOrderedItems(items => items.filter(item => item.id !== id))
    refreshItems()
  }

  async function onAddItemFormSubmit() {
    await refreshItems()
  }

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <StrictModeDroppable droppableId={`droppable-${listId}`}>
          { provided => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              { orderedItems.map((item, index) => (
                <Item
                  key={item.id}
                  listId={listId}
                  item={item}
                  selected={item.lists.length > 0} index={index}
                  onDelete={onDelete}
                  enableDrag={enableDrag}
                  />
              )) }
              { provided.placeholder }
            </div>
          ) }
        </StrictModeDroppable>
      </DragDropContext>

      <AddItemForm
        listId={listId}
        itemNames={orderedItems.map(item => item.name)}
        onSubmit={onAddItemFormSubmit}
        />
    </>
  )
}

