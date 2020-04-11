// @flow
import type {Todo} from '../Todo';
import * as React from 'react';
import {getDateForThisZone, getDayTimestampForThisZone2, getISODateString, nextDayOffset, isDayOff} from '../lib/timeUtils';
import DispatchContext from '../DispatchContext';
import TodoDateTimeInput  from '../TodoListView/TodoDateTimeInput';
import TodoItem from '../TodoListView/TodoItem';

const {useContext} = React;

type Props = $ReadOnly<{|
    todo: Todo,
    sortedDayTimestamps: $ReadOnlyArray<number>,
    todayTimestamp: number,
  |}>;

function GantHistoryRow({todo, sortedDayTimestamps, todayTimestamp}: Props) {
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

  const nowTimestamp = Date.now();

  return (
    <tr>
      <td>
        <TodoItem todo={todo} />
      </td>
      {sortedDayTimestamps.reduce((list, dayTimestamp) => {
        const createdAtTimestamp = getDayTimestampForThisZone2(todo.createdAt); 
        const completedAtDayTimestamp = todo.completedAt != null ? getDayTimestampForThisZone2(todo.completedAt) : null;
        const etaDayTimestamp = todo.eta != null ? getDayTimestampForThisZone2(todo.eta) : null;
        let style = {
          backgroundColor: 'none',
        };
        if (isDayOff(dayTimestamp)) {
          if (createdAtTimestamp <= dayTimestamp) {
            if (completedAtDayTimestamp == null) {
              if (dayTimestamp <= nowTimestamp) {
                style.backgroundColor = 'red';
              } else if (etaDayTimestamp != null && etaDayTimestamp >= dayTimestamp) {
                style.backgroundColor = '#d2d24b'; // darkyellow
              } else {
                style.backgroundColor = 'lightgrey';
              }
            } else if (dayTimestamp <= completedAtDayTimestamp) {
              style.backgroundColor = 'darkgreen';
            } else {
              style.backgroundColor = 'lightgrey';
            }
          } else {
            style.backgroundColor = 'lightgrey';
          }
        } else {
          if (createdAtTimestamp <= dayTimestamp) {
            if (completedAtDayTimestamp == null) {
              if (dayTimestamp <= nowTimestamp) {
                style.backgroundColor = 'orangered';
              } else if (etaDayTimestamp != null && etaDayTimestamp >= dayTimestamp) {
                style.backgroundColor = 'yellow';
              } else {
                style.backgroundColor = 'none';
              }
            } else if (dayTimestamp <= completedAtDayTimestamp) {
              style.backgroundColor = 'green';
            }
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

export default GantHistoryRow;