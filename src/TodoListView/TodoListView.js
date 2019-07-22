// @flow
import * as React from 'react';
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';
import TodoItem from './TodoItem';

const {useContext, useState} = React;
const ENTER_KEY_CODE = 13;
const SEARCH_WAIT_MS = 1000;

function TodoListView() {
  const state = useContext(StateContext)
  const {addTodo, updateTodo} = useContext(DispatchContext);
  const [search, setSearch] = useState('');
  const [showCompleted, setShowCompleted] = useState(true);
  const [text, setText] = useState('');
  const [lastTimeoutId, setLastTimeoutId] = useState(null);

  console.log(state);
  if (state.isLoading) {
    return <div>Loading...</div>;
  }

  if (state.isError) {
    return <div>Error...</div>;
  }

  function handleAddClick() {
    addTodo();
  }
  
  return (
    <>
      {/* TOOD add all above */}
      <ul>
        {state.todos.map((todo, i) => <TodoItem key={todo.id} todo={todo} /> )}
      </ul>

      <hr/>
      {state.todos.map(todo => (
        <div key={todo.id}>
          {todo.id} {todo.text}
          [ {todo.completedAt === '' ? 'not completed' : todo.completedAt } ]

          {state.isUpdating ? '[ updating... ]' : 
            <button onClick={() => {
              updateTodo({
                ...todo,
                completedAt: todo.completedAt === '' ? 'completed' : '',
              })
            }}>
              complete
            </button>
          }
        </div>
      ))}
      {state.isAppending ? 'Appending...' : <button onClick={handleAddClick}>Add</button>}
      
    </>
  )
}

export default TodoListView;