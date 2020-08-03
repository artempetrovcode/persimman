// @flow
import type {Todo} from '../Todo';
import type {TodoNode} from '../lib/buildTodoTree';
import * as React from 'react';
import {getDateForThisZone, getDayTimestampForThisZone2, getISODateString, nextDayOffset, isDayOff} from '../lib/timeUtils';
import DispatchContext from '../DispatchContext';
import TodoDateTimeInput  from '../TodoListView/TodoDateTimeInput';
import GantHistoryRow from './GantHistoryRow';

const {useContext} = React;

type Props = $ReadOnly<{|
  todos: $ReadOnlyArray<Todo>,
|}>;

function GantHistoryView({todos}: Props) {
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
    .filter((todo: Todo) => todo.eta != null)
    .sort((a: Todo, b: Todo) => a.createdAt == null || b.createdAt == null ? 0 : a.createdAt - b.createdAt)

  todosWithEta
    .forEach((todo: Todo) => {
      const createdAtTimestamp = getDayTimestampForThisZone2(todo.createdAt); 
      if (todo.completedAt != null) {
        const completedAtDayTimestamp = getDayTimestampForThisZone2(todo.completedAt);
        if (groupedByDate[completedAtDayTimestamp] === undefined) {
          groupedByDate[completedAtDayTimestamp] = [];
        }
      }
      if (todo.eta != null) {
        const etaDayTimestamp = getDayTimestampForThisZone2(todo.eta);
        if (groupedByDate[etaDayTimestamp] === undefined) {
          groupedByDate[etaDayTimestamp] = [];
        }
      }
      if (groupedByDate[createdAtTimestamp] === undefined) {
        groupedByDate[createdAtTimestamp] = [];
      }
      groupedByDate[createdAtTimestamp].push(todo);
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


  function getGoalOrGoala(todo: Todo): ?string {
    const chunks = todo.text.split(' ');
    const goalOrGoalaIndex = chunks.includes('@goal') ? chunks.indexOf('@goal') : chunks.indexOf('@goala');
    return chunks[goalOrGoalaIndex + 1];
  }
  

  const toplineGoalTagsToCreatedAt = todosWithEta.reduce((toplineGoalTagsToCreatedAt, todo) => {
    const chunks = todo.text.split(' ');
    if (chunks.includes('@topline')) {
      const goalTag = getGoalOrGoala(todo);
      if (goalTag != null) {
        toplineGoalTagsToCreatedAt[goalTag] = todo.createdAt;
      }
    }
    return toplineGoalTagsToCreatedAt;
  }, {});

  console.log(toplineGoalTagsToCreatedAt)

  function isTopline(todo: Todo): boolean {
    return todo.text.split(' ').includes('@topline')
  }


  // deleted and comleted are not shown
  const todosToRender = todosWithEta.slice().sort((a, b) => {
    const goalA = getGoalOrGoala(a);
    if (goalA == null) {
      console.log('goalA is null');
      return 0;
    }
    const goalB = getGoalOrGoala(b);
    if (goalB == null) {
      console.log('goalB is null');
      return 0;
    }
    const goalAToplineCreatedAt = toplineGoalTagsToCreatedAt[goalA];
    if (goalAToplineCreatedAt == null) {
      console.log('goalAToplineCreatedAt is null')
      return 0;
    }
    const goalBToplineCreatedAt = toplineGoalTagsToCreatedAt[goalB];
    if (goalBToplineCreatedAt == null) {
      console.log('goalBToplineCreatedAt is null')
      return 0;
    }

    if (goalAToplineCreatedAt === goalBToplineCreatedAt) {
      if (isTopline(a)) {
        return -1;
      }
      if (isTopline(b)) {
        return 1;
      }
    }
    
    return goalAToplineCreatedAt - goalBToplineCreatedAt;
  });

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
        <tr style={{fontSize: '10px'}}>
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
        {todosToRender.slice().map(todo => (
          <GantHistoryRow
            level={isTopline(todo) ? 0 : 1}
            key={todo.id}
            todo={todo} 
            sortedDayTimestamps={sortedDayTimestamps} 
            todayTimestamp={todayTimestamp}
          />
        ))}
      </tbody>
    </table>
    </>
  );
}

export default GantHistoryView;