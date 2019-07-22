// @flow
import * as React from 'react';
import CalendarView from './CalendarView/CalendarView';
import GoalsView from './GoalsView/GoalsView';
import TodoListView from './TodoListView/TodoListView';
import useDataApi from './useDataApi';
import DispatchContext from './DispatchContext';
import StateContext from './StateContext';

const {useState, useEffect} = React;

type View = 'CALENDAR' | 'GOALS' | 'TODO_LIST';

function App() {
  const [view, setView] = useState<View>('TODO_LIST');
  const [state, setUrl, addTodo, updateTodo, fetchData, dispatch] = useDataApi();

  useEffect(fetchData, []);

  return (
    <DispatchContext.Provider value={{
      addTodo,
      updateTodo,
    }}>
      <StateContext.Provider value={state}>
        <div style={{margin: '1em'}}>
          <button onClick={() => setView('TODO_LIST')}>Show Todos</button>
          <button onClick={() => setView('GOALS')}>Show Goals</button>
          <button onClick={() => setView('CALENDAR')}>Show Calendar</button>
        </div>
        {
          view === 'GOALS' ?
            <GoalsView /> :
            view === 'CALENDAR' ?
            <CalendarView /> :
            <TodoListView />
        }
      </StateContext.Provider>
    </DispatchContext.Provider>
  )
}

export default App;