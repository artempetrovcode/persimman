// @flow
import type {Todo} from '../Todo';
import * as React from 'react';
import {getDateForThisZone, getDayTimestampForThisZone2, formatDateTime, nextDayOffset, isDayOff} from '../lib/timeUtils';
import DispatchContext from '../DispatchContext';
import TodoDateTimeInput  from '../TodoListView/TodoDateTimeInput';

const {useContext} = React;

type Props = $ReadOnly<{|
  todos: $ReadOnlyArray<Todo>,
|}>;

function GantView({todos}: Props) {
  const commands = useContext(DispatchContext);
  if (commands == null) {
    return null;
  }
  const { updateTodoEta } = commands;

  const groupedByDate = {
    [getDayTimestampForThisZone2(Date.now())]: [],
  };

  const todosWithEta = todos
    .filter((todo: Todo) => todo.completedAt == null && todo.eta != null)
    .sort((a: Todo, b: Todo) => a.eta == null || b.eta == null ? 0 : a.eta - b.eta)

  todosWithEta
    .forEach((todo: Todo) => {
      const dayTimestamp = getDayTimestampForThisZone2(todo.eta);
      if (groupedByDate[dayTimestamp] === undefined) {
        groupedByDate[dayTimestamp] = [];
      }
      groupedByDate[dayTimestamp].push(todo);
  });

  const timeKeys = Object.keys(groupedByDate);
  const minTime = Math.min.apply(null, timeKeys);
  const maxTime = Math.max.apply(null, timeKeys);
  const sortedDayTimestamps = [];
  for (let t = minTime; t <= maxTime; t += nextDayOffset) {
    sortedDayTimestamps.push(t);
    if (groupedByDate[t] === undefined) {
      groupedByDate[t] = [];
    }
  }

  function handleEtaChange(todo, newEta: number) {
    updateTodoEta(todo, newEta);
  }

  return (
    <>
    <table border="1px" style={{borderCollapse: 'collapse'}}>
      <thead>
        <tr>
          <th></th>
          {sortedDayTimestamps.map(dayTimestamp => (
            <th key={dayTimestamp} style={{ background: isDayOff(dayTimestamp)? 'lightgrey' : 'none' }}>
              <pre>{
                (new Date(Number(dayTimestamp)).toDateString())
                  .replace(/\s\d{4}$/, '')
                  .replace(/^(\w)\w\w\s(\w)\w\w/, '$1 $2')
                  .replace(/ /g, '\n')}</pre>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {todosWithEta.map(todo => (
          <tr key={todo.id}>
            <td style={{whiteSpace: 'nowrap'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                  {todo.text}
                </div>
                <div>
                  {
                    todo.eta == null ?
                      'ETA: Not Set' :
                      <TodoDateTimeInput 
                        displayTime={false}
                        onChange={newEta => handleEtaChange(todo, newEta)}
                        onCancel={() => {}}
                        timestamp={todo.eta}
                      />
                  }    
                </div> 
              </div>
            </td>
            {sortedDayTimestamps.reduce((list, dayTimestamp) => {
              const createdAtTimestamp = getDayTimestampForThisZone2(todo.createdAt); 
              const etaDayTimestamp = getDayTimestampForThisZone2(todo.eta);
              let style = null;
              if (isDayOff(dayTimestamp)) {
                if (dayTimestamp === etaDayTimestamp) {
                  style = {background: 'lightred'};
                } else {
                  style = {background: 'lightgrey'};
                }
              } else {
                if (createdAtTimestamp <= dayTimestamp && dayTimestamp <= etaDayTimestamp) {
                  style = {background: 'lightgreen'};
                }
              }

              list.push(<td key={dayTimestamp} style={style}></td>);
              return list;  
            }, [])}
          </tr>
        ))}
      </tbody>
    </table>
    </>
  );
}

export default GantView;