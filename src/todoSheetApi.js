import * as api from './sheetsApiV1';
import type {Todo} from './Todo';
import type {RowValue} from './sheetsApiV1';

const SPREADSHEET_ID = '1NxlkrGwkxApnHsu6q38wf93aPmCYgqhekHpqgLxawo4';
const SHEET_NAME = 'todo';
const COLUMN_NAMES_IN_ORDER = [
  'id',          // 0
  'text',        // 1
  'completedAt', // 2
  'isDeleted',   // 3
  'createdAt',   // 4
  'updatedAt',   // 5
];

function rowValueToIdAndObject(value: RowValue): ?Todo {
  const [id, text, completedAt, isDeleted, createdAt, updatedAt] = value;
  if (typeof id === 'string' &&
    typeof text === 'string' &&
    typeof completedAt === 'string' &&
    typeof isDeleted === 'string' &&
    typeof createdAt === 'string' &&
    typeof updatedAt === 'string'
  ) {
    return ({
      id,
      text,
      completedAt: completedAt === '' ? null : Number(completedAt), 
      isDeleted: isDeleted === '1',
      createdAt: Number(createdAt),
      updatedAt: Number(updatedAt),
    }: Todo);
  } else {
    console.warn(`Cannot parse row "${value}"`);
  }
}

function objectToRowValue(todo: Todo): RowValue {
  return [
    todo.id,
    todo.text,
    todo.completedAt,
    JSON.stringify(todo.isDeleted ? 1 : 0),
    todo.createdAt,
    todo.updatedAt,
  ];
}

export function fetch(): Promise<$ReadOnlyArray<Todo>> {
  return api.fetch(SPREADSHEET_ID, SHEET_NAME, COLUMN_NAMES_IN_ORDER.length, rowValueToIdAndObject);
};

export function update(todo: Todo): Promise<Todo> {
  return api.update(SPREADSHEET_ID, SHEET_NAME, COLUMN_NAMES_IN_ORDER.length, objectToRowValue, todo);
};

export function append(todo: Todo): Promise<Todo> {
  return api.append(SPREADSHEET_ID, SHEET_NAME, COLUMN_NAMES_IN_ORDER.length, objectToRowValue, todo);
};