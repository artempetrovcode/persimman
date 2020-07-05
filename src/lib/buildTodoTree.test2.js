
// import type {Todo} from '../Todo';
// import type {TodoNode} from './buildTodoTree';
// import buildTodoTree from './buildTodoTree';
const buildTodoTree = require('./buildTodoTree');

let staticNextId = 1;

function t(name) {
  const now = Date.now();
  return {
    id: staticNextId++,
    text: name,
    completedAt: null,
    isDeleted: false,
    createdAt: now,
    updatedAt: now,
    eta: null,
    parentId: null,
  };
}
function p(todo, parent) {
  return {
    ...todo,
    parentId: parent.id,
  }
}

let staticCount = 0;

function test(todos, expected) {
  // function test(todos: $ReadOnlyArray<Todo>, expected: $ReadOnlyArray<TodoNode>): void {
  staticCount++;
  const actualJSON = JSON.stringify(buildTodoTree(todos));
  const expectedJSON = JSON.stringify(expected);
  
  if (actualJSON !== expectedJSON) {
    throw new Error(`
       staticCount: ${staticCount}
        actualJSON: ${actualJSON}
      expectedJSON: ${expectedJSON}
      `)
  }
}

class Tree {
  constructor() {
    this.topTodos = {
      todo: null,
      children: [],
    };
    this.current = this.topTodos;
    this.stack = [];
  }
  addChildren(todo) {
    const todoNode = {
      todo: {
        ...todo,
        parentId: this.current.todo == null ? null : this.current.todo.id,
      },
      children: [],
    };
    this.current.children.push(todoNode);
    this.stack.push(this.current);
    this.current = todoNode;
    return this;
  }
  back() {
    if (this.stack.length === 0) {
      throw new Error('cant go back, stack is empty');
    }
    this.current = this.stack.pop();
    return this;
  }
  build() {
    return this.topTodos.children;
  }
}

const topParent1 = t('topParent1');
const topParent2 = t('topParent2');
const topParent3 = t('topParent3');
const topParent4 = t('topParent4');
const midNode1 = t('midNode1');
const midNode2 = t('midNode2');
const midNode3 = t('midNode3');
const midNode4 = t('midNode4');
const leaf1 = t('leaf1');
const leaf2 = t('leaf2');
const leaf3 = t('leaf3');
const leaf4 = t('leaf4');

test(
  [],
  [],
)

test(
  [
    topParent1,
  ],
  (new Tree())
    .addChildren(topParent1)
  .build(),
)

test(
  [
    topParent1,
    topParent2,
  ],
  (new Tree())
    .addChildren(topParent1)
  .back()
    .addChildren(topParent2)
  .build(),
)

test(
  [
    topParent2,
    topParent1,
  ],
  (new Tree())
    .addChildren(topParent2)
    .back()
    .addChildren(topParent1)
  .build(),
)

test(
  [
    topParent1,
    p(leaf1, topParent1),
  ],
  (new Tree())
    .addChildren(topParent1)
      .addChildren(leaf1)
  .build(),
)

test(
  [
    p(leaf1, topParent1),
    topParent1,
  ],
  (new Tree())
    .addChildren(topParent1)
      .addChildren(leaf1)
  .build(),
)

test(
  [
    topParent1,
    p(leaf1, topParent1),
    topParent2,
  ],
  (new Tree())
    .addChildren(topParent1)
      .addChildren(leaf1)
      .back()
    .back()
    .addChildren(topParent2)

  .build(),
)

test(
  [
    topParent1,
    topParent2,
    p(leaf1, topParent1),
  ],
  (new Tree())
    .addChildren(topParent1)
      .addChildren(leaf1)
      .back()
    .back()
    .addChildren(topParent2)

  .build(),
)


test(
  [
    p(leaf1, topParent1),
    topParent1,
    topParent2,
  ],
  (new Tree())
    .addChildren(topParent1)
      .addChildren(leaf1)
      .back()
    .back()
    .addChildren(topParent2)

  .build(),
)

test(
  [
    topParent2,
    p(leaf1, topParent1),
    topParent1,
  ],
  (new Tree())
    .addChildren(topParent2)
    .back()
    .addChildren(topParent1)
      .addChildren(leaf1)
      .back()
  .build(),
)

test(
  [
    topParent1,
    p(leaf1, topParent1),
    p(leaf2, topParent1),
  ],
  (new Tree())
    .addChildren(topParent1)
      .addChildren(leaf1)
      .back()
      .addChildren(leaf2)  
  .build(),
)

