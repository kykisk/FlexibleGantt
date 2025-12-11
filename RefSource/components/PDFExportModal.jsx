import { useState } from 'react'

function PDFExportModal({ isOpen, onClose, onExport }) {
  const [orientation, setOrientation] = useState('landscape') // landscape or portrait
  const [pageSize, setPageSize] = useState('A4') // A3, A4, A5
  const [fitToPage, setFitToPage] = useState(true)

  const handleExport = () => {
    onExport({ orientation, pageSize, fitToPage })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-6 w-96" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">PDF Export 설정</h3>

        {/* Orientation */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">방향</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="landscape"
                checked={orientation === 'landscape'}
                onChange={(e) => setOrientation(e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-sm">가로</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="portrait"
                checked={orientation === 'portrait'}
                onChange={(e) => setOrientation(e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-sm">세로</span>
            </label>
          </div>
        </div>

        {/* Page Size */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">용지 크기</label>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          >
            <option value="A3">A3</option>
            <option value="A4">A4</option>
            <option value="A5">A5</option>
          </select>
        </div>

        {/* Fit to Page */}
        <div className="mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={fitToPage}
              onChange={(e) => setFitToPage(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">화면에 맞춤</span>
          </label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
          >
            취소
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
          >
            PDF 생성
          </button>
        </div>
      </div>
    </div>
  )
}

export default PDFExportModal
