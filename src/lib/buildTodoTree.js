// @flow
import type {Todo} from '../Todo';

export type TodoNode = $ReadOnly<{
  todo: Todo,
  children: $ReadOnlyArray<TodoNode>,
}>;

function buildTodoTree(todos: $ReadOnlyArray<Todo>): $ReadOnlyArray<TodoNode> {

  const tree = [];
  const todoNodeById = {};

  todos.forEach(todo => {
    if (todo.id === todo.parentId) {
      throw new Error(`todo.parentId cannot be equa todo.id`)
    }

    if (todoNodeById[todo.id] == null) {
      todoNodeById[todo.id] = {
        todo: null,
        children: [],
      };
    }
    todoNodeById[todo.id].todo = todo;

    if (todo.parentId == null) {
      tree.push(todoNodeById[todo.id]);
    } else {
      if (todoNodeById[todo.parentId] == null) {
        todoNodeById[todo.parentId] = {
          todo: null,
          children: [],
        }
      }
      todoNodeById[todo.parentId].children.push(todoNodeById[todo.id]);
    }
  })

  if (Object.keys(todoNodeById).forEach(id => {
    if (todoNodeById[id].todo == null) {
      throw new Error(`TodoNode with id ${id} has null todo: ${JSON.stringify(todoNodeById[id])}`)
    }
  }));
  
  return tree;
}

export default buildTodoTree;