test(
  [
    topParent1,
    p(midNode1, topParent1),
    p(leaf1, midNode1),
  ],
  (new Tree())
    .addChildren(topParent1)
      .addChildren(midNode1)
        .addChildren(leaf1)
  .build(),
)

test(
  [
    p(midNode1, topParent1),
    p(leaf1, midNode1),
    topParent1,
  ],
  (new Tree())
    .addChildren(topParent1)
      .addChildren(midNode1)
        .addChildren(leaf1)
  .build(),
)

test(
  [
    p(leaf1, midNode1),
    p(midNode1, topParent1),
    topParent1,
  ],
  (new Tree())
    .addChildren(topParent1)
      .addChildren(midNode1)
        .addChildren(leaf1)
  .build(),
)

test(
  [
    p(leaf1, midNode1),
    topParent1,
    p(midNode1, topParent1),
  ],
  (new Tree())
    .addChildren(topParent1)
      .addChildren(midNode1)
        .addChildren(leaf1)
  .build(),
)

const treeForTestingOrderAgnisticizm = (new Tree())
    .addChildren(topParent1)
      .addChildren(midNode1)
        .addChildren(leaf1)
        .back()
        .addChildren(leaf2)
        .back()
        .addChildren(midNode2)
          .addChildren(midNode3)
            .addChildren(leaf3)
            .back()
          .back()
        .back()
      .back()
    .back()
    .addChildren(topParent2)
    .back()
    .addChildren(topParent3)
      .addChildren(leaf4)
      .back()
    .back()
    .addChildren(topParent4)
  .build();

test(
  [
    topParent1,
    p(midNode1, topParent1),
    p(leaf1, midNode1),
    p(leaf2, midNode1),
    p(midNode2, midNode1),
    p(midNode3, midNode2),
    p(leaf3, midNode3),
    topParent2,
    topParent3,
    p(leaf4, topParent3),
    topParent4,
  ],
  treeForTestingOrderAgnisticizm,
)

test(
  [
    p(leaf1, midNode1),
    p(leaf2, midNode1),
    p(midNode2, midNode1),
    p(leaf3, midNode3),
    p(midNode1, topParent1),
    p(midNode3, midNode2),
    p(leaf4, topParent3),
    topParent1,
    topParent2,
    topParent3,
    topParent4,
  ],
  treeForTestingOrderAgnisticizm,
)


// test(
//   [
//     {"id":"bfe14d07-9a4f-430e-8808-75170048768d","text":"@flexibility 30 min stretch","completedAt":null,"isDeleted":false,"createdAt":1586053587158,"updatedAt":1586028707895,"eta":1585958400000,"parentId":"52d4ac2f-2eeb-416c-aaff-587ecc39c1bd"},
//     {"id":"72ffba90-f984-49a3-9bb0-ef6f7eda9733","text":"@diet 🍳 balanced breakfast ","completedAt":null,"isDeleted":false,"createdAt":1585448867217,"updatedAt":1586028722188,"eta":1585958400000,"parentId":null},
//     {"id":"d9d46fd7-1170-4b0d-8ada-c8e4d78b1dc6","text":"@diet 🥐 healthy brunch","completedAt":null,"isDeleted":false,"createdAt":1585880877815,"updatedAt":1586028713299,"eta":1585958400000,"parentId":null},
//     {"id":"ce3ff4b9-556a-4bd4-a54e-18a6f0f4383b","text":"add me2","completedAt":null,"isDeleted":false,"createdAt":1587944254848,"updatedAt":1587944651980,"eta":1587944651980,"parentId":null},
//     {"id":"b9a8a18f-72ff-4e6f-ba6e-760ccdbe7466","text":"uadd","completedAt":null,"isDeleted":false,"createdAt":1587944364150,"updatedAt":1587944587573,"eta":1587945600000,"parentId":null},
//     {"id":"b918fa69-7c41-41b4-a241-aaeb9a43f040","text":"uadd","completedAt":null,"isDeleted":false,"createdAt":1587944373041,"updatedAt":1587944465951,"eta":1587859200000,"parentId":null},
//     {"id":"3664c4ce-c6b6-47cb-8b06-15d6d6e60474","text":"yo with eta","completedAt":null,"isDeleted":false,"createdAt":1587944938973,"updatedAt":1587944947250,"eta":1588117738973,"parentId":null},
//   ],
//   []
// )



console.log(`PASSED ${staticCount} tests`)
