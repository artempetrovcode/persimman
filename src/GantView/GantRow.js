// @flow
import type {Todo} from '../Todo';
import * as React from 'react';
import {getDateForThisZone, getDayTimestampForThisZone2, getISODateString, nextDayOffset, isDayOff} from '../lib/timeUtils';
import DispatchContext from '../DispatchContext';
import TodoDateTimeInput  from '../TodoListView/TodoDateTimeInput';

const {useContext} = React;

type Props = $ReadOnly<{|
    todo: Todo,
    sortedDayTimestamps: $ReadOnlyArray<number>,
    todayTimestamp: number,
  |}>;

function GantRow({todo, sortedDayTimestamps, todayTimestamp}: Props) {
  const commands = useContext(DispatchContext);
  if (commands == null) {
    return null;
  }
  const { updateTodoEta, updateTodoStatus } = commands;

  function handleEtaChange(todo: Todo, newEta: number) {
    updateTodoEta(todo, newEta);
  }
  function handleIsCompletedChange(todo: Todo, isCompleted: boolean) {
    updateTodoStatus(todo, isCompleted);
  }

  return (
    <tr>
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
  );
}

export default GantRow;