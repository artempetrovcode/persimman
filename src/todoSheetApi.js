// @flow
import * as api from './sheetsApiV2';
import type {Todo} from './Todo';
import type {RowValue} from './sheetsApiV2';

const SPREADSHEET_ID = '1NxlkrGwkxApnHsu6q38wf93aPmCYgqhekHpqgLxawo4';
const SHEET_NAME = 'todo';
const COLUMN_NAMES_IN_ORDER = [
  'id',          // 0
  'text',        // 1
  'completedAt', // 2
  'isDeleted',   // 3
  'createdAt',   // 4
  'updatedAt',   // 5
  'estimate',    // 6
  'spent',       // 7 
  'eta',         // 8
  'parentId',    // 9
];

function assertType(name: string, value: any, type: string): boolean {
  if (typeof value === type) {
    return true;
  } 

  console.warn(`Expected ${name} (${value}) to be of type ${type}, ${typeof value} is given`);
  return false;
}

function rowValueToIdAndObject(value: RowValue): ?Todo {
  const [id, text, completedAt, isDeleted, createdAt, updatedAt, estimate, spent, eta, parentId] = value;

  if (assertType('id', id, 'string') &&
    assertType('text', text, 'string') &&
    assertType('completedAt', completedAt, 'string') &&
    assertType('isDeleted', isDeleted, 'string') &&
    assertType('createdAt', createdAt, 'string') &&
    assertType('updatedAt', updatedAt, 'string')
    // estimate can be undefined
    // spent can be undefined
    // eta can be undefined
    // parentId can be undefined
  ) {
    return ({
      id,
      text,
      completedAt: completedAt === '' ? null : Number(completedAt), 
      isDeleted: isDeleted === '1',
      createdAt: Number(createdAt),
      updatedAt: Number(updatedAt),
      estimate: estimate == null || estimate === '' ? null : Number(estimate),
      spent: spent == null || spent === '' ? null : Number(spent),
      eta: eta == null || eta === '' ? null : Number(eta),
      parentId: parentId || null,
    }: Todo);
  } else {
    console.warn(`Cannot parse row "${JSON.stringify(value)}"`);
  }
}

function objectToRowValue(todo: Todo): RowValue {
  return [
    todo.id,
    todo.text,
    todo.completedAt == null ? '' : String(todo.completedAt),
    JSON.stringify(todo.isDeleted ? 1 : 0),
    String(todo.createdAt),
    String(todo.updatedAt),
    todo.estimate == null ? '' : String(todo.estimate),
    todo.spent == null ? '' : String(todo.spent),
    todo.eta == null ? '' : String(todo.eta),
    todo.parentId == null ? '' : todo.id,
  ];
}

export function fetch(): Promise<$ReadOnlyArray<Todo>> {
  return api.fetch(SPREADSHEET_ID, SHEET_NAME, COLUMN_NAMES_IN_ORDER.length, rowValueToIdAndObject);
};

export function update(todo: Todo): Promise<Todo> {
  return api.update(SPREADSHEET_ID, SHEET_NAME, COLUMN_NAMES_IN_ORDER.length, objectToRowValue, todo);
};

export function append(todos: $ReadOnlyArray<Todo>): Promise<$ReadOnlyArray<Todo>> {
  return api.append(SPREADSHEET_ID, SHEET_NAME, COLUMN_NAMES_IN_ORDER.length, objectToRowValue, todos);
};