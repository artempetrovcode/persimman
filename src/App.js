// @flow
import * as React from 'react';
import useDataApi from './useDataApi';

function App() {
  const [state, setUrl] = useDataApi();

  if (state.isLoading) {
    return <div>Loading...</div>;
  }

  if (state.isError) {
    return <div>Error...</div>;
  }
  
  return (
    <>
      {state.todos.map(todo => (
        <div>
          {todo.id} {todo.text}
        </div>
      ))}
    </>
  )
}

export default App;