// @flow
import * as React from 'react';
const {useReducer, useState, useEffect} = React;

type Todo = $ReadOnly<{|
  id: string,
  text: string,
  userId: string,
  completedAt: string,
  isDeleted: boolean,
  createdAt: string,
  completedAt: string,
  updatedAt: string,
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

declare var gapi: $ReadOnly<{|
  client: $ReadOnly<{|
    sheets: $ReadOnly<{|
      spreadsheets: $ReadOnly<{|
        values: $ReadOnly<{|
          get: (params: $ReadOnly<{|
            spreadsheetId: string,
            range: string,
            includeGridData: boolean,
          |}>) => Promise<$ReadOnly<{|
            result: $ReadOnly<{|
              values: $ReadOnlyArray<string>,
            |}>
          |}>>
        |}>
      |}>
    |}>
  |}>
|}>;


const useDataApi = () => {
  const [url, setUrl] = useState<string>('');

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    todos: [],
  });


  useEffect(() => {
    let didCancel = false;

    function tryAgain() {
      if (window.__isGoogleLoadedAndAuthorized) {
        if (!didCancel) {

          
          gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: '1NxlkrGwkxApnHsu6q38wf93aPmCYgqhekHpqgLxawo4',
            range: 'Class Data!A2:G',
            includeGridData: true,
          }).then(function(response) {
            console.log(response)
            var values = response.result.values;
            const todos = values.map(value => {
              console.log(value)
              const [id, text, completedAt, userId, isDeleted, createdAt, updatedAt] = value;

              if (typeof id === 'string' &&
                typeof text === 'string' &&
                typeof completedAt === 'string' &&
                typeof userId === 'string' && 
                typeof isDeleted === 'string' &&
                typeof createdAt === 'string' &&
                typeof updatedAt === 'string') {
                const todo: Todo = {id, text, completedAt, userId, isDeleted: isDeleted === '1', createdAt, updatedAt};
                return todo;
              }
            }).filter(Boolean);

            dispatch({
              type: 'FETCH_SUCCESS',
              payload: todos,
            });


          }, function(response) {
            console.log('Error: ' + response.result.error.message);
          });


        }
      } else {
        setTimeout(tryAgain, 3000);
      }
    }

    const fetchData = async () => {
      dispatch({ type: 'FETCH_INIT' });
      try {
        tryAgain();
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