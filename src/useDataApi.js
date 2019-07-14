// @flow
import * as React from 'react';
const {useReducer, useState, useEffect} = React;

type Todo = $ReadOnly<{|
  id: string,
  text: string,
  completedAt: string,
  isDeleted: boolean,
  createdAt: string,
  completedAt: string,
|}>;

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
		  setTimeout(() => {
			  if (!didCancel) {
         	 dispatch({ type: 'FETCH_SUCCESS', payload: [{
            id: '006a35c7-1f82-449a-b657-90ec2325350b',
            text: '@diet healthy brunch snack',
            completedAt: '2019-06-18 5:17:30',
            isDeleted: false,
            createdAt: '2019-06-18 5:17:30',
            completedAt: '2019-06-18 5:18:21',
            }] });
        	}
		  }, 3000);
        // const result = await axios(url);
        // if (!didCancel) {
        //   dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
        // }
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