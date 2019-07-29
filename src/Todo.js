export type Todo = $ReadOnly<{|
  id: string,
  text: string,
  completedAt: string,
  isDeleted: boolean,
  createdAt: string,
  updatedAt: string,
|}>;