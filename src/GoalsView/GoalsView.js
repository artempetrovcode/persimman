// @flow
import type {Todo} from '../Todo';
import * as React from 'react';
import StateContext from '../StateContext';
import QuickAdd from './QuickAdd';
import Stats from './Stats';

const {useContext} = React;

function GoalsView() {
  const state = useContext(StateContext);

  const goals = [];
  state.todos.forEach((todo: Todo) => {
    if (todo.text.match(/@goal/)) {
      const goal = todo.text.split(' ').find(word => word[0] === '@' && word !== '@goal');
      goals.push(goal);
    }
  })

  const uniqueGoals = {};
  for (const goal of goals) {
    uniqueGoals[goal] = true;
  }

  return (
    <>
      {Object.keys(uniqueGoals).map(goal => 
        <div key={goal} style={{borderBottom: '1px solid', marginTop: '10px'}}>
          <QuickAdd goal={goal} />
          <Stats goal={goal} />
        </div>
      )}
    </>
  );
}

export default GoalsView;