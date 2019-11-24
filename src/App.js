// @flow
import type {State} from './useDataReducer';
import * as React from 'react';
import CalendarView from './CalendarView/CalendarView';
import GoalsView from './GoalsView/GoalsView';
import TodoListView from './TodoListView/TodoListView';
import GantView from './GantView/GantView';
import WallView from './WallView/WallView';
import Search from './Search';
import useDataApi from './useDataApi';
import DispatchContext from './DispatchContext';
import StateContext from './StateContext';
import useIsOnline from './useIsOnline';
 
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
  useHistory
} from 'react-router-dom';

const {useState, useEffect, useMemo} = React;

function Overlay({isVisible}) {
  const style = {
    position: 'fixed', 
    background: 'gray', 
    opacity: 0.5,
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  };

  return isVisible ? <div style={style}></div> : null;
}

const URL_PARAM_APP = 'app';
const URL_PARAM_QUERY = 'q';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function App() {
  const {
    state,
    addTodo,
    updateTodo,
    fetchData, 
    updateTodoStatus,
    deleteTodo,
    updateTodoText,
    updateTodoCompletedAt,
    updateTodoEta,
  } = useDataApi();
  
  useEffect(fetchData, []);

  return (
    <DispatchContext.Provider value={{
      addTodo,
      updateTodo,
      updateTodoStatus,
      deleteTodo,
      updateTodoText,
      updateTodoCompletedAt,
      updateTodoEta,
    }}>
      <StateContext.Provider value={state}>
        <Router>
          <Content state={state} />
        </Router>
      </StateContext.Provider>
    </DispatchContext.Provider>
  )
}

type ContentProps = {|
  state: State,
|};

function Content({state}: ContentProps) {
  const location = useLocation();
  const query = new URLSearchParams(useLocation().search);
  const history = useHistory();
  const isOnline = useIsOnline();
  const timeOffsetInMsOptions = useMemo(() => {
    return [
      [0, 'Today'], 
      [-1, '1 day ago'], 
      [-2, '2 days ago']
    ].map(([offsetInDays, label]) => {
      return {
        label,
        value: 1000 * 60 * 60 * 24 * offsetInDays,
      }
    });
  }, []);
  const {setTimeOffsetInMs} = useDataApi();
  const handleSetQuery = (query: ?string): void => {
    if (query == null || query === '') {
      history.replace(`${location.pathname}`);
    } else {
      history.replace(`${location.pathname}?${URL_PARAM_QUERY}=${query}`)
    }
  }

  const queryValue = query.get(URL_PARAM_QUERY);
  const regExp = queryValue == null || queryValue == '' ?
    null :
    new RegExp(queryValue, 'i');

  const filteredTodos = regExp == null ?
    state.todos :
    state.todos.filter(todo => {
      if (!todo.text.match(regExp)) {
        return false;
      }
      return true;
    });

  return (
    <>
    <div style={{
      display:'flex', 
      flexWrap: 'wrap', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginLeft: '1em',
      marginRight: '1em'
    }}> 
      <Link to="/">Todos</Link>
      <Link to="/goals">Goals</Link>
      <Link to="/calendar">Calendar</Link>
      <Link to="/wall">Wall</Link>
      <Link to="/gant">Gant</Link>
      <span>{' '}{isOnline ? '✅📶 online' : '🚫📵 offline'}</span>
      <select onChange={e => setTimeOffsetInMs(Number(e.target.value))} value={state.timeOffsetInMs}>
        {timeOffsetInMsOptions.map(({label, value}) => <option key={value} value={value}>{label}</option>)}
      </select>
      <Search setQuery={handleSetQuery} query={query.get(URL_PARAM_QUERY)} />
    </div>
    <Switch>
      <Route path="/goals">
        <GoalsView />
      </Route>
      <Route path="/calendar">
        <CalendarView />
      </Route>
      <Route path="/gant">
        <GantView todos={filteredTodos} />
      </Route>
      <Route path="/wall">
        <WallView />
      </Route>
      <Route path="/">
        <TodoListView todos={filteredTodos} />
      </Route>
    </Switch>
    <Overlay isVisible={state.isLoading || state.isUpdating || state.isAppending} />
    </>
  )
}

export default App;