export type User = {
  id: number;
  googleId: string;
  createdAt: string;
  lists?: List[];
  items?: Item[];
};

export type Item = {
  id: number;
  name: string;
  order: number;
  createdAt: string;
  userId: number;
  user?: User;
  lists?: ListItem[];
  isOptimistic?: boolean;
};

export type List = {
  id: number;
  name: string;
  createdAt: string;
  userId: number;
  user?: User;
  items?: ListItem[];
  isOptimistic: boolean;
};

export type ListItem = {
  id: number;
  createdAt: string;
  listId: number;
  list?: List;
  itemId: number;
  item?: Item;
};
