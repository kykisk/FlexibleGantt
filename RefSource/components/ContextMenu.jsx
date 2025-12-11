import { useState } from 'react'
import { colorOptions } from '../constants/shapes'

function ContextMenu({ contextMenu, onClose, onSelectShape, onSelectRowShapes, onAddMemo, onSelectColor }) {
  const [showShapeSubmenu, setShowShapeSubmenu] = useState(false)
  const [showColorSubmenu, setShowColorSubmenu] = useState(false)

  if (!contextMenu) return null

  const shapes = [
    { value: 'gantt', label: '▶ Gantt Bar' },
    { value: 'circle', label: '● Circle' },
    { value: 'rectangle', label: '■ Rectangle' }
  ]

  const isRowMenu = contextMenu.type === 'row'
  const isGanttArea = contextMenu.type === 'gantt-area'
  const isTaskMenu = contextMenu.type === 'task'
  const title = isRowMenu ? 'Row 전체 도형 변경' : '도형 변경'

  return (
    <div
      className="fixed bg-white border border-gray-400 rounded shadow-lg z-50"
      style={{ left: contextMenu.x, top: contextMenu.y }}
      onClick={(e) => e.stopPropagation()}
    >
      {isRowMenu && (
        <div className="px-4 py-2 border-b border-gray-300 bg-gray-50 text-xs font-semibold text-gray-700">
          {title}
        </div>
      )}

      {/* 도형 변경 메뉴 (Row 또는 Task) - 이중 메뉴 */}
      {!isGanttArea && (
        <div
          className="relative"
          onMouseEnter={() => setShowShapeSubmenu(true)}
          onMouseLeave={() => setShowShapeSubmenu(false)}
        >
          <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex justify-between items-center">
            <span>{isRowMenu ? 'Row 전체 도형 변경' : '도형 변경'}</span>
            <span>›</span>
          </button>

          {/* 도형 서브메뉴 */}
          {showShapeSubmenu && (
            <div
              className="absolute left-full top-0 bg-white border border-gray-400 rounded shadow-lg py-1 ml-1"
              style={{ minWidth: '150px' }}
            >
              {shapes.map(shape => (
                <button
                  key={shape.value}
                  onClick={() => {
                    if (isRowMenu) {
                      const taskIds = contextMenu.rowTasks.map(t => t.id)
                      onSelectRowShapes(taskIds, shape.value)
                    } else {
                      onSelectShape(contextMenu.taskId, shape.value)
                    }
                    onClose()
                  }}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  {shape.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 색상 선택 (Task 메뉴에만 표시) - 이중 메뉴 */}
      {isTaskMenu && (
        <div
          className="relative"
          onMouseEnter={() => setShowColorSubmenu(true)}
          onMouseLeave={() => setShowColorSubmenu(false)}
        >
          <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex justify-between items-center">
            <span>색상 선택</span>
            <span>›</span>
          </button>

          {/* 색상 서브메뉴 */}
          {showColorSubmenu && (
            <div
              className="absolute left-full top-0 bg-white border border-gray-400 rounded shadow-lg py-1 ml-1"
              style={{ minWidth: '120px' }}
            >
              {colorOptions.map(color => (
                <button
                  key={color.value}
                  onClick={() => {
                    onSelectColor(contextMenu.taskId, color.value)
                    onClose()
                  }}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                >
                  <div
                    className="w-4 h-4 rounded border"
                    style={{ backgroundColor: color.value }}
                  />
                  {color.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 메모 추가 (모든 메뉴에 표시) */}
      <div className="py-1 border-t border-gray-300">
        <button
          onClick={() => {
            onAddMemo(contextMenu.relativeX || 100, contextMenu.relativeY || 100)
            onClose()
          }}
          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
        >
          📝 메모 추가
        </button>
      </div>
    </div>
  )
}

export default ContextMenu
