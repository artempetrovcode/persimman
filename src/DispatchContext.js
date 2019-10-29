// @flow
import * as React from 'react';
import type {Todo} from './Todo';

type Commands = $ReadOnly<{|
  addTodo: (text: string, isCompleted: boolean, timeOffsetInMs: number) => void,
  updateTodo: (todo: Todo) => void,
  updateTodoStatus: (todo: Todo, isCompleted: boolean) => void,
  deleteTodo: (todo: Todo) => void,
  updateTodoText: (todo: Todo, text: string) => void,
  updateTodoCompletedAt: (todo: Todo, completedAt: number) => void,
|}>;

const DispatchContext = React.createContext<?Commands>(null);

export default DispatchContext;
