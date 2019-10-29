// @flow
import * as React from 'react';
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';
import TodoItem from './TodoItem';
import ResizableTextarea from '../ResizableTextarea';
import {encode} from '../lib/encoding';

const {useContext, useState} = React;
const ENTER_KEY_CODE = 13;
const SEARCH_WAIT_MS = 10;

function TodoListView() {
  const state = useContext(StateContext);
  const commands = useContext(DispatchContext);
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState(query);
  const [showCompleted, setShowCompleted] = useState(false);
  const [text, setText] = useState('');
  const [lastTimeoutId, setLastTimeoutId] = useState(null);
  if (commands == null) {
    return null;
  }
  const {addTodo} = commands;

  function handleTextChange(e) {
    setText(e.target.value);
  }

  function handleAddClick() {
    if (text !== '') {
      addTodo(encode(text), false, state.timeOffsetInMs);
      setText('');
    }
  }

  function handleKeyDown(e) {
    if (e.keyCode === ENTER_KEY_CODE && e.metaKey) {
      if (e.shiftKey) {
        if (text !== '') {
          addTodo(text, true, state.timeOffsetInMs);
          setText('');
        }
      } else {
        handleAddClick();
      }
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
      </div>
      <div style={{
        display:'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '1em'
      }}>
        <ResizableTextarea value={text} onChange={value => setText(value)} onKeyDown={handleKeyDown}/>
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
      <ul>
        {state.todos.slice().sort((a, b) => b.createdAt - a.createdAt).filter(todo => {
          const isMatch = todo.text.match(query);
          if (!isMatch) {
            return false;
          }
          if (showCompleted) {
            return true;
          } else {
            return todo.completedAt == null;
          }
        }).map((todo, i) => <TodoItem key={todo.id} todo={todo} /> )}
      </ul>
    </>
  )
}

export default TodoListView;