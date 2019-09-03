// @flow
import * as React from 'react';
import CalendarView from './CalendarView/CalendarView';
import GoalsView from './GoalsView/GoalsView';
import TodoListView from './TodoListView/TodoListView';
import useDataApi from './useDataApi';
import DispatchContext from './DispatchContext';
import StateContext from './StateContext';
import useIsOnline from './useIsOnline';

const {useState, useEffect} = React;

type View = 'CALENDAR' | 'GOALS' | 'TODO_LIST';

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
  const [view, setView] = useState<View>('GOALS');
  const {
    state,
    addTodo,
    updateTodo,
    fetchData, 
    updateTodoStatus,
    deleteTodo,
    updateTodoText,
    updateTodoCompletedAt,
  } = useDataApi();

  useEffect(fetchData, []);
  const isOnline = useIsOnline();
  

  return (
    <DispatchContext.Provider value={{
      addTodo,
      updateTodo,
      updateTodoStatus,
      deleteTodo,
      updateTodoText,
      updateTodoCompletedAt,
    }}>
      <StateContext.Provider value={state}>
        <div style={{margin: '1em'}}>
          <button onClick={() => setView('TODO_LIST')}>Todos</button>
          <button onClick={() => setView('GOALS')}>Goals</button>
          <button onClick={() => setView('CALENDAR')}>Calendar</button>
          <span>{' '}{isOnline ? '✅📶 online' : '🚫📵 offline'}</span>
        </div>
        {
          view === 'GOALS' ?
            <GoalsView /> :
            view === 'CALENDAR' ?
            <CalendarView /> :
            <TodoListView />
        }
        <Overlay isVisible={state.isLoading || state.isUpdating || state.isAppending} />
      </StateContext.Provider>
    </DispatchContext.Provider>
  )
}

export default App;