// @flow
import type {Todo} from '../Todo';
import * as React from 'react';
import {getDateForThisZone, getDayTimestampForThisZone2, getISODateString, nextDayOffset, isDayOff} from '../lib/timeUtils';
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
  const { updateTodoEta, updateTodoStatus } = commands;

  const todayTimestamp = getDayTimestampForThisZone2(Date.now());

  const groupedByDate = {
    [todayTimestamp]: [],
  };

  const todosWithEta = todos
    .filter((todo: Todo) => todo.completedAt == null && todo.eta != null)
    .sort((a: Todo, b: Todo) => a.eta == null || b.eta == null ? 0 : a.eta - b.eta)

  todosWithEta
    .forEach((todo: Todo) => {
      const createdAtTimestamp = getDayTimestampForThisZone2(todo.createdAt); 
      const etaDayTimestamp = getDayTimestampForThisZone2(todo.eta);
      if (groupedByDate[etaDayTimestamp] === undefined) {
        groupedByDate[etaDayTimestamp] = [];
      }
      if (groupedByDate[createdAtTimestamp] === undefined) {
        groupedByDate[createdAtTimestamp] = [];
      }
      groupedByDate[etaDayTimestamp].push(todo);
  });

  const timeKeys = Object.keys(groupedByDate);
  const minTime = Math.min.apply(null, timeKeys);
  const maxTime = Math.max.apply(null, timeKeys);
  
  const sortedDayTimestamps = [];
  let date = new Date(minTime);
  let timestamp = date.getTime();
  while (timestamp <= maxTime) {
    sortedDayTimestamps.push(timestamp);
    if (groupedByDate[timestamp] === undefined) {
      groupedByDate[timestamp] = [];
    }
    date.setDate(date.getDate() + 1);
    timestamp = date.getTime();
  }

  function handleEtaChange(todo: Todo, newEta: number) {
    updateTodoEta(todo, newEta);
  }
  function handleIsCompletedChange(todo: Todo, isCompleted: boolean) {
    updateTodoStatus(todo, isCompleted);
  }
  return (
    <>
    <table border="1px" style={{borderCollapse: 'collapse'}}>
      <thead>
        <tr>
          <th></th>
          {sortedDayTimestamps.map(dayTimestamp => (
            <th key={dayTimestamp} style={{ 
              borderLeft: todayTimestamp === dayTimestamp ? '2px solid black' : '1px solid',
              borderRight: todayTimestamp === dayTimestamp ? '2px solid black' : '1px solid',
              backgroundColor: isDayOff(dayTimestamp) ? 'lightgrey' : 'none',
            }}>
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
            <td>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <div style={{lineHeight: '19px', whiteSpace: 'pre-line'}}>
                  <input
                    checked={todo.completedAt != null}
                    type="checkbox"
                    onChange={e => {
                      handleIsCompletedChange(todo, e.target.checked);
                    }}
                  />
                  {todo.text}
                </div>
                <div>
                  <div>
                  {'createdAt: ' + getISODateString(new Date(todo.createdAt))}
                  </div>
                  <div>
                  {
                    todo.eta == null ?
                      'eta: Not Set' :
                      <>
                        {'eta: '}
                        <TodoDateTimeInput 
                          displayTime={false}
                          onChange={newEta => handleEtaChange(todo, newEta)}
                          onCancel={() => {}}
                          timestamp={todo.eta}
                        />
                      </>
                  }    
                  </div>
                </div> 
              </div>
            </td>
            {sortedDayTimestamps.reduce((list, dayTimestamp) => {
              const createdAtTimestamp = getDayTimestampForThisZone2(todo.createdAt); 
              const etaDayTimestamp = getDayTimestampForThisZone2(todo.eta);
              let style = {
                backgroundColor: 'none',
              };
              if (isDayOff(dayTimestamp)) {
                if (createdAtTimestamp <= dayTimestamp && dayTimestamp <= etaDayTimestamp) {
                  if (dayTimestamp === etaDayTimestamp) {
                    style.backgroundColor = 'red';
                  } else{
                    style.backgroundColor = 'green';
                  }
                } else {
                  style.backgroundColor = 'lightgrey';
                }
              } else {
                if (createdAtTimestamp <= dayTimestamp && dayTimestamp <= etaDayTimestamp) {
                  style.backgroundColor = 'lightgreen';
                } else {
                  style.backgroundColor = 'none';
                }
              }
              if (style != null && todayTimestamp === dayTimestamp) {
                style = { 
                  ...style,
                  borderLeft: '2px solid black',
                  borderRight: '2px solid black',
                };
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