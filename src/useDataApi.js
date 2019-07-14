// @flow
import type {Todo} from './Todo';
import * as React from 'react';
import {get} from './sheetsApi';
const {useReducer, useState, useEffect} = React;

type State = $ReadOnly<{|
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

type Action = FetchInitAction | FetchSuccessAction | FetchFailureAction;

const dataFetchReducer = (state: State, action: Action) => {
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
    default:
      throw new Error();
  }
};

const useDataApi = () => {
  const [url, setUrl] = useState<string>('');

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    todos: [],
  });


  useEffect(() => {
    let didCancel = false;

    const fetchData = async () => {
      dispatch({ type: 'FETCH_INIT' });
      try {
        get().then(todos => {
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

  return [state, setUrl];
};

export default useDataApi;