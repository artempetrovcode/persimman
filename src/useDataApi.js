// @flow
import type {Todo} from './Todo';
import * as React from 'react';
import {fetch, append, update} from './todoSheetApi';
import uuidv4 from 'uuid/v4';
import useDataReducer from './useDataReducer';
const {useState} = React;

const useDataApi = () => {
  const [url, setUrl] = useState<string>('');
  const [state, dispatch] = useDataReducer();

  const fetchData = () => {
    let didCancel = false;
    dispatch({ type: 'FETCH_INIT' });
    try {
      fetch().then(todos => {
          if (!didCancel) {
            dispatch({
              type: 'FETCH_SUCCESS',
              payload: todos,
            });
          }
        }).catch(response => {
          console.log('Error', response);
          if (!didCancel) {
            dispatch({ type: 'FETCH_FAILURE' });
          }
        })
    } catch (error) {
      if (!didCancel) {
        dispatch({ type: 'FETCH_FAILURE' });
      }
    }

    return () => {
      didCancel = true;
    };
  };

  function daysAgo(d) {
    const now = Date.now();
    const ago = now - (1000 * 60 * 60 * 24 * d);
    return ago;
  }

  function createTodo(text: string, isCompleted: boolean, timeOffsetInMs: number, hasEta: boolean): Todo {
    const now = Date.now() + timeOffsetInMs;
    const todo: Todo = {
      id: uuidv4(),
      text,
      completedAt: isCompleted ? now : null,  
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
      eta: hasEta ? now : null,
      parentId: null,
    };
    
    return todo;
  }

  function addTodo(
    text: string, 
    isCompleted: boolean, 
    timeOffsetInMs: number, 
    hasEta: boolean
  ) {
    dispatch({ type: 'APPEND_INIT' })
    const todo = createTodo(text, isCompleted, timeOffsetInMs, hasEta);
    append([todo]).then(todos => {
      dispatch({
        type: 'APPEND_SUCCESS',
        payload: todos[0],
      })
    })
  }

  function updateTodo(t: Todo) {
    const now = Date.now(); // TODO count timeOffsetInMs;
    const todo = {
      ...t,
      updatedAt: now,
    }
    dispatch({ type: 'UPDATE_INIT' })
    update(todo).then(todo => {
      dispatch({
        type: 'UPDATE_SUCCESS',
        payload: todo,
      })
    })
  }

  function updateTodoText(todo: Todo, text: string): void {
    updateTodo({
      ...todo,
      text,
    })
  }

  function updateTodoCompletedAt(todo: Todo, completedAt: number): void {
    updateTodo({
      ...todo,
      completedAt,
    })
  }

  function updateTodoCreatedAt(todo: Todo, createdAt: number): void {
    updateTodo({
      ...todo,
      createdAt,
    })
  }

  function updateTodoEta(todo: Todo, eta: number): void {
    updateTodo({
      ...todo,
      eta,
    })
  }

  function updateTodoStatus(todo: Todo, isCompleted: boolean) {
    updateTodo({
      ...todo,
      completedAt: isCompleted ? Date.now() : null,
    })
  }

  function deleteTodo(todo: Todo) {
    updateTodo({
      ...todo,
      isDeleted: true,
    })
  }

  function setTimeOffsetInMs(timeOffsetInMs: number) {
    dispatch({
        type: 'SET_TIME_OFFSET',
        payload: timeOffsetInMs,
      })
  }

  return {
    state, 
    setUrl, 
    addTodo, 
    updateTodo, 
    fetchData, 
    dispatch, 
    updateTodoStatus,
    updateTodoText,
    deleteTodo,
    updateTodoCompletedAt,
    updateTodoCreatedAt,
    updateTodoEta,
    setTimeOffsetInMs,
  };
};

export default useDataApi;