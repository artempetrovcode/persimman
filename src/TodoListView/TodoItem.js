// @flow
import type {Todo} from '../Todo';

import * as React from 'react';
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';
import TodoInput from './TodoInput';

const {useContext, useState} = React;

type Props = {
  todo: Todo,
}

function TodoItem({todo}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const {deleteTodo, updateTodoStatus, updateTodo, updateTodoText} = useContext(DispatchContext);
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
    updateTodoText(todo, value);
  }
  function handleInputDelete() {
    setIsEditing(false);
    deleteTodo(todo);
  }
  function handleInputCancel() {
    setIsEditing(false);
  }

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
            initialValue={text} /> :
          <label style={{padding: '2px', border: '1px solid transparent', lineHeight: '19px', whiteSpace: 'pre-line'}} onClick={handleLabelClick}>
            {completedAt != null ? <s>{text}</s> : text}
          </label>
        }
        
        <button onClick={handleDeleteClick}>x</button>
      </div>
    </li>
  );
}

export default TodoItem;