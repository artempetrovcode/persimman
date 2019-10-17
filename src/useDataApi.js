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

  function createTodo(text: string, isCompleted: boolean, timeOffsetInMs: number): Todo {
    const now = Date.now() + timeOffsetInMs;
    const todo: Todo = {
      id: uuidv4(),
      text,
      completedAt: isCompleted ? now : null,  
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    };
    
    return todo;
  }

  function addTodo(text: string, isCompleted: boolean, timeOffsetInMs: number) {
    dispatch({ type: 'APPEND_INIT' })
    const todo = createTodo(text, isCompleted, timeOffsetInMs);
    append(todo).then(todo => {
      dispatch({
        type: 'APPEND_SUCCESS',
        payload: todo,
      })
    })
  }

  function updateTodo(todo: Todo) {
    dispatch({ type: 'UPDATE_INIT' })
    update(todo).then(todo => {
      dispatch({
        type: 'UPDATE_SUCCESS',
        payload: todo,
      })
    })
  }

  function updateTodoText(todo: Todo, text: string) {
    updateTodo({
      ...todo,
      text,
    })
  }

  function updateTodoCompletedAt(todo: Todo, completedAt: string) {
    updateTodo({
      ...todo,
      completedAt,
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
    setTimeOffsetInMs,
  };
};

export default useDataApi;