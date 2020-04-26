// @flow
import * as React from 'react';
import StateContext from './StateContext';
import DispatchContext from './DispatchContext';
import ResizableTextarea from './ResizableTextarea';
import {encode} from './lib/encoding';


const {useContext, useState} = React;
const ENTER_KEY_CODE = 13;

type Props = $ReadOnly<{|
|}>;

function AddTodo(props: Props) {
  const state = useContext(StateContext);
  const commands = useContext(DispatchContext);
  const [text, setText] = useState('');

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

  return (
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
  )
}

export default AddTodo;