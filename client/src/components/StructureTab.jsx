import { useState } from 'react'

function StructureTab({ structureRows, setStructureRows }) {
  const availableAttributes = [
    { value: 'productType', label: '제품 Type' },
    { value: 'density', label: 'Density' },
    { value: 'process', label: '공정명' },
    { value: 'isMainProcess', label: '모공정 여부' },
    { value: 'isNPI', label: 'NPI 여부' },
    { value: 'organization', label: 'Organization' },
    { value: 'stackMethod', label: 'Stack 방식' },
    { value: 'numberOfStack', label: 'Number of Stack' },
    { value: 'numberOfDie', label: 'Number of Die' }
  ]

  const [editingRowId, setEditingRowId] = useState(null)
  const [editingName, setEditingName] = useState('')
  const [addingDepthRowId, setAddingDepthRowId] = useState(null)

  const handleAddRow = () => {
    const newRow = {
      id: `row-${Date.now()}`,
      name: `그룹 ${structureRows.length + 1}`,
      depths: [
        { attribute: 'productType', label: '제품 Type' }
      ]
    }
    setStructureRows([...structureRows, newRow])
  }

  const handleDeleteRow = (rowId) => {
    if (structureRows.length <= 1) {
      alert('최소 1개의 Row는 필요합니다.')
      return
    }
    setStructureRows(structureRows.filter(r => r.id !== rowId))
  }

  const handleStartEditName = (row) => {
    setEditingRowId(row.id)
    setEditingName(row.name)
  }

  const handleSaveRowName = (rowId) => {
    setStructureRows(structureRows.map(r =>
      r.id === rowId ? { ...r, name: editingName } : r
    ))
    setEditingRowId(null)
    setEditingName('')
  }

  const handleStartAddDepth = (rowId) => {
    const row = structureRows.find(r => r.id === rowId)
    if (row && row.depths.length >= 8) {
      alert('최대 8개까지만 추가 가능합니다.')
      return
    }
    setAddingDepthRowId(rowId)
  }

  const handleConfirmAddDepth = (rowId, selectedAttribute) => {
    const selectedAttr = availableAttributes.find(a => a.value === selectedAttribute)
    setStructureRows(structureRows.map(r => {
      if (r.id === rowId) {
        const newDepth = { attribute: selectedAttribute, label: selectedAttr.label }
        return { ...r, depths: [...r.depths, newDepth] }
      }
      return r
    }))
    setAddingDepthRowId(null)
  }

  const handleCancelAddDepth = () => {
    setAddingDepthRowId(null)
  }

  const handleRemoveDepth = (rowId, depthIndex) => {
    setStructureRows(structureRows.map(r => {
      if (r.id === rowId) {
        if (r.depths.length <= 1) {
          alert('최소 1개의 Depth는 필요합니다.')
          return r
        }
        return { ...r, depths: r.depths.filter((_, idx) => idx !== depthIndex) }
      }
      return r
    }))
  }

  const handleChangeDepthAttribute = (rowId, depthIndex, newAttribute) => {
    const selectedAttr = availableAttributes.find(a => a.value === newAttribute)
    setStructureRows(structureRows.map(r => {
      if (r.id === rowId) {
        const newDepths = [...r.depths]
        newDepths[depthIndex] = {
          attribute: newAttribute,
          label: selectedAttr ? selectedAttr.label : newAttribute
        }
        return { ...r, depths: newDepths }
      }
      return r
    }))
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-800">Depth Groups (Rows)</h3>
        <button
          onClick={handleAddRow}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add Row
        </button>
      </div>

      <div className="space-y-4">
        {structureRows.map((row, rowIndex) => (
          <div key={row.id} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
            {/* Row Header */}
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">Row {rowIndex + 1}:</span>
                {editingRowId === row.id ? (
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={() => handleSaveRowName(row.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveRowName(row.id)
                      if (e.key === 'Escape') {
                        setEditingRowId(null)
                        setEditingName('')
                      }
                    }}
                    className="px-2 py-1 border border-blue-500 rounded text-sm"
                    autoFocus
                  />
                ) : (
                  <span
                    onClick={() => handleStartEditName(row)}
                    className="font-semibold text-gray-800 cursor-pointer hover:text-blue-600"
                  >
                    {row.name}
                  </span>
                )}
              </div>
              <button
                onClick={() => handleDeleteRow(row.id)}
                className="px-2 py-1 text-xs text-red-600 border border-red-600 rounded hover:bg-red-50"
                disabled={structureRows.length === 1}
              >
                Delete
              </button>
            </div>

            {/* Depths - Horizontal layout */}
            <div className="flex flex-wrap items-center gap-2">
              {row.depths.map((depth, depthIdx) => {
                const usedAttributes = row.depths
                  .filter((_, idx) => idx !== depthIdx)
                  .map(d => d.attribute)

                const availableForThisDepth = availableAttributes.filter(
                  attr => !usedAttributes.includes(attr.value)
                )

                return (
                  <div key={depthIdx} className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-white border border-gray-300 rounded px-2 py-1">
                      <span className="text-xs text-gray-500">D{depthIdx + 1}:</span>
                      <select
                        value={depth.attribute}
                        onChange={(e) => handleChangeDepthAttribute(row.id, depthIdx, e.target.value)}
                        className="text-sm border-none focus:outline-none bg-transparent"
                      >
                        {availableForThisDepth.map(attr => (
                          <option key={attr.value} value={attr.value}>
                            {attr.label}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleRemoveDepth(row.id, depthIdx)}
                        className="text-gray-500 hover:text-red-600"
                        disabled={row.depths.length === 1}
                        title="Remove depth"
                      >
                        ×
                      </button>
                    </div>

                    {depthIdx < row.depths.length - 1 && (
                      <span className="text-gray-400">→</span>
                    )}
                  </div>
                )
              })}

              {/* Add Depth button or dropdown */}
              {row.depths.length < 8 && (
                <>
                  {addingDepthRowId === row.id ? (
                    <div className="flex items-center gap-1 bg-white border border-blue-500 rounded px-2 py-1">
                      <span className="text-xs text-gray-500">D{row.depths.length + 1}:</span>
                      <select
                        autoFocus
                        onChange={(e) => {
                          if (e.target.value) {
                            handleConfirmAddDepth(row.id, e.target.value)
                          }
                        }}
                        onBlur={handleCancelAddDepth}
                        className="text-sm border-none focus:outline-none bg-transparent"
                      >
                        <option value="">선택...</option>
                        {availableAttributes
                          .filter(attr => !row.depths.map(d => d.attribute).includes(attr.value))
                          .map(attr => (
                            <option key={attr.value} value={attr.value}>
                              {attr.label}
                            </option>
                          ))}
                      </select>
                      <button
                        onClick={handleCancelAddDepth}
                        className="text-gray-500 hover:text-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartAddDepth(row.id)}
                      className="px-3 py-1 text-xs text-blue-600 border border-dashed border-blue-600 rounded hover:bg-blue-50"
                    >
                      + Add
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Depth count info */}
            <div className="mt-3 pt-3 border-t border-gray-300">
              <p className="text-xs text-gray-500">
                Depths: {row.depths.length} / 8 | Columns: {row.depths.map(d => d.label).join(' → ')}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
        <p className="text-xs text-blue-800">
          💡 <strong>Tip:</strong> 각 Row는 독립적인 Gantt 그룹입니다. Depth는 가로 컬럼으로 표시됩니다.
        </p>
      </div>
    </div>
  )
}

export default StructureTab
