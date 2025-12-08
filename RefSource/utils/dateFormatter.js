/**
 * 선택한 포맷에 따라 날짜 형식 변환
 *
 * @매개변수 {string} dateStr - 날짜 문자열 (ISO 형식)
 * @매개변수 {string} format - 날짜 포맷 (YYYY-MM-DD, MM/DD/YYYY 등)
 * @반환값 {string} 포맷팅된 날짜 문자열
 */
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
