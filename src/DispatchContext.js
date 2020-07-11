// @flow
import * as React from 'react';
import type {Todo} from './Todo';

type Commands = $ReadOnly<{|
  addTodo: (text: string, isCompleted: boolean, timeOffsetInMs: number, hasEta: boolean) => void,
  updateTodo: (todo: Todo) => void,
  updateTodoStatus: (todo: Todo, isCompleted: boolean) => void,
  updateTodoStatusAndTimeSpent: (todo: Todo, isCompleted: boolean, timeSpent: number) => void,
  deleteTodo: (todo: Todo) => void,
  updateTodoText: (todo: Todo, text: string) => void,
  updateTodoCompletedAt: (todo: Todo, completedAt: number) => void,
  updateTodoEta: (todo: Todo, eta: number) => void,
  updateTodoParentId: (todo: Todo, parentId: ?string) => void,
  updateTodoCreatedAt: (todo: Todo, createdAt: number) => void,
|}>;

const DispatchContext = React.createContext<?Commands>(null);

export default DispatchContext;
