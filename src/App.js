// @flow
import * as React from 'react';
import useDataApi from './useDataApi';

function App() {
  const [state, setUrl, addTodo] = useDataApi();

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
        </div>
      ))}
      {state.isAppending ? 'Appending...' : <button onClick={handleAddClick}>Add</button>}
      
    </>
  )
}

export default App;