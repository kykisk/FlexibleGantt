/**
 * Gantt 필터 팝업 모달
 *
 * Structure 설정에 따라 동적으로 필터 생성
 * 실시간 체크박스 반영
 */
function FilterModal({ isOpen, onClose, structureRows, tasks, filters, setFilters }) {
  if (!isOpen) return null

  // 각 속성별 고유 값 추출
  const getUniqueValues = (attribute) => {
    const values = [...new Set(tasks.map(t => t[attribute]))].filter(v => v)
    return values.sort()
  }

  // 기본값 설정 (모든 항목 선택)
  const setDefaultFilters = () => {
    const defaultFilters = {}

    structureRows.forEach(row => {
      defaultFilters[row.id] = {}
      row.depths.forEach(depth => {
        defaultFilters[row.id][depth.attribute] = getUniqueValues(depth.attribute)
      })
    })

    setFilters(defaultFilters)
  }

  // 필터 토글
  const toggleFilter = (rowId, attribute, value) => {
    const currentFilters = filters[rowId]?.[attribute] || []
    const newFilters = currentFilters.includes(value)
      ? currentFilters.filter(v => v !== value)
      : [...currentFilters, value]

    setFilters({
      ...filters,
      [rowId]: {
        ...filters[rowId],
        [attribute]: newFilters
      }
    })
  }

  // 체크 여부 확인
  const isChecked = (rowId, attribute, value) => {
    const rowFilters = filters[rowId]

    // 필터가 설정되지 않았으면 모두 체크된 것으로 간주
    if (!rowFilters || !rowFilters[attribute]) {
      return true
    }

    return rowFilters[attribute].includes(value)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={onClose}
      />

      {/* Modal - positioned below button (left side) */}
      <div
        className="fixed bg-white rounded-lg shadow-2xl w-[600px] max-h-[70vh] overflow-hidden z-50"
        style={{
          top: '160px',  // Gantt Chart 제목 아래
          left: '24px'   // 왼쪽 여백 (버튼 아래)
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Gantt 필터</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(70vh - 140px)' }}>
          <div className="space-y-6">
            {structureRows.map((row) => (
              <div key={row.id} className="border border-gray-300 rounded-lg p-4">
                {/* Row 제목 */}
                <h4 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="inline-block w-3 h-3 bg-blue-600 rounded"></span>
                  {row.name}
                </h4>

                {/* 각 Depth별 필터 */}
                <div className="space-y-4">
                  {row.depths.map((depth) => {
                    const uniqueValues = getUniqueValues(depth.attribute)

                    return (
                      <div key={depth.attribute}>
                        {/* 속성 라벨 */}
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {depth.label}:
                        </label>

                        {/* 체크박스 그리드 */}
                        <div className="grid grid-cols-3 gap-2">
                          {uniqueValues.map((value) => (
                            <label
                              key={value}
                              className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={isChecked(row.id, depth.attribute, value)}
                                onChange={() => toggleFilter(row.id, depth.attribute, value)}
                                className="w-4 h-4"
                              />
                              <span className="text-sm">{value}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-300 bg-gray-50 flex justify-between">
          <div className="flex gap-2">
            <button
              onClick={setDefaultFilters}
              className="px-4 py-2 text-sm text-white bg-green-600 rounded hover:bg-green-700"
            >
              Set Default
            </button>
            <button
              onClick={() => setFilters({})}
              className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
            >
              전체 초기화
            </button>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            닫기
          </button>
        </div>
      </div>
    </>
  )
}

export default FilterModal
