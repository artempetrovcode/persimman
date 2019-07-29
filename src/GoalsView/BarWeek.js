import React from 'react';
import {
  findClosestGoal, 
  getDayLetter, 
  nextDayOffset, 
} from '../lib/timeUtils';
import {CharRow, Char} from './Char';

function range(start, end) {
  return Array.apply(0, Array(end - start + 1))
    .map((element, index) => index + start);
}

function Bar(props) {
  const {groupedByDate, goalsByDate} = props;
  let goal;
  const times = [];
  const timeKeys = Object.keys(groupedByDate);
  const minTime = Math.min.apply(null, timeKeys);
  const maxTime = Math.max.apply(null, timeKeys);

  for (let t = minTime; t <= maxTime; t += nextDayOffset) {
    times.push(t);
    if (groupedByDate[t] === undefined) {
      groupedByDate[t] = [];
    }
  }

  const {maxSum, sumByTime} = times.reduce(({maxSum, lastLengths, sumByTime}, time) => {
    const last = lastLengths.length === 7 ? lastLengths.shift() : 0;
    lastLengths.push(groupedByDate[time].length)
    sumByTime[time] = lastLengths.reduce((sum, len) => sum + len, 0);

    return {
      maxSum: Math.max(maxSum, sumByTime[time]),
      sumByTime,
      lastLengths,
    }
  }, {maxSum: 0, lastLengths: [], sumByTime: {}});

  const maxLength = times.reduce((max, time) =>
    Math.max(max, groupedByDate[time].length, ...goalsByDate.map(g => g[1]), maxSum), 0);
 
  return <>
      {range(1, 1 + maxLength).reverse().map(height => 
        <CharRow key={height}>
          {/* leftmost column (padding) + goal mark */}
          <Char key={0} goal={findClosestGoal(goalsByDate, 0)} score={height} isFirst={true} />,
          {/* days */}
          {times.map(time => 
            <Char 
              key={time} 
              goal={findClosestGoal(goalsByDate, time)} 
              score={height} 
              total={groupedByDate[time].length}
              sum={sumByTime[time]}
            />
          )}
          {/* rightmost column (padding) + goal mark */}
          <Char key={1} goal={findClosestGoal(goalsByDate, Infinity)} score={height} />,
        </CharRow>
      )}
      {/* days row */}
      <CharRow key={0}>
        {/* left column (padding) */}
        <Char key={0} day={''} isFirst={true} />
        {/* day letters */}
        {times.map(time => <Char key={time} day={getDayLetter(new Date(Number(time)))}/>)}
        {/* rightmost column (padding) */}
        <Char key={1} day={''}/>
      </CharRow>
    </>
}

export default Bar;