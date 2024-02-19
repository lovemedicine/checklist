export async function fetcher(
  input: RequestInfo | URL,
  init?: RequestInit | undefined
): Promise<any> {
  const result = await fetch(input, init);
  return await result.json();
}

export async function addList(list: { name: string }) {
  const response = await fetch("/api/list", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(list),
  });
  return await response.json();
}

export async function updateList({ id, name }: { id: number; name: string }) {
  const response = await fetch(`/api/list/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  return await response.json();
}

export async function deleteList(id: number) {
  const response = await fetch(`/api/list/${id}`, {
    method: "DELETE",
  });
  return response.json();
}

export async function addItem({
  listId,
  name,
}: {
  listId: number;
  name: string;
}) {
  const response = await fetch(`/api/list/${listId}/item`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  return await response.json();
}

export async function updateListItem({
  listId,
  itemId,
  checked,
}: {
  listId: number;
  itemId: number;
  checked: boolean;
}) {
  const response = await fetch(`/api/list/${listId}/item/${itemId}`, {
    method: "PUT",
    body: JSON.stringify({ checked }),
  });
  return response.json();
}

export async function reorderItem({
  listId,
  from,
  to,
}: {
  listId: number;
  from: number;
  to: number;
}) {
  const response = await fetch(`/api/list/${listId}/item`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ from, to }),
  });
  return response.json();
}

export async function deleteItem({
  id,
  listId,
}: {
  id: number;
  listId: number;
}) {
  const response = await fetch(`/api/list/${listId}/item/${id}`, {
    method: "DELETE",
  });
  return response.json();
}
