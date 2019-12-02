const offset = (new Date()).getTimezoneOffset() * 60 * 1000;

export function getDateForThisZone(createdAt: number): Date {
  return new Date(createdAt - offset);
}

export function getDayTimestampForThisZone(createdAt: number): number {
  const date = getDateForThisZone(createdAt);
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date.getTime();
}

const DAYS_OFF = [
  1574928000000,
  1575014400000,
  1575100800000,
  1575187200000,
  1575705600000,
  1575792000000,
];

export function isDayOff(dayTimestamp: number): boolean {
  const date = new Date(dayTimestamp);
  const day = date.getDay();
  if (day === 0 || day === 6) {
    // Sun or Sat
    return true;
  }
  return DAYS_OFF.includes(dayTimestamp);
}

export function getDayTimestampForThisZone2(createdAt: number): number {
  const date = new Date(createdAt);
  date.setHours(0, 0, 0, 0);
  // date.setMinutes(0);
  // date.setSeconds(0);
  // date.setMilliseconds(0);
  return date.getTime();
}

// function test(goalsByDate, date, expected) {
//   const actual = findClosestGoal(goalsByDate, date, 0);
//   console.log({actual, expected, res: actual === expected})
// }

// test([
//   [1559890800000, 2], 
//   [1560927600000, 3],
//   [2560927600000, 4],
// ], 0, 2);

// test([
//   [1559890800000, 2], 
//   [1560927600000, 3],
//   [2560927600000, 4],
// ], 559890800000, 2);

// test([
//   [1559890800000, 2], 
//   [1560927600000, 3],
//   [2560927600000, 4],
// ], 1559890800000, 2);

// test([
//   [1559890800000, 2], 
//   [1560927600000, 3],
//   [2560927600000, 4],
// ], 1559890800001, 2);

// test([
//   [1559890800000, 2], 
//   [1560927600000, 3],
//   [2560927600000, 4],
// ], 1560927500000, 2);

// test([
//   [1559890800000, 2], 
//   [1560927600000, 3],
//   [2560927600000, 4],
// ], 1560927600000, 3);

// test([
//   [1559890800000, 2], 
//   [1560927600000, 3],
//   [2560927600000, 4],
// ], 1560927600001, 3);

// test([
//   [1559890800000, 2], 
//   [1560927600000, 3],
//   [2560927600000, 4],
// ], 2560927600000, 4);


// test([
//   [1559890800000, 2], 
//   [1560927600000, 3],
//   [2560927600000, 4],
// ], 2560927600001, 4);

// test([
//   [1559890800000, 2], 
//   [1560927600000, 3],
//   [2560927600000, 4],
// ], Infinity, 4);

export function findClosestGoal(goalsByDate, date, log = false) {
  // console.log(goalsByDate, date)
  if (goalsByDate.length === 0) {
    throw new Error('no goals provided');
  }
  if (date < goalsByDate[0][0]) {
    return goalsByDate[0][1];
  }
  if (date === Infinity) {
    return goalsByDate[goalsByDate.length - 1][1];
  }
  let prevGoal = goalsByDate[0][1];
  for (let i = 0; i < goalsByDate.length; i++) {
    if (date === goalsByDate[i][0]) {
      // if (log) {
      //   console.log('====')
      // }
      return goalsByDate[i][1];
    }
    log && console.log(date, goalsByDate[i][0])
    if (date < goalsByDate[i][0]) {
      // if (log) {
      //   console.log('prevGoal')
      // }
      return prevGoal;
    }
    prevGoal = goalsByDate[i][1];
  }
  return prevGoal;
}

function withLeadingZero(str: string) {
  if (str.length === 1) {
    return '0' + str;
  }
  return str;
}

export const getISOTimeString = (d) => {
  const [time, amOrPm] = d.toLocaleTimeString().split(' ');
  const pmShift = amOrPm === 'PM' ? 12 : 0;
  const [hours, minutes, seconds] = time.split(':');

  return `${withLeadingZero(String(Number(hours) + pmShift))}:${minutes}:${seconds}`;
}

export const getISODateString = (d) => {
  const [month, date, year] = d.toLocaleDateString().split('/');
  return `${year}-${withLeadingZero(month)}-${withLeadingZero(date)}`;
}

export const getDayLetter = d => 'SMTWTFS'[d.getDay()];

export const nextDayOffset = 1000 * 60 * 60 * 24;

export const formatDateTime = (timestamp: number): string => {
  return getISODateString(new Date(timestamp)) + ' ' + getISOTimeString(new Date(timestamp));
}

export const getTodayMidnightTimestamp = () => {
  const now = Date.now();
  const msInADay = 1000 * 60 * 60 * 24;
  return now - (now % msInADay);
}