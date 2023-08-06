const capitalize = (value: string): string => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const isAlphaNumeric = (value: string): boolean => {
  return /^[a-z0-9]+$/i.test(value);
};

export const Utils = {
  capitalize,
  isAlphaNumeric,
};
