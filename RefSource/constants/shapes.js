// Shape options
export const shapeOptions = [
  { value: 'gantt', label: 'Gantt Bar', icon: '▶' },
  { value: 'circle', label: 'Circle', icon: '●' },
  { value: 'rectangle', label: 'Rectangle', icon: '■' },
  { value: 'triangle', label: 'Triangle', icon: '▲' }
]

// Color options
export const colorOptions = [
  { value: '#000000', label: '검은색' },
  { value: '#808080', label: '회색' },
  { value: '#3B82F6', label: '파란색' },
  { value: '#EF4444', label: '빨간색' },
  { value: '#FACC15', label: '노란색' },
  { value: '#22C55E', label: '녹색' },
  { value: '#F97316', label: '주황색' },
  { value: '#A855F7', label: '보라색' }
]

// Date format options
export const dateFormatOptions = [
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { value: 'DD-MM-YYYY', label: 'DD-MM-YYYY' },
  { value: 'YYYY.MM.DD', label: 'YYYY.MM.DD' },
  { value: 'MM-DD', label: 'MM-DD' }
]

// PDF page sizes
export const pageSizes = {
  A3: { width: 297, height: 420 },
  A4: { width: 210, height: 297 },
  A5: { width: 148, height: 210 }
}
