// @flow
import * as React from 'react';
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';
import TodoItem from './TodoItem';

const {useContext, useState} = React;
const ENTER_KEY_CODE = 13;
const SEARCH_WAIT_MS = 10;

function TodoListView() {
  const state = useContext(StateContext)
  const {addTodo, updateTodo} = useContext(DispatchContext);
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState(query);
  const [showCompleted, setShowCompleted] = useState(true);
  const [text, setText] = useState('');
  const [lastTimeoutId, setLastTimeoutId] = useState(null);

  function handleTextChange(e) {
    setText(e.target.value);
  }

  function handleAddClick() {
    if (text !== '') {
      addTodo(text);
      setText('');
    }
  }

  function handleKeyDown(e) {
    if (e.keyCode === ENTER_KEY_CODE) {
      handleAddClick();
    }
  }

  function handleSeachChange(e) {
    const value = e.target.value;
    lastTimeoutId && window.clearTimeout(lastTimeoutId);
    setSearch(value);
    setLastTimeoutId(window.setTimeout(() => setQuery(value), SEARCH_WAIT_MS))
  }

  function handleClearClick() {
    lastTimeoutId && window.clearTimeout(lastTimeoutId);
    setSearch('');
    setQuery('')
  }

  function handleQuickAdd(text: string) {
    addTodo(text);
  }

  const quickButtons = [
    '@diet balanced breakfast',
    '@diet balanced lunch',
    '@diet balanced dinner',
    '@diet oatmeal breakfast',
    '@diet healthy brunch',
    '@diet haalthy afternoon snack',
    '@flexibility 30 min stretch',
    '@flexibility yoga',
    '@gym 60 min treadmill',
    '@gym 60 min session',
    '@anki review',
  ];

  console.log(state);
  if (state.isLoading) {
    return <div>Loading...</div>;
  }

  if (state.isError) {
    return <div>Error...</div>;
  }
  
  return (
    <>
      <div style={{
        display:'flex', 
        flexWrap: 'wrap', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '1em'
      }}> 
        {quickButtons.map((val, i) => (
          <input
            type="button"
            onClick={() => handleQuickAdd(val)}
            value={val} 
            key={i} />
        ))}      
      </div>
      <div style={{
        display:'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '1em'
      }}>
        <input
          type="text" 
          value={text} 
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          style={{border:'1px solid', 'flex': 1}}
        />
        <button
          onClick={handleAddClick}
          style={{margin: '5px'}}
        >Add</button>
      </div>
      <div>
        Search
        <input 
          type="text"
          value={search}
          onChange={handleSeachChange}
        />
        <button onClick={handleClearClick}>Clear Search</button>
        <label> 
          <input 
            type="checkbox" 
            checked={showCompleted}
            onChange={e => setShowCompleted(e.target.checked)}
          />
          Show Completed
        </label>
      </div>
      <ul>`
        {state.todos.filter(todo => {
          const isMatch = todo.text.match(query);
          if (!isMatch) {
            return false;
          }
          if (showCompleted) {
            return true;
          } else {
            return todo.completedAt === '';
          }
        }).map((todo, i) => <TodoItem key={todo.id} todo={todo} /> )}
      </ul>
    </>
  )
}

export default TodoListView;