// @flow
import type {Todo} from './Todo';
import * as React from 'react';
const {useReducer} = React;

export type State = $ReadOnly<{|
    timeOffsetInMs: number,
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

type SetTimeOffsetAction = $ReadOnly<{|
    type: 'SET_TIME_OFFSET',
    payload: number,
|}>;

type Action = FetchInitAction 
  | FetchSuccessAction 
  | FetchFailureAction 
  | AppendInitAction
  | AppendSuccessAction
  | UpdateInitAction
  | UpdateSuccessAction
  | SetTimeOffsetAction

const reducer = (state: State, action: Action): State => {
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
        todos: action.payload.filter(todo => !todo.isDeleted),
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
        ].filter(todo => !todo.isDeleted)
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
        }).filter(todo => !todo.isDeleted)
      };
    case 'SET_TIME_OFFSET':
      return {
        ...state,
        timeOffsetInMs: action.payload,
      };
    default:
      throw new Error();
  }
};

export const initialState = {
  timeOffsetInMs: 0,
  isAppending: false,
  isLoading: false,
  isError: false,
  isUpdating: false,
  todos: ([]: $ReadOnlyArray<Todo>),
};

const useDataReducer = () => {
  return useReducer<State, Action>(reducer, initialState);
};

export default useDataReducer;