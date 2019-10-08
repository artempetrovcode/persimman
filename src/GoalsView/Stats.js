// @flow
import type {Todo} from '../Todo';
import * as React from 'react';
import StateContext from '../StateContext';
import BarWeek from './BarWeek';
import Bar from './Bar';
import QuickAdd from './QuickAdd';
import {getDateForThisZone, getDayTimestampForThisZone2} from '../lib/timeUtils';

const {useContext, useState} = React;

function isGoal(text) {
  return text.split(' ').includes('@goal')
}
function getGoal(text) {
  return parseFloat(text.split(' ').filter(t => t[0] !== '@')[0])
}

type Props = {|
  goal: string,
|}

function Stats(props: Props) {
  const state = useContext(StateContext);
  const [isDetailed, setIsDetailed] = useState(false);

  let goal = 0;
  let goalText = '';
  const groupedByDate = {
    [getDayTimestampForThisZone2(Date.now())]: [],
  };
  const goalsByDate = [];

  state.todos.forEach((todo: Todo) => {

    if (!todo.text.split(' ').includes(props.goal)) {
      return;
    }

    const dayTimestamp = getDayTimestampForThisZone2(todo.createdAt);

    if (isGoal(todo.text)) {
      goalText = todo.text;
      goal = getGoal(todo.text);
      goalsByDate.push([dayTimestamp, goal]);
      return;
    }

    if (groupedByDate[dayTimestamp] === undefined) {
      groupedByDate[dayTimestamp] = [];
    }
    groupedByDate[dayTimestamp].push(todo);
  });

  goalsByDate.sort((a, b) => a[0] - b[0]);

  return (
    <>
      <div>
        <span onClick={() => setIsDetailed(prev => !prev)} style={{textDecoration:'underline', fontWeight: 'bold'}}>
          {goalText}
        </span>
        <QuickAdd goal={props.goal} />
      </div>
      <div style={{padding: '10px'}}>
      { goalText.match('@goal @flexibility') || goalText.match('@goal @gym') || goalText.match('@goal @posture') ? 
        <BarWeek goal={goal} goalsByDate={goalsByDate} groupedByDate={groupedByDate} />:
        <Bar goal={goal} goalsByDate={goalsByDate} groupedByDate={groupedByDate} />
      }      
      </div>
      {isDetailed && Object.keys(groupedByDate).map(Number).sort((a,b) => b - a).map(dayTimestamp => (
        <div key={dayTimestamp}>
          <p>{(new Date(Number(dayTimestamp)).toDateString())}</p>
          <ul>
            {groupedByDate[dayTimestamp].map(todo => (
              <li key={todo.id}>
                {todo.text} [{new Date(todo.createdAt).toLocaleTimeString()}]
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

export default Stats;