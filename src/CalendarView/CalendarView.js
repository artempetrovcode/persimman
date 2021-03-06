// @flow
import type {Todo} from '../Todo';
import * as React from 'react';
import {getDateForThisZone, getDayTimestampForThisZone2} from '../lib/timeUtils';
import StateContext from '../StateContext';

const {useContext} = React;

function CalendarView() {
  const state = useContext(StateContext);

  const groupedByDate = {
    [getDayTimestampForThisZone2(Date.now())]: [],
  };

  state.todos
    .filter((todo: Todo) => todo.completedAt != null)
    .forEach((todo: Todo) => {
      const dayTimestamp = getDayTimestampForThisZone2(todo.completedAt);
      if (groupedByDate[dayTimestamp] === undefined) {
        groupedByDate[dayTimestamp] = [];
      }
      groupedByDate[dayTimestamp].push(todo);
  });

  return (
    <>
      {Object.keys(groupedByDate).map(Number).sort((a,b) => b - a).map(dayTimestamp => (
        <div key={dayTimestamp}>
          <p>{(new Date(Number(dayTimestamp)).toDateString())}</p>
          <ul>
            {groupedByDate[dayTimestamp].map(todo => (
              <li key={todo.id}>
                <s>{todo.text} [{new Date(todo.completedAt).toLocaleTimeString()}]</s> 
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

export default CalendarView;