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
        const prevSameLevelTodoId = i === 0 ? null : level0todoNodes[i - 1].todo.id;
        const nextSaveLevelTodoNode = level0todoNodes[i + 1];
        const nextSameLevelTodo = nextSaveLevelTodoNode != null ? nextSaveLevelTodoNode.todo : null;
        return (
          <TodoNodeComponent 
            key={level0todoNode.todo.id} 
            nextSameLevelTodo={nextSameLevelTodo}
            todoNode={level0todoNode} 
            prevSameLevelTodoId={prevSameLevelTodoId} 
            grandParentTodoId={null}
          />
        );
      })}
    </ul>
  )
}

type PropsFor = {
  todoNode: TodoNode;
  prevSameLevelTodoId: ?string,
  grandParentTodoId: ?string,
  nextSameLevelTodo: ?Todo,
}

function TodoNodeComponent(props: PropsFor) {
  const children = props.todoNode.children.map((childTodoNode, i) => {
    const nextSaveLevelTodoNode = props.todoNode.children[i + 1];
    const nextSameLevelTodo = nextSaveLevelTodoNode != null ? nextSaveLevelTodoNode.todo : null;
    const prevSameLevelTodoId = i === 0 ? null : props.todoNode.children[i - 1].todo.id;
    return (
      <TodoNodeComponent 
        grandParentTodoId={props.todoNode.todo.parentId}
        key={childTodoNode.todo.id} 
        nextSameLevelTodo={nextSameLevelTodo}
        todoNode={childTodoNode} 
        prevSameLevelTodoId={prevSameLevelTodoId}
      />
    );
  });

  return (
    <>
      <li>
        <TodoItem
          allowParentChange={true}
          grandParentTodoId={props.grandParentTodoId}
          nextSameLevelTodo={props.nextSameLevelTodo}
          todo={props.todoNode.todo}
          prevSameLevelTodoId={props.prevSameLevelTodoId}
        />
      </li>
      {children.length > 0 ? <ul>{children}</ul> : null}
    </>
  );
}

export default TodoListView;