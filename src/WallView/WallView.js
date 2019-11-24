// @flow
import type {Todo} from '../Todo';
import * as React from 'react';
import {getDateForThisZone, getDayTimestampForThisZone2} from '../lib/timeUtils';
import StateContext from '../StateContext';

const {useContext} = React;

function WallView() {
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

  const sortedDayTimestamps = Object.keys(groupedByDate).map(Number).sort((a,b) => b - a);

  return (
    <table border="1px" style={{borderCollapse: 'collapse'}}>
      <thead>
        <tr>
        {sortedDayTimestamps.map(dayTimestamp => (
          <th key={dayTimestamp}>
            {(new Date(Number(dayTimestamp)).toDateString())}
          </th>
        ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {sortedDayTimestamps.map(dayTimestamp => (
          <td key={dayTimestamp}>
            <ul>
              {groupedByDate[dayTimestamp].map(todo => (
                <li key={todo.id}>
                  <s>{todo.text} [{new Date(todo.completedAt).toLocaleTimeString()}]</s> 
                </li>
              ))}
            </ul>
          </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}

export default WallView;