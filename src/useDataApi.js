// @flow
import type {Todo} from './Todo';
import * as React from 'react';
import {fetch, append} from './sheetsApi';
const {useReducer, useState, useEffect} = React;

type State = $ReadOnly<{|
    isAppending: boolean,
    isLoading: boolean,
    isError: boolean,
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

type Action = FetchInitAction 
  | FetchSuccessAction 
  | FetchFailureAction 
  | AppendInitAction
  | AppendSuccessAction

const dataFetchReducer = (state: State, action: Action): State => {
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
    todos: ([]: $ReadOnlyArray<Todo>),
  });


  useEffect(() => {
    let didCancel = false;

    const fetchData = async () => {
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
    };

    fetchData();

    return () => {
      didCancel = true;
    };
  }, [url]);

  function addTodo() {
    dispatch({ type: 'APPEND_INIT' })

    const todo: Todo = {
        id: Math.random().toString(),
        text: 'text tet',
        completedAt: '', 
        userId: 'sfsd', 
        isDeleted: false,
        createdAt: 'sfsdf',
        updatedAt: 'sdfsf',
      };
    append(todo).then(todo => {
      dispatch({
        type: 'APPEND_SUCCESS',
        payload: todo,
      })
    })
  }

  return [state, setUrl, addTodo];
};

export default useDataApi;