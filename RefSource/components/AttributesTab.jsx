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
    { value: 'rectangle', label: 'Rectangle', icon: '■' }
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

  // 현재 도형의 속성 가져오기
  const getCurrentAttrs = () => {
    const { shape } = taskConfig
    if (shape === 'gantt') return taskConfig.ganttAttributes
    if (shape === 'circle') return taskConfig.circleAttributes
    if (shape === 'rectangle') return taskConfig.rectangleAttributes
    return []
  }

  // 현재 도형의 최대 개수
  const getMaxCount = () => {
    const { shape } = taskConfig
    if (shape === 'gantt') return 8
    if (shape === 'circle') return 4
    if (shape === 'rectangle') return 5
    return 4
  }

  const toggleAttribute = (attrValue) => {
    const { shape } = taskConfig
    const currentAttrKey = shape === 'gantt' ? 'ganttAttributes'
      : shape === 'circle' ? 'circleAttributes'
      : 'rectangleAttributes'

    const selectedAttrs = taskConfig[currentAttrKey]
    const maxCount = getMaxCount()

    const isSelected = selectedAttrs.includes(attrValue)

    if (isSelected) {
      setTaskConfig({
        ...taskConfig,
        [currentAttrKey]: selectedAttrs.filter(a => a !== attrValue)
      })
    } else {
      if (selectedAttrs.length >= maxCount) {
        alert(`최대 ${maxCount}개까지만 선택 가능합니다.`)
        return
      }
      setTaskConfig({
        ...taskConfig,
        [currentAttrKey]: [...selectedAttrs, attrValue]
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

    const previewArea = e.currentTarget.querySelector('.preview-area')
    const shapeElement = previewArea?.querySelector('.shape-element')
    if (!shapeElement || !previewArea) return

    const previewRect = previewArea.getBoundingClientRect()
    const shapeRect = shapeElement.getBoundingClientRect()

    // Mouse position with offset
    const mouseX = e.clientX - dragOffset.x
    const mouseY = e.clientY - dragOffset.y

    // Define placement area: shape + padding (e.g., 150% of shape size)
    const placementPadding = 0.5 // 50% padding on each side
    const placementWidth = shapeRect.width * (1 + placementPadding * 2)
    const placementHeight = shapeRect.height * (1 + placementPadding * 2)
    const placementLeft = shapeRect.left - shapeRect.width * placementPadding
    const placementTop = shapeRect.top - shapeRect.height * placementPadding

    // Clamp to placement area (not preview area)
    const clampedMouseX = Math.max(placementLeft, Math.min(placementLeft + placementWidth, mouseX))
    const clampedMouseY = Math.max(placementTop, Math.min(placementTop + placementHeight, mouseY))

    // Also ensure we don't go outside preview area
    const finalX = Math.max(previewRect.left + 10, Math.min(previewRect.right - 10, clampedMouseX))
    const finalY = Math.max(previewRect.top + 10, Math.min(previewRect.bottom - 10, clampedMouseY))

    // Convert to shape-relative position (can be negative or > 100%)
    const relativeToShapeX = finalX - shapeRect.left
    const relativeToShapeY = finalY - shapeRect.top

    const x = (relativeToShapeX / shapeRect.width) * 100
    const y = (relativeToShapeY / shapeRect.height) * 100

    setTempPosition({ x, y })
  }

  const handleMouseUp = () => {
    if (isDragging && draggedLabel && tempPosition) {
      // Save final position (only for gantt)
      if (taskConfig.shape === 'gantt') {
        setTaskConfig({
          ...taskConfig,
          ganttLabelPositions: {
            ...taskConfig.ganttLabelPositions,
            [draggedLabel]: tempPosition
          }
        })
      }
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
              Attributes ({getCurrentAttrs().length}/{getMaxCount()})
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              {availableAttributes.map((attr) => {
                const currentAttrs = getCurrentAttrs()
                const attrIndex = currentAttrs.indexOf(attr.value)

                return (
                  <label key={attr.value} className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentAttrs.includes(attr.value)}
                      onChange={() => toggleAttribute(attr.value)}
                      className="w-3 h-3"
                    />
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 text-white text-xs">
                      {attrIndex >= 0 ? attrIndex + 1 : ''}
                    </span>
                    <span className="text-gray-700">{attr.label}</span>
                  </label>
                )
              })}
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
            style={{ height: '350px', overflow: 'visible' }}
            onMouseMove={handlePreviewMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Task Shape Preview - wider area to show attributes on right */}
            <div className="preview-area absolute inset-2 border border-dashed border-gray-400 rounded" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Shape with labels inside - use relative positioning */}
              {/* Wrapper for shape + labels */}
              <div className="relative" style={{ display: 'inline-flex', alignItems: 'flex-start' }}>
                {/* Shape */}
                <div
                  className="shape-element relative border-2 cursor-pointer"
                  style={{
                    width: taskConfig.shape === 'gantt' ? '240px' : taskConfig.shape === 'rectangle' ? '200px' : '100px',
                    height: taskConfig.shape === 'gantt' ? '120px' : '100px',
                    backgroundColor: taskConfig.color,
                    opacity: 0.8,
                    clipPath: taskConfig.shape === 'gantt'
                      ? 'polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)'
                      : taskConfig.shape === 'circle'
                      ? 'circle(50% at 50% 50%)'
                      : 'none'
                  }}
                >
                  {/* Gantt Bar: draggable labels inside */}
                  {taskConfig.shape === 'gantt' && taskConfig.ganttAttributes.map((attrValue, idx) => {
                  const attr = availableAttributes.find(a => a.value === attrValue)
                  const savedPosition = taskConfig.ganttLabelPositions[attrValue] || { x: 50, y: 30 + idx * 20 }

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

                  {/* Circle - 1번 중앙, 2-4번 오른쪽 */}
                  {taskConfig.shape === 'circle' && taskConfig.circleAttributes[0] && (
                    <div
                      className="absolute pointer-events-none"
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: '10px',
                        zIndex: 10
                      }}
                    >
                      <div className="bg-white border border-gray-400 px-1 py-0.5 rounded text-xs shadow-sm" style={{ maxWidth: '50px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <span className="inline-flex items-center justify-center w-3 h-3 rounded-full bg-blue-500 text-white mr-1" style={{ fontSize: '8px' }}>
                          1
                        </span>
                        <span style={{ fontSize: '9px' }}>{availableAttributes.find(a => a.value === taskConfig.circleAttributes[0])?.label}</span>
                      </div>
                    </div>
                  )}

                  {/* Rectangle - 5개 고정 위치 */}
                  {taskConfig.shape === 'rectangle' && taskConfig.rectangleAttributes.map((attrValue, idx) => {
                    const attr = availableAttributes.find(a => a.value === attrValue)
                    // 고정 위치: 1중앙, 2좌상, 3우상, 4좌하, 5우하
                    const positions = [
                      { x: 50, y: 50 },  // 1
                      { x: 20, y: 20 },  // 2
                      { x: 80, y: 20 },  // 3
                      { x: 20, y: 80 },  // 4
                      { x: 80, y: 80 }   // 5
                    ]
                    const pos = positions[idx]

                    return (
                      <div
                        key={attrValue}
                        className="absolute pointer-events-none"
                        style={{
                          left: `${pos.x}%`,
                          top: `${pos.y}%`,
                          transform: 'translate(-50%, -50%)',
                          fontSize: '10px',
                          zIndex: 10
                        }}
                      >
                        <div className="bg-white border border-gray-400 px-1 py-0.5 rounded text-xs shadow-sm" style={{ maxWidth: '60px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          <span className="inline-flex items-center justify-center w-3 h-3 rounded-full bg-blue-500 text-white mr-1" style={{ fontSize: '8px' }}>
                            {idx + 1}
                          </span>
                          <span style={{ fontSize: '9px' }}>{attr?.label}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Circle - 2-4번 오른쪽 */}
                {taskConfig.shape === 'circle' && taskConfig.circleAttributes.length > 1 && (
                  <div className="ml-3 flex flex-col gap-2">
                    {taskConfig.circleAttributes.slice(1, 4).map((attrValue, idx) => {
                      const attr = availableAttributes.find(a => a.value === attrValue)

                      return (
                        <div key={attrValue}>
                          <div className="bg-white border border-gray-400 px-1 py-0.5 rounded text-xs shadow-sm whitespace-nowrap">
                            <span className="inline-flex items-center justify-center w-3 h-3 rounded-full bg-blue-500 text-white mr-1" style={{ fontSize: '8px' }}>
                              {idx + 2}
                            </span>
                            {attr?.label}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
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
