import type {Todo} from './Todo';

type GAPI = $ReadOnly<{|
  client: $ReadOnly<{|
    sheets: $ReadOnly<{|
      spreadsheets: $ReadOnly<{|
        values: $ReadOnly<{|
          get: (params: $ReadOnly<{|
            spreadsheetId: string,
            range: string,
            includeGridData: boolean,
          |}>) => Promise<$ReadOnly<{|
            result: $ReadOnly<{|
              values: $ReadOnlyArray<string>,
            |}>
          |}>>
        |}>
      |}>
    |}>
  |}>
|}>;
declare var gapi: GAPI;

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

export function get(): Promise<$ReadOnlyArray<Todo>> {

  return getGAPI().then(gapi => {
    return gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Class Data!A2:G',
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