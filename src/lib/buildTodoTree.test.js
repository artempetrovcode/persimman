import type {Todo} from '../Todo';
import type {TodoNode} from './buildTodoTree';
import buildTodoTree from './buildTodoTree';

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

describe('buildTodoTree', () => {
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

  [
    [
      [],
      [],
    ],
    [
      [
        topParent1,
      ],
      (new Tree())
        .addChildren(topParent1)
      .build(),
    ],
    [
        [
          topParent1,
          topParent2,
        ],
        (new Tree())
          .addChildren(topParent1)
        .back()
          .addChildren(topParent2)
        .build(),
    ],
    [
        [
          topParent2,
          topParent1,
        ],
        (new Tree())
          .addChildren(topParent2)
          .back()
          .addChildren(topParent1)
        .build(),
    ],
    [
        [
          topParent1,
          p(leaf1, topParent1),
        ],
        (new Tree())
          .addChildren(topParent1)
            .addChildren(leaf1)
        .build(),
    ],
    [
      [
        p(leaf1, topParent1),
        topParent1,
      ],
      (new Tree())
        .addChildren(topParent1)
          .addChildren(leaf1)
      .build(),
    ],
    [
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
    ],
    [
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
    ],
    [
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
    ],
    [
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
    ],
    [
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
    ],
    [
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
    ],
    [
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
    ],
    [
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
    ],
    [
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
    ],
    [
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
      treeForTestingOrderAgnisticizm
    ],
    [
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
    ]

  ].forEach(([todos, expected], i) => {
    test(`case ${i}`, () => {
      const builtTree = buildTodoTree(todos);
      expect(builtTree).toEqual(expected);
    })
  })
});