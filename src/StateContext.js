import * as React from 'react';
import type {Todo} from './Todo';

const StateContext = React.createContext({
    isAppending: false,
    isLoading: false,
    isError: false,
    isUpdating: false,
    todos: ([]: $ReadOnlyArray<Todo>),
  });

export default StateContext;
