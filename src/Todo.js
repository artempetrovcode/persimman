// @flow

export type Todo = $ReadOnly<{|
  id: string,
  text: string,
  completedAt: ?number,
  isDeleted: boolean,
  createdAt: number,
  updatedAt: number,
  estimate: ?number, // estimate in ms
  timeSpent: ?number, // timeSpent in ms
  eta: ?number,
  parentId: ?string,
|}>;