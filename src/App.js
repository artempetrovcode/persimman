// @flow
import * as React from 'react';
import CalendarView from './CalendarView/CalendarView';
import GoalsView from './GoalsView/GoalsView';
import TodoListView from './TodoListView/TodoListView';
import GantView from './GantView/GantView';
import WallView from './WallView/WallView';
import useDataApi from './useDataApi';
import DispatchContext from './DispatchContext';
import StateContext from './StateContext';
import useIsOnline from './useIsOnline';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
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
    setTimeOffsetInMs,
  } = useDataApi();
  console.log(state)
  useEffect(fetchData, []);
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
          </div>
          <Switch>
            <Route path="/goals">
              <GoalsView />
            </Route>
            <Route path="/calendar">
              <CalendarView />
            </Route>
            <Route path="/gant">
              <GantView />
            </Route>
            <Route path="/wall">
              <WallView />
            </Route>
            <Route path="/">
              <TodoListView />
            </Route>
          </Switch>
          <Overlay isVisible={state.isLoading || state.isUpdating || state.isAppending} />
        </Router>
      </StateContext.Provider>
    </DispatchContext.Provider>
  )
}

export default App;