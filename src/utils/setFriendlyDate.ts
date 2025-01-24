import moment from 'moment'

const setFriendlyDate = (
  date: Date | string,
  lang = 'en-US',
  type: 'SHORT' | 'LONG' | 'RELATIVE' = 'SHORT'
) => {
  if (type === 'SHORT') return moment(date).locale(lang).format('lll')
  if (type === 'RELATIVE') return moment(date).locale(lang).calendar()
  return moment(date).locale(lang).format('LLLL')
}

export default setFriendlyDate
