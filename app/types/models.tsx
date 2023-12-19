export type Item = {
  id: number
  name: string
  order: number
  createdAt: string
  lists: ListItem[]
}

export type List = {
  id: number
  name: string
  date: string
  createdAt?: string
  items?: ListItem[]
}

export type ListItem = {
  id: number
  createdAt: string
  list: List
  item: Item
}
