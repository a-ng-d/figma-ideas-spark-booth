const setFriendlyDate = (date: Date | string, format: string) => {
  const dateObj = new Date(date)
  const shortDate: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
  }
  const shortTime: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
  }

  return `${dateObj.toLocaleDateString(format, shortDate)} at ${dateObj.toLocaleTimeString(format, shortTime)}`
}

export default setFriendlyDate
