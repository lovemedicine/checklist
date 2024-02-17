export type User = {
  id: number;
  googleId: string;
  createdAt: string;
  lists?: List[];
};

export type Item = {
  id: number;
  name: string;
  order: number;
  checked: boolean;
  createdAt: string;
  listId: number;
  list?: List;
  isOptimistic?: boolean;
};

export type List = {
  id: number;
  name: string;
  createdAt: string;
  userId: number;
  user?: User;
  items?: Item[];
  isOptimistic: boolean;
};
