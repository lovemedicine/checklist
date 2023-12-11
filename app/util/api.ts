import { Item, List } from '../types/models'

export async function fetchLists() {
  const response = await fetch('/api/list')
  return await response.json()
}

export async function addList(list: List) {
  const response = await fetch('/api/list', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(list),
  })
  return await response.json()
}

export async function deleteList(id: number) {
  await fetch(`/api/list/${id}`, {
    method: 'DELETE',
  })
}

export async function fetchList(id: number) {
  const response = await fetch(`/api/list/${id}`)
  return await response.json()
}

export async function fetchAllItems(listId: number) {
  const response = await fetch(`/api/list/${listId}/item`)
  return await response.json()
}

export async function addItem({ listId, name }) {
  const response = await fetch(`/api/list/${listId}/item`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  })
}

export async function addListItem({ listId, itemId }) {
  const response = await fetch(`/api/list/${listId}/item/${itemId}`, {
    method: 'PUT'
  })
}

export async function removeListItem({ listId, itemId }) {
  const response = await fetch(`/api/list/${listId}/item/${itemId}`, {
    method: 'DELETE',
  })
}

export async function reorderItem({ from, to }) {
  const response = await fetch(`/api/item`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to }),
  })
}
