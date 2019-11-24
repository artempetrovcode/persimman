// @flow
import * as React from 'react';
import CalendarView from './CalendarView/CalendarView';
import GoalsView from './GoalsView/GoalsView';
import TodoListView from './TodoListView/TodoListView';
import GantView from './GantView/GantView';
import useDataApi from './useDataApi';
import DispatchContext from './DispatchContext';
import StateContext from './StateContext';
import useIsOnline from './useIsOnline';

const {useState, useEffect, useMemo} = React;

type View = 'CALENDAR' | 'GOALS' | 'TODO_LIST' | 'GANT';

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
  const [view, setView] = useState<View>('TODO_LIST');
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
        <div style={{margin: '1em'}}>
          <button onClick={() => setView('TODO_LIST')}>Todos</button>
          <button onClick={() => setView('GOALS')}>Goals</button>
          <button onClick={() => setView('CALENDAR')}>Calendar</button>
          <button onClick={() => setView('GANT')}>Gant</button>
          <span>{' '}{isOnline ? '✅📶 online' : '🚫📵 offline'}</span>
          <select onChange={e => setTimeOffsetInMs(Number(e.target.value))} value={state.timeOffsetInMs}>
            {timeOffsetInMsOptions.map(({label, value}) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>
        {
          view === 'GOALS' ?
            <GoalsView /> :
            view === 'CALENDAR' ?
            <CalendarView /> :
            view === 'GANT' ?
            <GantView /> :
            <TodoListView />
        }
        <Overlay isVisible={state.isLoading || state.isUpdating || state.isAppending} />
      </StateContext.Provider>
    </DispatchContext.Provider>
  )
}

export default App;