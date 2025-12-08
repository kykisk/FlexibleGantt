function ContextMenu({ contextMenu, onClose, onSelectShape, onSelectRowShapes }) {
  if (!contextMenu) return null

  const shapes = [
    { value: 'gantt', label: '▶ Gantt Bar' },
    { value: 'circle', label: '● Circle' },
    { value: 'rectangle', label: '■ Rectangle' },
    { value: 'triangle', label: '▲ Triangle' }
  ]

  const isRowMenu = contextMenu.type === 'row'
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
      <div className="py-1">
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
    </div>
  )
}

export default ContextMenu
