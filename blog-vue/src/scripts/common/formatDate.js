/**
 * Formats a date string or Date object into a specified format.
 * @param {string|Date} date - The input date (string or Date object)
 * @param {string} [format='MMMM d, yyyy'] - The desired output format
 * @param {string} [locale='en-US'] - The locale to use for formatting
 * @returns {string} Formatted date string
 */
export function formatDate(date, format = 'MMMM d, yyyy', locale = 'en-US') {
  let dateObject

  if (typeof date === 'string') {
    // Try to parse the date string
    dateObject = new Date(date)
    if (isNaN(dateObject.getTime())) {
      throw new Error('Invalid date string provided')
    }
  } else if (date instanceof Date) {
    dateObject = date
  } else {
    throw new Error('Invalid date input. Please provide a valid date string or Date object.')
  }

  const formatters = {
    MMMM: { month: 'long' },
    MMM: { month: 'short' },
    MM: { month: '2-digit' },
    M: { month: 'numeric' },
    dd: { day: '2-digit' },
    d: { day: 'numeric' },
    yyyy: { year: 'numeric' },
    yy: { year: '2-digit' },
    EEEE: { weekday: 'long' },
    EEE: { weekday: 'short' },
    HH: { hour: '2-digit', hour12: false },
    hh: { hour: '2-digit', hour12: true },
    mm: { minute: '2-digit' },
    ss: { second: '2-digit' }
  }

  let result = format

  for (const [key, options] of Object.entries(formatters)) {
    if (result.includes(key)) {
      const formatter = new Intl.DateTimeFormat(locale, options)
      result = result.replace(key, formatter.format(dateObject))
    }
  }

  return result
}
