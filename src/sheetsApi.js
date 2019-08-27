import type {Todo} from './Todo';

function rowValueToIdAndObject(value) {
  const [id, text, completedAt, isDeleted, createdAt, updatedAt] = value;
  if (typeof id === 'string' &&
    typeof text === 'string' &&
    typeof completedAt === 'string' &&
    typeof isDeleted === 'string' &&
    typeof createdAt === 'string' &&
    typeof updatedAt === 'string'
  ) {
    // todo validate completedAt and other dates
    // todo throw on invalid rows

    const obj = ({
      id,
      text,
      completedAt: completedAt === '' ? null : Number(completedAt), 
      isDeleted: isDeleted === '1',
      createdAt: Number(createdAt),
      updatedAt: Number(updatedAt),
    }: Todo);

    return [id, obj];
  } 

  return [null, null];
}

function objectToRowValue(todo) {
  return [
    todo.id,
    todo.text,
    todo.completedAt,
    JSON.stringify(todo.isDeleted ? 1 : 0),
    todo.createdAt,
    todo.updatedAt,
  ];
}

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
          |}>>,
          update: (
            params: $ReadOnly<{|
              spreadsheetId: string,
              range: string,
              valueInputOption: string,
            |}>,
            valueRangeBody: $ReadOnly<{|
              range: string,
              majorDimension: string,
              values: $ReadOnlyArray<$ReadOnlyArray<string>>,
            |}>) => Promise<$ReadOnly<{|
            result: $ReadOnly<{|
              spreadsheetId: string,
              updatedCells: number,
              updatedColumns: number,
              updatedRange: string,
              updatedRows: number,
            |}>
          |}>>,
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

const FIRST_COLUMN_INDEX = 1; // 1-based
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

const idToRowIndexCache = new Map();

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

function createFullRange(sheetName, numberOfColumns) {
  return getRange({
    sheetName: sheetName,
    firstColumnCode: COLUMN_INDEX_TO_CODE[FIRST_COLUMN_INDEX],
    firstRowIndex: FIRST_ROW_INDEX,
    lastColumnCode: COLUMN_INDEX_TO_CODE[FIRST_COLUMN_INDEX + numberOfColumns],
    lastRowIndex: null,
  }); 
}

export function fetch(spreadsheetId: string, sheetName: string, numberOfColumns: number): Promise<$ReadOnlyArray<Todo>> {

  return getGAPI().then(gapi => {
    return gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId,
      range: createFullRange(sheetName, numberOfColumns),
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

        const [id, obj] = rowValueToIdAndObject(value);
        if (id != null) {
          idToRowIndexCache.set(id, index + 2);
          return obj;
        }
      }).filter(Boolean);
    });
  });
}

export function append<T>(spreadsheetId: string, sheetName: string, numberOfColumns: number, obj: T): Promise<T> {

  return getGAPI().then((gapi: GAPI) => {
    return gapi.client.sheets.spreadsheets.values.append(
      {
        spreadsheetId,
        range: createFullRange(sheetName, numberOfColumns),
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
      },
      {
        range: createFullRange(sheetName, numberOfColumns),
        majorDimension: 'ROWS',
        values: [
          objectToRowValue(obj),
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

      const rowIndex = parseRange(response.result.updates.updatedRange).firstRowIndex;
      idToRowIndexCache.set(obj.id, rowIndex);

      return {
        ...obj,
      }
    });
  });
}

export function update<T>(spreadsheetId: string, sheetName: string, numberOfColumns: number, obj: T): Promise<T> {

  const rowIndex = idToRowIndexCache.get(obj.id);
  if (rowIndex == null) {
    throw new Error(`id ${obj.id} is not in cache`);
  }
  const range = getRange({
    sheetName,
    firstColumnCode: COLUMN_INDEX_TO_CODE[FIRST_COLUMN_INDEX],
    firstRowIndex: rowIndex,
    lastColumnCode: COLUMN_INDEX_TO_CODE[FIRST_COLUMN_INDEX + numberOfColumns],
    lastRowIndex: rowIndex,
  });

  return getGAPI().then((gapi: GAPI) => {
    return gapi.client.sheets.spreadsheets.values.update(
      {
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
      },
      {
        range,
        majorDimension: 'ROWS',
          values: [
            objectToRowValue(obj),
        ],
      }
    ).then(function(response) {      
      console.info('UPDATE', response);
      if (response == null || response.result == null || 
        response.result.updatedRows !== 1 ||
        typeof response.result.updatedRange !== 'string'
      ) {
        throw new Error('Cannot update obj');
      }

      const updatedRowIndex = parseRange(response.result.updatedRange).firstRowIndex;
      if (updatedRowIndex !== rowIndex) {
        throw new Error('Updated row index does not match requested');
      }

      return {
        ...obj,
      }
    });
  });
}