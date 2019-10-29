// @flow
import * as React from 'react';
import type {Todo} from './Todo';
import type {State} from './useDataReducer';
import {initialState} from './useDataReducer';

const StateContext = React.createContext<State>(initialState);

export default StateContext;