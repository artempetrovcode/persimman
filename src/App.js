// @flow
import * as React from 'react';
import CalendarView from './CalendarView/CalendarView';
import GoalsView from './GoalsView/GoalsView';
import TodoListView from './TodoListView/TodoListView';

const {useState} = React;

type View = 'CALENDAR' | 'GOALS' | 'TODO_LIST';

function App() {
  const [view, setView] = useState<View>('TODO_LIST');

  return (
    <>
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
    </>
  )
}

export default App;