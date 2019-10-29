// @flow
const regExp = /(.*)(\s@encode\s)((.|\n)*)/;

export const encode = (stringToEncode: string): string => {
  const matches = stringToEncode.match(regExp);
  if (matches == null) {
    return stringToEncode;
  }
  const [fullMatch, head, keyword, tail] = matches;
  return `${head}${keyword}${btoa(tail)}`;
};

export const decode = (encodedData: string): string => {
  const matches = encodedData.match(regExp);
  if (matches == null) {
    return encodedData;
  }
  const [fullMatch, head, keyword, tail] = matches;
  return `${head}${keyword}${atob(tail)}`;
}