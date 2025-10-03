export const toggleArray = (arr, val, pos = 'end') =>
  arr.includes(val)
    ? arr.filter(el => el !== val)
    : pos === 'end'
      ? [...arr, val]
      : [val, ...arr]
