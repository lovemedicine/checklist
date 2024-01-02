import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { DragDropContext, Droppable, DroppableProps } from '@hello-pangea/dnd'
import Item from '@/components/Item'
import AddItemForm from '@/components/AddItemForm'
import { Item as ItemType } from '@/types/models'
import { reorderItem, createFetcherWithCallback } from '@/util/api'

type ItemListProps = {
  listId: number,
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

type ItemMap = {
  [key: number]: ItemType
}

function getSortedItemIds(items: ItemType[]): number[] {
  return items.sort((a, b) => a.order - b.order).map(item => item.id)
}

function getOrderedItems(items: ItemType[] | undefined, orderedItemIds: number[]): ItemType[] {
  if (!items?.length) {
    return []
  }

  if (!orderedItemIds?.length) {
    orderedItemIds = getSortedItemIds(items)
  }

  const itemMap = items.reduce((map, item) => {
    map[item.id] = item
    return map
  }, {} as ItemMap)

  return orderedItemIds.map(id => itemMap[id])
}

export default function ItemList({ listId, enableDrag }: ItemListProps) {
  const [orderedItemIds, setOrderedItemIds] = useState<number[]>([])

  const {
    data: items, error, isLoading, mutate: refreshItems
  } = useSWR<ItemType[]>(`/api/list/${listId}/item`,
    createFetcherWithCallback<ItemType[]>(items => {
      setOrderedItemIds(getSortedItemIds(items))
    })
  )

  if (error) return <div>Error loading list</div>
  if (isLoading) return <div>Loading...</div>

  const orderedItems = getOrderedItems(items, orderedItemIds)

  if (!orderedItems?.length) return null

  async function handleDragEnd(result: any) {
    const { destination, source } = result

    if (!destination) return
    if (destination.index === source.index) return

    setOrderedItemIds(orderedItemIds => {
      let newItemIds = [...orderedItemIds]
      newItemIds.splice(source.index, 1)
      newItemIds.splice(destination.index, 0, orderedItemIds[source.index])
      return newItemIds
    })

    const items = await reorderItem({ from: source.index + 1, to: destination.index + 1 })
    refreshItems(items)
  }

  function onDelete(items: ItemType[]) {
    setOrderedItemIds(items.map(item => item.id))
    refreshItems(items)
  }

  function onAddItemFormSubmit(items: ItemType[]) {
    refreshItems(items)
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

