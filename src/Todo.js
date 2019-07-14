export type Todo = $ReadOnly<{|
  id: string,
  text: string,
  userId: string,
  completedAt: string,
  isDeleted: boolean,
  createdAt: string,
  updatedAt: string,
|}>;