export type Item = {
  id: number
  name: string
  order?: number
  createdAt?: string
}

export type List = {
  id: number
  name: string
  date: string
  createdAt?: string
  Items?: ListItem[]
}

export type ListItem = {
  id: number
  createdAt: string
  list: List
  item: Item
}
