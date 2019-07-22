// @flow
import * as React from 'react';
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';
// import useDataApi from '../useDataApi';
const {useContext} = React;

function TodoListView() {
  // const [state, setUrl, addTodo, updateTodo] = useDataApi();
  const state = useContext(StateContext)
  const {addTodo, updateTodo} = useContext(DispatchContext);

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