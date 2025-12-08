// Format date based on selected format
export const formatDate = (dateStr, format) => {
  if (!dateStr) return ''

  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  switch (format) {
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`
    case 'DD-MM-YYYY':
      return `${day}-${month}-${year}`
    case 'YYYY.MM.DD':
      return `${year}.${month}.${day}`
    case 'MM-DD':
      return `${month}-${day}`
    case 'YYYY-MM-DD':
    default:
      return `${year}-${month}-${day}`
  }
}
