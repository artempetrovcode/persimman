// @flow

export type Todo = $ReadOnly<{|
  id: string,
  text: string,
  completedAt: ?number,
  isDeleted: boolean,
  createdAt: number,
  updatedAt: number,
  eta: ?number,
  parentId: ?string,
|}>;