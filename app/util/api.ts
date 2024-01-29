export async function fetcher(
  input: RequestInfo | URL,
  init?: RequestInit | undefined,
): Promise<any> {
  const result = await fetch(input, init);
  return await result.json();
}

export function createFetcherWithCallback<T>(callback: (data: T) => any) {
  return async function (
    input: RequestInfo | URL,
    init?: RequestInit | undefined,
  ): Promise<T> {
    const data = await fetcher(input, init);
    callback(data);
    return data;
  };
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

export async function addListItem({
  listId,
  itemId,
}: {
  listId: number;
  itemId: number;
}) {
  const response = await fetch(`/api/list/${listId}/item/${itemId}`, {
    method: "PUT",
  });
  return response.json();
}

export async function removeListItem({
  listId,
  itemId,
}: {
  listId: number;
  itemId: number;
}) {
  const response = await fetch(`/api/list/${listId}/item/${itemId}`, {
    method: "DELETE",
  });
  return response.json();
}

export async function reorderItem({ from, to }: { from: number; to: number }) {
  const response = await fetch(`/api/item`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ from, to }),
  });
  return response.json();
}

export async function deleteItem(id: number) {
  const response = await fetch(`/api/item/${id}`, {
    method: "DELETE",
  });
  return response.json();
}
