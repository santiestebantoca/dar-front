export const prettyAge = (n) => {
  if (n === 0) return 'hoy';
  else if (n === 1) return 'ayer'
  else if (n < 7) return `${n} días`
  else if (n < 14) return `1 sem`
  else if (n < 21) return `2 sem`
  else if (n < 28) return `3 sem`
  else if (n < 32) return `4 sem`
  else if (n >= 32) return `+1 mes`
  return null
}

export const delUndefined = (obj) =>
  (typeof result === 'object') && !Array.isArray(obj) && (obj !== null)
    ? Object.fromEntries(Object.entries(obj).filter(([k, v]) => v !== undefined))
    : obj

export const delNull = (obj) =>
  (typeof result === 'object') && !Array.isArray(obj) && (obj !== null)
    ? Object.fromEntries(Object.entries(obj).filter(([k, v]) => v !== null))
    : obj

export const delEmpty = (obj) =>
  (typeof result === 'object') && !Array.isArray(obj) && (obj !== null)
    ? Object.fromEntries(Object.entries(obj).filter(([k, v]) => v !== ''))
    : obj