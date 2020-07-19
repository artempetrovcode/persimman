// @flow
import type {Todo} from '../Todo';
import * as React from 'react';
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';
const {useState, useContext} = React;

const SELECT_GOAL = 'SELECT_GOAL';

function isGoal(text) {
  return text.split(' ').includes('@target')
}

type Props = {|
  goal: string,
|}

function QuickAdd({goal}: Props) {
  const state = useContext(StateContext);
  const commands = useContext(DispatchContext);
  const [selected, setSelected] = useState(SELECT_GOAL);
  if (commands == null) {
    return null;
  }
  const {addTodo} = commands;
  const optionsToFrequency: {[key: string]: number} = {};

  state.todos.forEach((todo: Todo) => {
    if (!todo.text.split(' ').includes(goal)) {
      return;
    }

    if (todo.text.split(' ').includes('@target')) {
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
      addTodo(e.target.value, true, state.timeOffsetInMs, false);
      setSelected(SELECT_GOAL)
    }
  }

  return (
    <select value={selected} onChange={handleChange}>
      <option value={SELECT_GOAL} key={goal}>Quick Add</option>
      {options.map(([text, freq]) => <option value={goal + ' ' + text} key={text}>{text} - {freq}</option>)}
    </select>
  );
}

export default QuickAdd;