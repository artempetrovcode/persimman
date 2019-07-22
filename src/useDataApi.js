// @flow
import type {Todo} from './Todo';
import * as React from 'react';
import {fetch, append, update} from './sheetsApi';
const {useReducer, useState, useEffect} = React;

type State = $ReadOnly<{|
    isAppending: boolean,
    isError: boolean,
    isLoading: boolean,
    isUpdating: boolean,
    todos: $ReadOnlyArray<Todo>,
|}>;

type FetchInitAction = $ReadOnly<{|
    type: 'FETCH_INIT',
|}>;

type FetchSuccessAction = $ReadOnly<{|
    type: 'FETCH_SUCCESS',
    payload: $ReadOnlyArray<Todo>,
|}>;

type FetchFailureAction = $ReadOnly<{|
    type: 'FETCH_FAILURE',
|}>;

type AppendInitAction = $ReadOnly<{|
    type: 'APPEND_INIT',
|}>;

type AppendSuccessAction = $ReadOnly<{|
    type: 'APPEND_SUCCESS',
    payload: Todo,
|}>;

type UpdateInitAction = $ReadOnly<{|
    type: 'UPDATE_INIT',
|}>;

type UpdateSuccessAction = $ReadOnly<{|
    type: 'UPDATE_SUCCESS',
    payload: Todo,
|}>;

type Action = FetchInitAction 
  | FetchSuccessAction 
  | FetchFailureAction 
  | AppendInitAction
  | AppendSuccessAction
  | UpdateInitAction
  | UpdateSuccessAction

const dataFetchReducer = (state: State, action: Action): State => {
  console.warn(action.type)
  switch (action.type) {
    case 'FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        todos: action.payload,
      };
    case 'FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case 'APPEND_INIT': 
      return {
        ...state,
        isAppending: true,
      };
    case 'APPEND_SUCCESS': 
      return {
        ...state,
        isAppending: false,
        todos: [
          ...state.todos,
          action.payload,
        ]
      };
    case 'UPDATE_INIT': 
      return {
        ...state,
        isUpdating: true,
      };
    case 'UPDATE_SUCCESS': 
      return {
        ...state,
        isUpdating: false,
        todos: state.todos.map(todo => {
          if (todo.id === action.payload.id) {
            return action.payload;
          }
          return todo;
        })
      };
    default:
      throw new Error();
  }
};

const useDataApi = () => {
  const [url, setUrl] = useState<string>('');

  const [state, dispatch] = useReducer<State, Action>(dataFetchReducer, {
    isAppending: false,
    isLoading: false,
    isError: false,
    isUpdating: false,
    todos: ([]: $ReadOnlyArray<Todo>),
  });


  // useEffect(() => {
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

    // return fetchData();
  // }, [url]);



  function generateTodo(id): Todo {
    const todo: Todo = {
        id: id,
        text: 'text tet',
        completedAt: '', 
        userId: 'sfsd', 
        isDeleted: false,
        createdAt: 'sfsdf',
        updatedAt: 'sdfsf',
      };

      return todo;
  }

  function addTodo() {
    dispatch({ type: 'APPEND_INIT' })
    const todo = generateTodo(Math.random().toString());
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

  return [state, setUrl, addTodo, updateTodo, fetchData, dispatch];
};

export default useDataApi;