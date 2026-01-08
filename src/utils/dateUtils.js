/**
 * Date utility functions
 */

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const getMonthName = (monthIndex) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  return months[monthIndex]
}

export const getMonthYear = (date) => {
  const d = new Date(date)
  return `${getMonthName(d.getMonth())} ${d.getFullYear()}`
}

export const getStartOfMonth = (date = new Date()) => {
  const d = new Date(date)
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

export const getEndOfMonth = (date = new Date()) => {
  const d = new Date(date)
  return new Date(d.getFullYear(), d.getMonth() + 1, 0)
}

export const getStartOfYear = (date = new Date()) => {
  const d = new Date(date)
  return new Date(d.getFullYear(), 0, 1)
}

export const getEndOfYear = (date = new Date()) => {
  const d = new Date(date)
  return new Date(d.getFullYear(), 11, 31)
}

export const isToday = (date) => {
  const today = new Date()
  const d = new Date(date)
  return d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
}

export const isThisMonth = (date) => {
  const today = new Date()
  const d = new Date(date)
  return d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
}

export const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate()
}

export const getDateRangeLabel = (startDate, endDate) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  if (start.toDateString() === end.toDateString()) {
    return formatDate(start)
  }
  
  return `${formatDate(start)} - ${formatDate(end)}`
}
