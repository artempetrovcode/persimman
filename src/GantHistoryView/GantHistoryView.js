// @flow
import type {Todo} from '../Todo';
import type {TodoNode} from '../lib/buildTodoTree';
import * as React from 'react';
import {getDateForThisZone, getDayTimestampForThisZone2, getISODateString, nextDayOffset, isDayOff} from '../lib/timeUtils';
import DispatchContext from '../DispatchContext';
import TodoDateTimeInput  from '../TodoListView/TodoDateTimeInput';
import GantHistoryRow from './GantHistoryRow';
import buildTodoTree from '../lib/buildTodoTree';

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

  // deleted and comleted are not shown
  const level0todoNodesWithEta = buildTodoTree(todosWithEta.slice().sort((a, b) => a.createdAt - b.createdAt));

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
        {level0todoNodesWithEta.map(todoNode => (
          <GantHistoryTodoNodeComponent
            level={0}
            key={todoNode.todo.id} 
            todoNode={todoNode} 
            sortedDayTimestamps={sortedDayTimestamps} 
            todayTimestamp={todayTimestamp}
          />
        ))}
      </tbody>
    </table>
    </>
  );
}

type PropsForComponent = $ReadOnly<{
  level: number,
  todoNode: TodoNode;
  sortedDayTimestamps: $ReadOnlyArray<number>,
  todayTimestamp: number,
}>;

function GantHistoryTodoNodeComponent({
  level,
  todoNode,
  sortedDayTimestamps,
  todayTimestamp,
}: PropsForComponent) {
  const {children: childrenTodoNodes, todo} = todoNode;
  const children = childrenTodoNodes.map((childTodoNode, i) => {
    return (
      <GantHistoryTodoNodeComponent
        level={level + 1}
        key={childTodoNode.todo.id} 
        todoNode={childTodoNode} 
        sortedDayTimestamps={sortedDayTimestamps} 
        todayTimestamp={todayTimestamp}
      />
    );
  })

  return (
    <>
      <GantHistoryRow
        level={level}
        todo={todo} 
        sortedDayTimestamps={sortedDayTimestamps} 
        todayTimestamp={todayTimestamp}
      />
      {children}
    </>
  )
}

export default GantHistoryView;