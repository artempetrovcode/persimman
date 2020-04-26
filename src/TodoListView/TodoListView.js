// @flow
import type {Todo} from '../Todo';
import * as React from 'react';
import StateContext from '../StateContext';
import TodoItem from './TodoItem';

const {useContext} = React;

type Props = $ReadOnly<{|
  todos: $ReadOnlyArray<Todo>,
|}>;

function TodoListView({todos}: Props) {
  const state = useContext(StateContext);

  if (state.isLoading) {
    return <div>Loading...</div>;
  }

  if (state.isError) {
    return <div>Error...</div>;
  }
  
  return (
    <ul>
      {todos.slice().sort((a, b) => b.createdAt - a.createdAt).map((todo, i) => <li key={todo.id}><TodoItem todo={todo} /></li> )}
    </ul>
  )
}

export default TodoListView;