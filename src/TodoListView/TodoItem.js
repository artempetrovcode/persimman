// @flow
import type {Todo} from '../Todo';

import * as React from 'react';
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';
import TodoInput from './TodoInput';
import TodoDateTimeInput  from './TodoDateTimeInput';
import splitText from './splitText';
import {getISODateString, getISOTimeString} from '../lib/timeUtils';
import {decode, encode} from '../lib/encoding';

const {useContext, useState} = React;

type Props = {
  todo: Todo,
}

function TodoItem({todo}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDateEditing, setIsDateEditing] = useState(false);
  const commands = useContext(DispatchContext);
  if (commands == null) {
    return null;
  }
  const {deleteTodo, updateTodoStatus, updateTodo, updateTodoText, updateTodoCompletedAt} = commands;
  const {id, text, completedAt, isDeleted, createdAt, updatedAt} = todo;

  function handleCheckboxChange(e) {
    const isCompleted = e.target.checked;
    updateTodoStatus(todo, isCompleted);
  }
  function handleDeleteClick() {
    const msg = `Delete "${text}"?`
    if (!window.confirm(msg)) {
      return;
    }

    deleteTodo(todo);
  }
  function handleLabelClick() {
    setIsEditing(true);
  }
  function handleInputChange(value) {
    setIsEditing(false);
    updateTodoText(todo, encode(value));
  }
  function handleInputDelete() {
    setIsEditing(false);
    deleteTodo(todo);
  }
  function handleInputCancel() {
    setIsEditing(false);
  }

  function handleDateClick() {
    setIsDateEditing(true);
  }
  function handleDateTimeCancel() {
    setIsDateEditing(false);
  }
  function handleDateTimeChange(newCompletedAt: number) {
    setIsDateEditing(false);
    updateTodoCompletedAt(todo, newCompletedAt);
  }

  const style = {
    fontWeight: 'bold', 
    textDecoration: 'underline',
    cursor: 'pointer',
  };
  const spans = splitText(text, (t, index) => <span key={index}>{t}</span>, (t, index) => <span style={style} key={index}>{t}</span>)

  return (
    <li>
      <div style={{display: 'flex'}}>
        <input
          checked={completedAt != null}
          type="checkbox"
          onChange={handleCheckboxChange}
        />
        {isEditing ?
          <TodoInput 
            style={{flex:1}}
            onCancel={handleInputCancel}
            onDelete={handleInputDelete}
            onChange={handleInputChange}
            initialValue={decode(text)} />  
          :
          <label style={{padding: '2px', border: '1px solid transparent', lineHeight: '19px', whiteSpace: 'pre-line'}}>
            {completedAt == null ? 
              <span onClick={handleLabelClick}>{spans}</span> :
              <>
                <s onClick={handleLabelClick}>{spans}</s>
                {isDateEditing ? 
                  <TodoDateTimeInput 
                    onChange={handleDateTimeChange}
                    onCancel={handleDateTimeCancel}
                    timestamp={completedAt}
                  />: 
                  <span onClick={handleDateClick}> [{getISODateString(new Date(completedAt))} {getISOTimeString(new Date(completedAt))}]</span>
                }
              </>
            }
          </label>
        }
        
        <button onClick={handleDeleteClick}>x</button>
      </div>
    </li>
  );
}

export default TodoItem;