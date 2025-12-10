/**
 * 포스트잇 스타일 메모 컴포넌트
 *
 * 기능:
 * - 드래그로 이동
 * - 우하단 핸들로 크기 조정
 * - 더블클릭으로 편집
 * - X 버튼으로 삭제
 */
import { useState } from 'react'

function Memo({ memo, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(memo.content)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  // 메모 이동 시작
  const handleMouseDown = (e) => {
    if (e.target.classList.contains('resize-handle')) return
    if (isEditing) return

    setIsDragging(true)
    setDragStart({
      x: e.clientX - parseFloat(memo.x),
      y: e.clientY - parseFloat(memo.y)
    })
  }

  // 크기 조정 시작
  const handleResizeStart = (e) => {
    e.stopPropagation()
    setIsResizing(true)
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      width: parseFloat(memo.width),
      height: parseFloat(memo.height)
    })
  }

  // 마우스 이동 (이동 또는 크기 조정)
  const handleMouseMove = (e) => {
    if (isDragging) {
      onUpdate(memo.id, {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    } else if (isResizing) {
      const deltaX = e.clientX - dragStart.x
      const deltaY = e.clientY - dragStart.y

      onUpdate(memo.id, {
        width: Math.max(80, dragStart.width + deltaX),
        height: Math.max(60, dragStart.height + deltaY)
      })
    }
  }

  // 마우스 업 (드래그/리사이즈 종료)
  const handleMouseUp = () => {
    setIsDragging(false)
    setIsResizing(false)
  }

  // 편집 모드 전환
  const handleDoubleClick = () => {
    setIsEditing(true)
  }

  // 편집 저장
  const handleSave = () => {
    onUpdate(memo.id, { content: editContent })
    setIsEditing(false)
  }

  // 편집 취소
  const handleCancel = () => {
    setEditContent(memo.content)
    setIsEditing(false)
  }

  return (
    <div
      className={`absolute bg-yellow-100 border-2 border-yellow-400 rounded shadow-lg ${
        isDragging || isResizing ? 'cursor-move' : 'cursor-pointer'
      }`}
      style={{
        left: `${memo.x}px`,
        top: `${memo.y}px`,
        width: `${memo.width}px`,
        height: `${memo.height}px`,
        zIndex: 40
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDoubleClick={handleDoubleClick}
    >
      {/* 삭제 버튼 (우상단) */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          if (window.confirm('이 메모를 삭제하시겠습니까?')) {
            onDelete(memo.id)
          }
        }}
        className="absolute top-1 right-1 text-yellow-900 hover:text-red-600 text-sm font-bold z-10"
      >
        ×
      </button>

      {/* 내용 */}
      <div className="p-2 h-full overflow-auto">
        {isEditing ? (
          <div className="h-full flex flex-col">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="flex-1 w-full p-1 text-xs border border-yellow-400 rounded resize-none"
              autoFocus
            />
            <div className="flex gap-1 mt-1">
              <button
                onClick={handleSave}
                className="flex-1 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                저장
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 px-2 py-1 text-xs bg-gray-300 rounded hover:bg-gray-400"
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          <div className="text-xs text-gray-800 whitespace-pre-wrap">
            {memo.content || '더블클릭하여 편집'}
          </div>
        )}
      </div>

      {/* 크기 조정 핸들 (우하단) */}
      {!isEditing && (
        <div
          className="resize-handle absolute right-0 bottom-0 w-4 h-4 cursor-nwse-resize"
          onMouseDown={handleResizeStart}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" className="text-yellow-600">
            <path d="M16 16 L16 12 L12 16 Z" fill="currentColor" />
          </svg>
        </div>
      )}
    </div>
  )
}

export default Memo
