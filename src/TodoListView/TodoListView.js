// @flow
import type {Todo} from '../Todo';
import type {TodoNode} from '../lib/buildTodoTree';
import * as React from 'react';
import StateContext from '../StateContext';
import TodoItem from './TodoItem';
import buildTodoTree from '../lib/buildTodoTree';


const {useContext} = React;

type Props = $ReadOnly<{|
  todos: $ReadOnlyArray<Todo>,
|}>;

function TodoListView({todos}: Props) {
  const state = useContext(StateContext);

  if (state.isLoading) {
    return <div>Loading...</div>;
  }

  if (state.isError) {
    return <div>Error...</div>;
  }

  // deleted and comleted are not shown
  const level0todoNodes = buildTodoTree(todos.slice().sort((a, b) => b.createdAt - a.createdAt));

  return (
    <ul>
      {level0todoNodes.map((level0todoNode, i) => {
        return <TodoNodeComponent key={i} todoNode={level0todoNode} />
      })}
    </ul>
  )
}

type PropsFor = {
  todoNode: TodoNode;
}

function TodoNodeComponent(props: PropsFor) {
  const children = props.todoNode.children.map((childTodoNode, i) => <TodoNodeComponent key={i} todoNode={childTodoNode} />);

  return (
    <>
      <li><TodoItem todo={props.todoNode.todo} /></li>
      {children.length > 0 ? <ul>{children}</ul> : null}
    </>
  );
}

export default TodoListView;