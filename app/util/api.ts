export function fetcher(input: RequestInfo | URL, init?: RequestInit | undefined) {
  return fetch(input, init).then(res => res.json())
}

export async function addList(list: { name: string }) {
  const response = await fetch('/api/list', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(list),
  })
  return await response.json()
}

export async function updateList({ id, name }: { id: number, name: string }) {
  const response = await fetch(`/api/list/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  })
  return await response.json()
}

export async function deleteList(id: number) {
  await fetch(`/api/list/${id}`, {
    method: 'DELETE',
  })
}

export async function addItem({ listId, name }: { listId: number, name: string }) {
  const response = await fetch(`/api/list/${listId}/item`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  })
  return await response.json()
}

export async function addListItem({ listId, itemId }: { listId: number, itemId: number }) {
  const response = await fetch(`/api/list/${listId}/item/${itemId}`, {
    method: 'PUT'
  })
}

export async function removeListItem({ listId, itemId }: { listId: number, itemId: number }) {
  const response = await fetch(`/api/list/${listId}/item/${itemId}`, {
    method: 'DELETE',
  })
}

export async function reorderItem({ from, to }: { from: number, to: number }) {
  const response = await fetch(`/api/item`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to }),
  })
}

export async function deleteItem(id: number) {
  const response = await fetch(`/api/item/${id}`, {
    method: 'DELETE'
  })
}
