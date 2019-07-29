// @flow
import type {Todo} from '../Todo';
import * as React from 'react';
import {getDateForThisZone, getDayTimestampForThisZone, getDayTimestampForThisZone2} from '../lib/timeUtils';
import StateContext from '../StateContext';

window._getDateForThisZone = getDateForThisZone;
window._getDayTimestampForThisZone = getDayTimestampForThisZone;
const {useContext} = React;

function CalendarView() {
  const state = useContext(StateContext);

  const groupedByDate = {
    [getDayTimestampForThisZone(Date.now())]: [],
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
      {Object.keys(groupedByDate).map(dayTimestamp => (
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