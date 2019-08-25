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
          <button onClick={() => setView('TODO_LIST')}>Show Todos</button>
          <button onClick={() => setView('GOALS')}>Show Goals</button>
          <button onClick={() => setView('CALENDAR')}>Show Calendar</button>
          <span>{' '}{isOnline ? '✅📶 online' : '🚫📵 offline'}</span>
        </div>
        {
          view === 'GOALS' ?
            <GoalsView /> :
            view === 'CALENDAR' ?
            <CalendarView /> :
            <TodoListView />
        }
        {(state.isLoading || state.isUpdating || state.isAppending) ? 
            <div style={{
            position: 'fixed', 
            background: 'gray', 
            opacity: 0.5,
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
          }}></div> : null
        }
      </StateContext.Provider>
    </DispatchContext.Provider>
  )
}

export default App;