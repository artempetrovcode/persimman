import type {Todo} from './Todo';

type GAPI = $ReadOnly<{|
  client: $ReadOnly<{|
    sheets: $ReadOnly<{|
      spreadsheets: $ReadOnly<{|
        values: $ReadOnly<{|
          append: (
            params: $ReadOnly<{|
              spreadsheetId: string,
              range: string,
              valueInputOption: string,
              insertDataOption: string,
            |}>,
            valueRangeBody: $ReadOnly<{|
              range: string,
              majorDimension: string,
              values: $ReadOnlyArray<$ReadOnlyArray<string>>,
            |}>) => Promise<$ReadOnly<{|
            result: $ReadOnly<{|
              spreadsheetId: string,
              tableRange: string,
              updates: $ReadOnly<{|
                spreadsheetId: string,
                updatedCells: number,
                updatedColumns: number,
                updatedRange: string,
                updatedRows: number,
              |}>,
              values: $ReadOnlyArray<$ReadOnlyArray<string>>,
            |}>
          |}>>,
          get: (params: $ReadOnly<{|
            spreadsheetId: string,
            range: string,
            includeGridData: boolean,
          |}>) => Promise<$ReadOnly<{|
            result: $ReadOnly<{|
              values: $ReadOnlyArray<$ReadOnlyArray<string>>,
            |}>
          |}>>
        |}>
      |}>
    |}>
  |}>
|}>;
declare var gapi: GAPI;

// todo add typesafety here
// todo track collisions (2 clients can add records at the same time)
// refetch on collision

function getGAPI(): Promise<GAPI> {
  return new Promise((resolve, reject) => {
    let triesLeft = 50;
    function tryResolve() {
      if (window.__isGapiLoadedAndAuthorized) {
        resolve(gapi);
      } else if (triesLeft === 0) {
        reject('Could not load gapi');
      } else {
        triesLeft -= 1;
        setTimeout(tryResolve, 100);
      }
    }

    tryResolve();
  });
}

const SPREADSHEET_ID = '1NxlkrGwkxApnHsu6q38wf93aPmCYgqhekHpqgLxawo4';
const SHEET_NAME = 'todo';
const FIRST_COLUMN_INDEX = 1; // 1-based
const NUMBER_OF_COLUMNS = 7;
const FIRST_ROW_INDEX = 2; // 1-based
const COLUMN_INDEX_TO_CODE = {
  1: 'A',
  2: 'B',
  3: 'C',
  4: 'D',
  5: 'E',
  6: 'F',
  7: 'G',
  8: 'H',
  9: 'J',
};

function getRange(rangeObj: RangeObject): string {
  const {sheetName, firstColumnCode, firstRowIndex, lastColumnCode, lastRowIndex } = rangeObj;
  const first = firstColumnCode + (firstRowIndex == null ? '' : firstRowIndex);
  const last = lastColumnCode + (lastRowIndex == null ? '' : lastRowIndex);
  return `${sheetName}!${first}:${last}`;
}

type RangeObject = {|
  sheetName: string,
  firstColumnCode: string,
  firstRowIndex: ?number,
  lastColumnCode: string,
  lastRowIndex: ?number,
|};

function parseRange(range: string): RangeObject {
  const [sheetName, rangePair] = range.split('!');
  if (sheetName == null || rangePair == null) {
    throw new Error(`Cannot parse range: ${range}`);
  }

  const [first, last] = rangePair.split(':');
  if (first == null || last == null) {
    throw new Error(`Cannot parse range: ${range}`);
  }

  const matchFirst = first.match(/([A-Z]+)(\d+)/);
  if (!Array.isArray(matchFirst) || matchFirst.length < 3) {
    throw new Error(`Cannot parse range: ${range}`);
  }

  const firstColumnCode = matchFirst[1];
  const firstRowIndex = parseInt(matchFirst[2], 10);
  if (isNaN(firstRowIndex)) {
    throw new Error(`Cannot parse range: ${range}`);
  }

  const matchLast = last.match(/([A-Z]+)(\d+)/);
  if (!Array.isArray(matchLast) || matchLast.length < 3) {
    throw new Error(`Cannot parse range: ${range}`);
  }

  const lastColumnCode = matchLast[1];
  const lastRowIndex = parseInt(matchLast[2], 10);
  if (isNaN(lastRowIndex)) {
    throw new Error(`Cannot parse range: ${range}`);
  }

  return {
    sheetName,
    firstColumnCode,
    firstRowIndex,
    lastColumnCode,
    lastRowIndex,
  }
}

const RANGE = getRange({
  sheetName: SHEET_NAME,
  firstColumnCode: COLUMN_INDEX_TO_CODE[FIRST_COLUMN_INDEX],
  firstRowIndex: FIRST_ROW_INDEX,
  lastColumnCode: COLUMN_INDEX_TO_CODE[FIRST_COLUMN_INDEX + NUMBER_OF_COLUMNS - 1],
  lastRowIndex: null,
}); //'Class Data!A2:G';

console.log('RANGE', RANGE)

export function fetch(): Promise<$ReadOnlyArray<Todo>> {

  return getGAPI().then(gapi => {
    return gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
      includeGridData: true,
    }).then(function(response) {

      if (response == null || response.result == null || 
        !Array.isArray(response.result.values)
      ) {
        return [];
      }

      return response.result.values.map((value, index) => {
        if (!Array.isArray(value)) {
          return undefined;
        }

        const [id, text, completedAt, userId, isDeleted, createdAt, updatedAt] = value;
        if (typeof id === 'string' &&
          typeof text === 'string' &&
          typeof completedAt === 'string' &&
          typeof userId === 'string' && 
          typeof isDeleted === 'string' &&
          typeof createdAt === 'string' &&
          typeof updatedAt === 'string'
        ) {
          return ({
            id,
            row: index + 2,
            text,
            completedAt, 
            userId, 
            isDeleted: isDeleted === '1',
            createdAt,
            updatedAt
          }: Todo);
        }
      }).filter(Boolean);
    });
  });
}

export function append(todo: Todo): Promise<Todo> {

  return getGAPI().then((gapi: GAPI) => {
    return gapi.client.sheets.spreadsheets.values.append(
      {
        spreadsheetId: SPREADSHEET_ID,
        range: RANGE,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
      },
      {
        range: RANGE,
        majorDimension: 'ROWS',
          values: [
            [
              todo.id,
              todo.text,
              todo.completedAt,
              todo.userId,
              todo.isDeleted ? '1' : '0',
              todo.createdAt,
              todo.updatedAt,
          ]
        ],
      }
    ).then(function(response) {      
      console.log(response);
      if (response == null || response.result == null || 
        response.result.updates == null ||
        response.result.updates.updatedRows !== 1 ||
        typeof response.result.updates.updatedRange !== 'string'
      ) {
        throw new Error('Cannot append todo');
      }

      return {
        ...todo,
        row: parseRange(response.result.updates.updatedRange).firstRowIndex,
      }
    });
  });
}