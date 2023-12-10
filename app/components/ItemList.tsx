import { useState } from 'react'
import { Checkbox, TextField, Button } from '@mui/material'
import Item from './Item'
import { Item as ItemType } from '../types/models'
import { addItem } from '../util/api'

type ItemListProps = {
  listid: number
  items: ItemType[]
  selectedIds: number[]
  refreshList: () => any
}

export default function ItemList({ listId, items, refreshList }: ItemListProps) {
  const [newItem, setNewItem] = useState<string>("")

  async function handleAddItem(event) {
    event.preventDefault()

    if (newItem.length > 0) {
      await addItem({ listId, name: newItem })
      await refreshList()
      setNewItem("")
    }
  }

  return (
    <>
      { items.map(item => (
        <Item listId={listId} item={item} selected={item.lists.length > 0} />
      )) }

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
  )
}

