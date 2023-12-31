export type User = {
  id: number
  googleId: string
  createdAd: string
  lists: List[]
  items: Item[]
}

export type Item = {
  id: number
  name: string
  order: number
  createdAt: string
  userId: number
  user: User
  lists: ListItem[]
}

export type List = {
  id: number
  name: string
  createdAt: string
  userId: number
  user: User
  items: ListItem[]
}

export type ListItem = {
  id: number
  createdAt: string
  list: List
  item: Item
}
