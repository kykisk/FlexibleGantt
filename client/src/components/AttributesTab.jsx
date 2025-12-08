import { useState } from 'react'

function AttributesTab({ taskConfig, setTaskConfig }) {
  const availableAttributes = [
    { value: 'productType', label: '제품 Type' },
    { value: 'density', label: 'Density' },
    { value: 'process', label: '공정명' },
    { value: 'isMainProcess', label: '모공정 여부' },
    { value: 'isNPI', label: 'NPI 여부' },
    { value: 'organization', label: 'Organization' },
    { value: 'stackMethod', label: 'Stack 방식' },
    { value: 'numberOfStack', label: 'Number of Stack' },
    { value: 'numberOfDie', label: 'Number of Die' },
    { value: 'packageSize', label: 'Package Size' },
    { value: 'packageHeight', label: 'Package Height' },
    { value: 'vdd1', label: 'VDD1' },
    { value: 'vdd2', label: 'VDD2' },
    { value: 'vddq', label: 'VDDQ' },
    { value: 'speed', label: 'Speed' }
  ]

  const shapeOptions = [
    { value: 'gantt', label: 'Gantt Bar', icon: '▶' },
    { value: 'circle', label: 'Circle', icon: '●' },
    { value: 'rectangle', label: 'Rectangle', icon: '■' },
    { value: 'triangle', label: 'Triangle', icon: '▲' }
  ]

  const colorOptions = [
    { value: '#000000', label: '검은색' },
    { value: '#808080', label: '회색' },
    { value: '#3B82F6', label: '파란색' },
    { value: '#EF4444', label: '빨간색' },
    { value: '#FACC15', label: '노란색' },
    { value: '#22C55E', label: '녹색' },
    { value: '#F97316', label: '주황색' },
    { value: '#A855F7', label: '보라색' }
  ]

  const [draggedLabel, setDraggedLabel] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [tempPosition, setTempPosition] = useState(null) // Temporary position while dragging

  const toggleAttribute = (attrValue) => {
    const isSelected = taskConfig.selectedAttributes.includes(attrValue)

    if (isSelected) {
      setTaskConfig({
        ...taskConfig,
        selectedAttributes: taskConfig.selectedAttributes.filter(a => a !== attrValue)
      })
    } else {
      if (taskConfig.selectedAttributes.length >= 8) {
        alert('최대 8개까지만 선택 가능합니다.')
        return
      }
      setTaskConfig({
        ...taskConfig,
        selectedAttributes: [...taskConfig.selectedAttributes, attrValue]
      })
    }
  }

  const handleLabelMouseDown = (e, attrValue) => {
    e.preventDefault()

    // Calculate offset from center of label to mouse position
    const labelElement = e.currentTarget
    const labelRect = labelElement.getBoundingClientRect()
    const labelCenterX = labelRect.left + labelRect.width / 2
    const labelCenterY = labelRect.top + labelRect.height / 2

    const offsetX = e.clientX - labelCenterX
    const offsetY = e.clientY - labelCenterY

    setDraggedLabel(attrValue)
    setIsDragging(true)
    setDragOffset({ x: offsetX, y: offsetY })
  }

  const handlePreviewMouseMove = (e) => {
    if (!isDragging || !draggedLabel) return

    const shapeElement = e.currentTarget.querySelector('.shape-element')
    if (!shapeElement) return

    const shapeRect = shapeElement.getBoundingClientRect()

    // Mouse position with offset
    const mouseX = e.clientX - dragOffset.x
    const mouseY = e.clientY - dragOffset.y

    // Convert absolute mouse position to position relative to shape
    const relativeToShapeX = mouseX - shapeRect.left
    const relativeToShapeY = mouseY - shapeRect.top

    const x = (relativeToShapeX / shapeRect.width) * 100
    const y = (relativeToShapeY / shapeRect.height) * 100

    // Clamp to keep within shape bounds (0-100%)
    const clampedX = Math.max(5, Math.min(95, x))
    const clampedY = Math.max(10, Math.min(90, y))

    setTempPosition({ x: clampedX, y: clampedY })
  }

  const handleMouseUp = () => {
    if (isDragging && draggedLabel && tempPosition) {
      // Save final position
      setTaskConfig({
        ...taskConfig,
        labelPositions: {
          ...taskConfig.labelPositions,
          [draggedLabel]: tempPosition
        }
      })
    }

    setIsDragging(false)
    setDraggedLabel(null)
    setTempPosition(null)
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Left: Settings */}
        <div>
          {/* Attribute Selection - Compact grid */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">
              Attributes ({taskConfig.selectedAttributes.length}/8)
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              {availableAttributes.map((attr) => (
                <label key={attr.value} className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={taskConfig.selectedAttributes.includes(attr.value)}
                    onChange={() => toggleAttribute(attr.value)}
                    className="w-3 h-3"
                  />
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 text-white text-xs">
                    {taskConfig.selectedAttributes.indexOf(attr.value) >= 0
                      ? taskConfig.selectedAttributes.indexOf(attr.value) + 1
                      : ''}
                  </span>
                  <span className="text-gray-700">{attr.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Shape & Color - Compact LOV */}
          <div className="grid grid-cols-2 gap-4">
            {/* Shape LOV */}
            <div>
              <label className="block text-xs font-semibold text-gray-800 mb-1">
                Shape
              </label>
              <select
                value={taskConfig.shape}
                onChange={(e) => setTaskConfig({ ...taskConfig, shape: e.target.value })}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
              >
                {shapeOptions.map(shape => (
                  <option key={shape.value} value={shape.value}>
                    {shape.icon} {shape.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Color LOV */}
            <div>
              <label className="block text-xs font-semibold text-gray-800 mb-1">
                Color
              </label>
              <select
                value={taskConfig.color}
                onChange={(e) => setTaskConfig({ ...taskConfig, color: e.target.value })}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                style={{ backgroundColor: taskConfig.color, color: '#fff' }}
              >
                {colorOptions.map(color => (
                  <option key={color.value} value={color.value} style={{ backgroundColor: color.value, color: '#fff' }}>
                    {color.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Right: Preview - Compact */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-2">
            Preview
          </h3>

          <div
            className="relative border-2 border-gray-300 rounded-lg p-4 bg-gray-50 select-none"
            style={{ height: '280px', overflow: 'visible' }}
            onMouseMove={handlePreviewMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Task Shape Preview */}
            <div className="preview-area absolute inset-4 border border-dashed border-gray-400 rounded flex items-center justify-center">
              {/* Shape with labels inside - use relative positioning */}
              <div
                className="shape-element relative border-2 cursor-pointer"
                style={{
                  width: taskConfig.shape === 'gantt' ? '240px' : '50px',
                  height: '50px',
                  backgroundColor: taskConfig.color,
                  opacity: 0.8,
                  clipPath: taskConfig.shape === 'gantt'
                    ? 'polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)'
                    : taskConfig.shape === 'circle'
                    ? 'circle(50% at 50% 50%)'
                    : taskConfig.shape === 'triangle'
                    ? 'polygon(50% 0%, 0% 100%, 100% 100%)'
                    : 'none',
                  overflow: 'visible'
                }}
              >
                {/* Attribute Labels - inside shape as children */}
                {taskConfig.selectedAttributes.map((attrValue, idx) => {
                  const attr = availableAttributes.find(a => a.value === attrValue)
                  const savedPosition = taskConfig.labelPositions[attrValue] || { x: 50, y: 30 + idx * 20 }

                  // Use temporary position while dragging for instant feedback
                  const position = (isDragging && draggedLabel === attrValue && tempPosition)
                    ? tempPosition
                    : savedPosition

                  return (
                    <div
                      key={attrValue}
                      onMouseDown={(e) => handleLabelMouseDown(e, attrValue)}
                      className={`absolute cursor-move bg-white border border-gray-400 px-1 py-0.5 rounded text-xs shadow-sm ${
                        isDragging && draggedLabel === attrValue ? 'opacity-70 scale-110' : ''
                      }`}
                      style={{
                        left: `${position.x}%`,
                        top: `${position.y}%`,
                        transform: 'translate(-50%, -50%)',
                        fontSize: '10px',
                        zIndex: isDragging && draggedLabel === attrValue ? 50 : 10,
                        transition: isDragging && draggedLabel === attrValue ? 'none' : 'all 0.2s'
                      }}
                    >
                      <span className="inline-flex items-center justify-center w-3 h-3 rounded-full bg-blue-500 text-white mr-1" style={{ fontSize: '8px' }}>
                        {idx + 1}
                      </span>
                      {attr?.label}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Instructions */}
            <div className="absolute bottom-2 left-2 right-2 text-xs text-gray-500 text-center">
              Drag labels to move
            </div>
          </div>

          {/* Info */}
          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
            Shape: <strong>{shapeOptions.find(s => s.value === taskConfig.shape)?.label}</strong> |
            Color: <strong>{colorOptions.find(c => c.value === taskConfig.color)?.label}</strong>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AttributesTab
