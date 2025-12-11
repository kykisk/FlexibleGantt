import { useState } from 'react'

function TaskBar({ task, position, onUpdate, laneHeight, topPosition }) {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeMode, setResizeMode] = useState(null) // 'left' or 'right'

  const handleMouseDown = (e, mode) => {
    e.stopPropagation()
    if (mode === 'move') {
      setIsDragging(true)
    } else {
      setIsResizing(true)
      setResizeMode(mode)
    }
  }

  const handleMouseMove = (e) => {
    if (!isDragging && !isResizing) return

    const ganttContainer = e.currentTarget.closest('td')
    if (!ganttContainer) return

    const rect = ganttContainer.getBoundingClientRect()
    const relativeX = e.clientX - rect.left
    const percentX = (relativeX / rect.width) * 100

    // Calculate new dates based on position
    const timelineStart = new Date(task.timelineStart)
    const timelineEnd = new Date(task.timelineEnd)
    const totalDays = (timelineEnd - timelineStart) / (1000 * 60 * 60 * 24)
    const newDays = (percentX / 100) * totalDays

    if (isDragging) {
      // Move task - preserve duration
      const taskDuration = (new Date(task.endDate) - new Date(task.startDate)) / (1000 * 60 * 60 * 24)
      const newStart = new Date(timelineStart.getTime() + newDays * 24 * 60 * 60 * 1000)
      const newEnd = new Date(newStart.getTime() + taskDuration * 24 * 60 * 60 * 1000)

      onUpdate({
        ...task,
        startDate: newStart.toISOString().split('T')[0],
        endDate: newEnd.toISOString().split('T')[0]
      })
    } else if (isResizing) {
      if (resizeMode === 'left') {
        // Resize from left - change start date
        const newStart = new Date(timelineStart.getTime() + newDays * 24 * 60 * 60 * 1000)
        if (newStart < new Date(task.endDate)) {
          onUpdate({
            ...task,
            startDate: newStart.toISOString().split('T')[0]
          })
        }
      } else if (resizeMode === 'right') {
        // Resize from right - change end date
        const newEnd = new Date(timelineStart.getTime() + newDays * 24 * 60 * 60 * 1000)
        if (newEnd > new Date(task.startDate)) {
          onUpdate({
            ...task,
            endDate: newEnd.toISOString().split('T')[0]
          })
        }
      }
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setIsResizing(false)
    setResizeMode(null)
  }

  return (
    <div
      className={`absolute bg-blue-300 border border-blue-500 cursor-move hover:bg-blue-400 transition ${
        isDragging || isResizing ? 'opacity-70' : ''
      }`}
      style={{
        left: position.left,
        width: position.width,
        top: `${topPosition}px`,
        height: `${laneHeight - 8}px`,
        clipPath: 'polygon(0 0, 95% 0, 100% 50%, 95% 100%, 0 100%)',
        zIndex: isDragging || isResizing ? 20 : 10
      }}
      onMouseDown={(e) => handleMouseDown(e, 'move')}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      title={`${task.productType} ${task.density} | ${task.process} | ${new Date(task.startDate).toLocaleDateString()} ~ ${new Date(task.endDate).toLocaleDateString()}`}
    >
      {/* Left resize handle */}
      <div
        className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-blue-600"
        onMouseDown={(e) => handleMouseDown(e, 'left')}
        onClick={(e) => e.stopPropagation()}
      />

      {/* Right resize handle */}
      <div
        className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-blue-600"
        onMouseDown={(e) => handleMouseDown(e, 'right')}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )
}

export default TaskBar
