// @flow
const regExp = /(.*)(\s@encode\s)((.|\n)*)/;

const DEFAULT_ALGORITHM_VERSION = '0002';
const ALGORITHMS_BY_VERSION = {
  '0001': {
    encode: (plain: string): string => btoa(plain),
    decode: (encoded: string): string => atob(encoded),
  },
  '0002': {
    encode: (plain: string): string => shiftCharCodes(plain, 1),
    decode: (encoded: string): string => shiftCharCodes(encoded, -1),
  },
};

const decodeAlgorithmVersion = (encodedString: string): string => {
  return atob(encodedString.substr(0, 8));
};

const encodeAlgorithmVersion = (algorithmVersion: string): string => {
  return btoa(algorithmVersion);
}

export const encode = (stringToEncode: string): string => {
  const matches = stringToEncode.match(regExp);
  if (matches == null) {
    return stringToEncode;
  }
  const [fullMatch, head, keyword, tail] = matches;
  const encodeFunction = ALGORITHMS_BY_VERSION[DEFAULT_ALGORITHM_VERSION].encode;
  return `${head}${keyword}${encodeAlgorithmVersion(DEFAULT_ALGORITHM_VERSION)}${encodeFunction(tail)}`;
};

export const decode = (encodedData: string): string => {
  const matches = encodedData.match(regExp);
  if (matches == null) {
    return encodedData;
  }
  const [fullMatch, head, keyword, tail] = matches;
  const algorithmVersion = decodeAlgorithmVersion(tail.substr(0, 8));
  const decodeFunction = ALGORITHMS_BY_VERSION[algorithmVersion].decode;
  return `${head}${keyword}${decodeFunction(tail.substring(8))}`;
}

function getNextOffset(offset: number = 1): number {
  return ((offset + 2) % 10) + 1;
}

function shiftCharCodes(stringToShift: string, k: number): string {
  const shifted = [];
  let offset = getNextOffset();
  let originalCharCode;
  let shiftedCharCode;
  for (let i = 0; i < stringToShift.length; i++) {
    originalCharCode = stringToShift.charCodeAt(i);
    shiftedCharCode = originalCharCode + offset * k;
    shifted.push(String.fromCharCode(shiftedCharCode));
    offset = getNextOffset(offset);
  }
  return shifted.join('');
}