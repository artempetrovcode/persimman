// @flow
import type {Todo} from '../Todo';
import * as React from 'react';
import {getDateForThisZone, getDayTimestampForThisZone2} from '../lib/timeUtils';
import StateContext from '../StateContext';
import TodoDateTimeInput from '../TodoListView/TodoDateTimeInput';
import TodoItem from '../TodoListView/TodoItem';

const {useContext, useState} = React;

const DAY_IN_MS = 1000 * 60 * 60 * 24;

function WallView() {
  const now = Date.now();
  const state = useContext(StateContext);
  const [startTimestamp, setStartTimestamp] = useState(getDayTimestampForThisZone2(now - DAY_IN_MS * 5));
  const [endTimestamp, setEndTimestamp] = useState(getDayTimestampForThisZone2(now + DAY_IN_MS * 5));

  const groupedByDate = {
    [getDayTimestampForThisZone2(now)]: [],
  };

  state.todos
    .filter((todo: Todo) => todo.eta != null && todo.eta >= startTimestamp && todo.eta <= endTimestamp)
    .forEach((todo: Todo) => {
      const dayTimestamp = getDayTimestampForThisZone2(todo.eta);
      if (groupedByDate[dayTimestamp] === undefined) {
        groupedByDate[dayTimestamp] = [];
      }
      groupedByDate[dayTimestamp].push(todo);
  });

  const handleStartChange = (value: number) => {
    setStartTimestamp(getDayTimestampForThisZone2(value));
  }

  const handleEndChange = (value: number) => {
    setEndTimestamp(getDayTimestampForThisZone2(value));
  }

  const sortedDayTimestamps = [];
  let date = new Date(startTimestamp);
  let timestamp = date.getTime();
  
  while (timestamp <= endTimestamp) {
    sortedDayTimestamps.push(timestamp);
    if (groupedByDate[timestamp] === undefined) {
      groupedByDate[timestamp] = [];
    }
    date.setDate(date.getDate() + 1);
    timestamp = date.getTime();
  }

  return (
    <>
      <div>
        <label>
          Start
          <TodoDateTimeInput 
            onChange={handleStartChange}
            onCancel={() => {}}
            timestamp={startTimestamp}
          />
        </label>
        <label>
          End
          <TodoDateTimeInput 
            onChange={handleEndChange}
            onCancel={() => {}}
            timestamp={endTimestamp}
          />
        </label>
      </div>
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
                    <TodoItem todo={todo} />
                  </li>
                ))}
              </ul>
            </td>
            ))}
          </tr>
        </tbody>
      </table>
    </>
  );
}

export default WallView;