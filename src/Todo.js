export type Todo = $ReadOnly<{|
  row: number,
  id: string,
  text: string,
  userId: string,
  completedAt: string,
  isDeleted: boolean,
  createdAt: string,
  completedAt: string,
  updatedAt: string,
|}>;