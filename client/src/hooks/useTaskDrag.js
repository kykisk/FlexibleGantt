import { useState } from 'react'

export function useTaskDrag(tasks, setTasks, taskConfig) {
  const [dragState, setDragState] = useState({
    isDragging: false,
    taskId: null,
    mode: null,
    startX: 0,
    originalStart: null,
    originalEnd: null
  })

  const handleTaskMouseDown = (e, task, mode) => {
    e.stopPropagation()
    const rect = e.currentTarget.closest('td').getBoundingClientRect()

    setDragState({
      isDragging: true,
      taskId: task.id,
      mode: mode,
      startX: e.clientX,
      containerLeft: rect.left,
      containerWidth: rect.width,
      originalStart: task.startDate,
      originalEnd: task.endDate
    })
  }

  const handleMouseMove = (e, startYear, endYear) => {
    if (!dragState.isDragging) return

    const deltaX = e.clientX - dragState.startX
    const percentDelta = (deltaX / dragState.containerWidth) * 100

    const timelineStart = new Date(`${startYear}-01-01`)
    const timelineEnd = new Date(`${endYear}-12-31`)
    const totalDays = (timelineEnd - timelineStart) / (1000 * 60 * 60 * 24)
    const daysDelta = (percentDelta / 100) * totalDays

    const task = tasks.find(t => t.id === dragState.taskId)
    if (!task) return

    const originalStart = new Date(dragState.originalStart)
    const originalEnd = new Date(dragState.originalEnd)
    const originalGap = (originalEnd - originalStart) / (1000 * 60 * 60 * 24)

    let newStart, newEnd

    const isGantt = taskConfig.shape === 'gantt'

    if (dragState.mode === 'move') {
      newStart = new Date(originalStart.getTime() + daysDelta * 24 * 60 * 60 * 1000)
      newEnd = new Date(newStart.getTime() + originalGap * 24 * 60 * 60 * 1000)
    } else if (dragState.mode === 'resize-left' && isGantt) {
      newStart = new Date(originalStart.getTime() + daysDelta * 24 * 60 * 60 * 1000)
      newEnd = originalEnd
      if (newStart >= newEnd) return
    } else if (dragState.mode === 'resize-right' && isGantt) {
      newStart = originalStart
      newEnd = new Date(originalEnd.getTime() + daysDelta * 24 * 60 * 60 * 1000)
      if (newEnd <= newStart) return
    } else {
      return
    }

    setTasks(tasks.map(t =>
      t.id === dragState.taskId
        ? { ...t, startDate: newStart.toISOString().split('T')[0], endDate: newEnd.toISOString().split('T')[0] }
        : t
    ))
  }

  const handleMouseUp = () => {
    if (dragState.isDragging && dragState.taskId) {
      console.log('Task adjusted (not saved to DB):', dragState.taskId)
    }

    setDragState({
      isDragging: false,
      taskId: null,
      mode: null,
      startX: 0,
      originalStart: null,
      originalEnd: null
    })
  }

  return {
    dragState,
    handleTaskMouseDown,
    handleMouseMove,
    handleMouseUp
  }
}
