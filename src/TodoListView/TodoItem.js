// @flow
import type {Todo} from '../Todo';

import * as React from 'react';
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';
import TodoInput from './TodoInput';
import TodoDateTimeInput  from './TodoDateTimeInput';
import splitText from './splitText';
import {formatDate, formatDateTime, getTodayMidnightTimestamp} from '../lib/timeUtils';
import {decode, encode} from '../lib/encoding';

const {useContext, useState} = React;

type Props = {
  todo: Todo,
}

function TodoItem({todo}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingProps, setIsEditingProps] = useState(false);
  const commands = useContext(DispatchContext);
  if (commands == null) {
    return null;
  }
  const {
    deleteTodo, 
    updateTodoStatus, 
    updateTodo, 
    updateTodoText, 
    updateTodoCompletedAt, 
    updateTodoCreatedAt,
    updateTodoEta
  } = commands;
  const {id, text, createdAt, completedAt, isDeleted, updatedAt, eta} = todo;

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
  function handleCompletedAtChange(newCompletedAt: number) {
    updateTodoCompletedAt(todo, newCompletedAt);
  }
  function handleCreatedAtChange(createdAt: number) {
    updateTodoCreatedAt(todo, createdAt);
  }
  function handleEtaChange(newEta: number) {
    updateTodoEta(todo, newEta);
  }

  const style = {
    fontWeight: 'bold', 
    textDecoration: 'underline',
    cursor: 'pointer',
  };
  const spans = splitText(text, (t, index) => <span key={index}>{t}</span>, (t, index) => <span style={style} key={index}>{t}</span>)

  return (
    <div style={{display: 'flex'}}>
      <input
        checked={completedAt != null}
        type="checkbox"
        onChange={handleCheckboxChange}
      />
      {isEditing ?
        <>
        <TodoInput 
          style={{flex:1}}
          onCancel={handleInputCancel}
          onDelete={handleInputDelete}
          onChange={handleInputChange}
          initialValue={decode(text)} />
        </> :
        <label style={{padding: '2px', border: '1px solid transparent', lineHeight: '19px', whiteSpace: 'pre-line'}}>
          {completedAt == null ? 
            <span onClick={handleLabelClick}>{spans}</span> :
            <>
              <s onClick={handleLabelClick}>{spans}</s>
              <span> [{formatDateTime(completedAt)}]</span>
            </>
          }
          {eta == null ? null : <span>{' '}<i>{`[ETA: ${formatDate(eta)}]`}</i></span>}
        </label>
      }
      {
        isEditingProps ?
          <> 
            <button onClick={() => setIsEditingProps(false)}>close</button>
            <span>createdAt: </span>
            <TodoDateTimeInput
              onChange={handleCreatedAtChange}
              onCancel={() => {}}
              timestamp={createdAt}
            />
            {
              completedAt == null ?
                <button>set completedAt[tbd]</button> :
                <>
                  <span>CompletedAt: </span>
                  <TodoDateTimeInput 
                    onChange={handleCompletedAtChange}
                    onCancel={() => {}}
                    timestamp={completedAt}
                  />
                </> 
            }
            {
              eta == null ?
                <button onClick={() => handleEtaChange(Date.now())}>set eta</button> :
                <>
                  <span>ETA: </span>
                  <TodoDateTimeInput 
                    onChange={handleEtaChange}
                    onCancel={() => {}}
                    timestamp={eta}
                  />
                </> 
            }
            <button onClick={handleDeleteClick}>delete</button>
          </> :
          <button onClick={() => setIsEditingProps(true)}>edit props</button>
      }
    </div>
  );
}

export default TodoItem;