import * as api from './sheetsApi';

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

export function fetch(): Promise<$ReadOnlyArray<Todo>> {
  return api.fetch(SPREADSHEET_ID, SHEET_NAME, COLUMN_NAMES_IN_ORDER.length);
};
export function update(todo: Todo): Promise<Todo> {
  return api.update(SPREADSHEET_ID, SHEET_NAME, COLUMN_NAMES_IN_ORDER.length, todo);
}

export function append(todo: Todo): Promise<Todo> {
  return api.append(SPREADSHEET_ID, SHEET_NAME, COLUMN_NAMES_IN_ORDER.length, todo);
};