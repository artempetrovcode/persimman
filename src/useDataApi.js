// @flow
import * as React from 'react';
const {useReducer, useState, useEffect} = React;

const dataFetchReducer = (state, action) => {
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
        data: action.payload,
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

const useDataApi = (initialUrl: string, initialData: {}) => {
  const [url, setUrl] = useState<string>(initialUrl);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });

  useEffect(() => {
    let didCancel = false;

    const fetchData = async () => {
      dispatch({ type: 'FETCH_INIT' });

      try {
		  setTimeout(() => {
			const result = { data: { response: 200 } };	  
			if (!didCancel) {
         	 dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
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