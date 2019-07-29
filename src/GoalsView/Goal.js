// @flow
import type {Todo} from '../Todo';
import * as React from 'react';
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';
const {useState, useContext} = React;

const SELECT_GOAL = 'SELECT_GOAL';

function isGoal(text) {
  return text.split(' ').includes('@goal')
}

type Props = {|
  goal: string,
|}

function Goal({goal}: Props) {
  const state = useContext(StateContext);
  const {addTodo} = useContext(DispatchContext);
  const [selected, setSelected] = useState(SELECT_GOAL);
  const optionsToFrequency: {[key: string]: number} = {};

  state.todos.forEach((todo: Todo) => {
    if (!todo.text.split(' ').includes(goal)) {
      return;
    }

    if (todo.text.split(' ').includes('@goal')) {
      return;
    }

    const text = todo.text.replace(goal, '').trim();

    if (optionsToFrequency[text] === undefined) {
      optionsToFrequency[text] = 0;
    }
    optionsToFrequency[text] += 1;
  });

  const options = Object.keys(optionsToFrequency).map((option: string) => {
    return [
      option,
      optionsToFrequency[option]
    ]
  }).sort((a: [string, number], b: [string, number]) => b[1] - a[1]);

  function handleChange(e) {
    if (e.target.value !== SELECT_GOAL) {
      addTodo(e.target.value, true);
      setSelected(SELECT_GOAL)
    }
  }

  return (
    <div>
      Quick Add:  {goal}
      <select value={selected} onChange={handleChange}>
        <option value={SELECT_GOAL} key={goal}>{goal}</option>
        {options.map(([text, freq]) => <option value={goal + ' ' + text} key={text}>{text} - {freq}</option>)}
      </select>
    </div> 
  );
}

export default Goal;