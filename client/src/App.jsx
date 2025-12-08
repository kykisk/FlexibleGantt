import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import RichTextEditor from './components/RichTextEditor'
import GanttTable from './components/GanttTable'
import StructureTab from './components/StructureTab'
import AttributesTab from './components/AttributesTab'
import { generateGanttRows } from './utils/ganttUtils'

const API_URL = 'http://localhost:6001/api'

function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Rich Text Editor state
  const [summaryContent, setSummaryContent] = useState('FlexibleGantt Chart Report를 위한 Summary를 작성하세요.')

  // Active tab
  const [activeTab, setActiveTab] = useState('timeline') // 'timeline', 'structure', 'attributes'

  // Timeline config
  const [startYear, setStartYear] = useState(2022)
  const [endYear, setEndYear] = useState(2026)
  const [showQuarters, setShowQuarters] = useState(true)
  const [showMonths, setShowMonths] = useState(false)
  const [dateFormat, setDateFormat] = useState('YYYY-MM-DD') // Date format option

  // Drag state
  const [dragState, setDragState] = useState({
    isDragging: false,
    taskId: null,
    mode: null, // 'move', 'resize-left', 'resize-right'
    startX: 0,
    originalStart: null,
    originalEnd: null
  })

  const timelineRef = useRef(null)

  // Structure configuration (Row groups) - changeable
  const [structureRows, setStructureRows] = useState([
    {
      id: 'row-1',
      name: '제품별 구조',
      depths: [
        { attribute: 'productType', label: '제품 Type' },
        { attribute: 'density', label: 'Density' }
      ]
    }
  ])

  // Task configuration (Attributes tab)
  const [taskConfig, setTaskConfig] = useState({
    selectedAttributes: ['productType', 'density', 'process'],
    shape: 'gantt',
    color: '#93C5FD',
    labelPositions: {
      productType: { x: 50, y: 35 },
      density: { x: 50, y: 50 },
      process: { x: 50, y: 65 }
    }
  })

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/tasks`)
      setTasks(response.data.data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch tasks: ' + err.message)
      console.error('Error fetching tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateTask = async (taskId, updates) => {
    try {
      const task = tasks.find(t => t.id === taskId)
      const updatedTask = { ...task, ...updates }

      await axios.put(`${API_URL}/tasks/${taskId}`, updatedTask)

      // Update local state
      setTasks(tasks.map(t => t.id === taskId ? { ...t, ...updates } : t))
    } catch (err) {
      console.error('Error updating task:', err)
      alert('Failed to update task')
    }
  }

  // Calculate lanes for overlapping tasks
  const calculateLanes = (tasks) => {
    if (tasks.length === 0) return []

    const sortedTasks = [...tasks].sort((a, b) =>
      new Date(a.startDate) - new Date(b.startDate)
    )

    const lanes = []
    sortedTasks.forEach(task => {
      const taskStart = new Date(task.startDate)
      const taskEnd = new Date(task.endDate)

      let laneIndex = 0
      while (laneIndex < lanes.length) {
        const overlaps = lanes[laneIndex].some(existingTask => {
          const existingStart = new Date(existingTask.startDate)
          const existingEnd = new Date(existingTask.endDate)
          return taskStart < existingEnd && taskEnd > existingStart
        })

        if (!overlaps) break
        laneIndex++
      }

      if (!lanes[laneIndex]) lanes[laneIndex] = []
      lanes[laneIndex].push({ ...task, lane: laneIndex })
    })

    const tasksWithLanes = []
    lanes.forEach((lane, laneIndex) => {
      lane.forEach(task => {
        tasksWithLanes.push({ ...task, lane: laneIndex, totalLanes: lanes.length })
      })
    })

    return tasksWithLanes
  }

  // Generate ALL combinations (Cartesian product) like Sample2.PNG
  const generateAllRows = (tasks, depths) => {
    if (depths.length === 0) return []
    if (tasks.length === 0) return []

    // Get ALL unique values for each depth
    const allValuesByDepth = depths.map(depth => {
      const uniqueValues = [...new Set(tasks.map(t => t[depth.attribute]))].filter(v => v !== null && v !== undefined)
      return uniqueValues.sort()
    })

    // Generate Cartesian product
    const generateCombinations = (depthIdx = 0) => {
      if (depthIdx >= depths.length) return [[]]

      const values = allValuesByDepth[depthIdx]
      const subCombos = generateCombinations(depthIdx + 1)

      const result = []
      values.forEach(value => {
        subCombos.forEach(subCombo => {
          result.push([value, ...subCombo])
        })
      })
      return result
    }

    const allCombinations = generateCombinations()

    // Calculate rowspans - key logic!
    const rows = allCombinations.map((combo, rowIdx) => {
      // For each depth column, determine if we should render it (rowspan calculation)
      const rowspans = {}

      for (let depthIdx = 0; depthIdx < depths.length; depthIdx++) {
        // Check if previous row has same values up to (but not including) this depth
        let isSameGroup = false

        if (rowIdx > 0) {
          const prevCombo = allCombinations[rowIdx - 1]

          // Check if:
          // 1. All previous depths match AND
          // 2. Current depth value also matches
          const allPreviousMatch = combo.slice(0, depthIdx).every((v, i) => v === prevCombo[i])
          const currentValueMatch = combo[depthIdx] === prevCombo[depthIdx]

          isSameGroup = allPreviousMatch && currentValueMatch
        }

        if (!isSameGroup) {
          // This is the first row in this group - calculate rowspan
          let span = 1
          for (let nextIdx = rowIdx + 1; nextIdx < allCombinations.length; nextIdx++) {
            const nextCombo = allCombinations[nextIdx]
            const stillSameGroup = combo.slice(0, depthIdx + 1).every((v, i) => v === nextCombo[i])
            if (stillSameGroup) {
              span++
            } else {
              break
            }
          }
          rowspans[depthIdx] = span
        } else {
          rowspans[depthIdx] = 0 // Merged - don't render
        }
      }

      // Find matching tasks
      const matchingTasks = tasks.filter(task =>
        combo.every((val, idx) => task[depths[idx].attribute] === val)
      )

      const tasksWithLanes = calculateLanes(matchingTasks)
      const maxLanes = tasksWithLanes.length > 0 ? Math.max(...tasksWithLanes.map(t => t.totalLanes)) : 1

      return {
        columnValues: combo,
        rowspans,
        tasks: tasksWithLanes,
        rowHeight: maxLanes * 60 + 32 // Increased for date labels above bars
      }
    })

    return rows
  }

  const years = []
  for (let y = startYear; y <= endYear; y++) {
    years.push(y)
  }

  const quarters = ['Q1', 'Q2', 'Q3', 'Q4']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  // Calculate columns per year based on display options
  const getColumnsPerYear = () => {
    if (showMonths) return 12 // 12 months
    if (showQuarters) return 4 // 4 quarters
    return 1 // Only year
  }

  const columnsPerYear = getColumnsPerYear()

  const getTaskPosition = (task) => {
    const start = new Date(task.startDate)
    const end = new Date(task.endDate)
    const timelineStart = new Date(`${startYear}-01-01`)
    const timelineEnd = new Date(`${endYear}-12-31`)

    const totalDays = (timelineEnd - timelineStart) / (1000 * 60 * 60 * 24)
    const taskStartDays = (start - timelineStart) / (1000 * 60 * 60 * 24)
    const taskDuration = (end - start) / (1000 * 60 * 60 * 24)

    const leftPercent = (taskStartDays / totalDays) * 100
    const widthPercent = (taskDuration / totalDays) * 100

    return {
      left: `${Math.max(0, leftPercent)}%`,
      width: `${Math.max(1, Math.min(100 - leftPercent, widthPercent))}%`
    }
  }

  // Drag handlers
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

  const handleMouseMove = (e) => {
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
    const originalGap = (originalEnd - originalStart) / (1000 * 60 * 60 * 24) // Duration in days

    let newStart, newEnd

    // For non-gantt shapes, only allow move (preserve duration)
    const isGantt = taskConfig.shape === 'gantt'

    if (dragState.mode === 'move') {
      // Move entire task - always preserve duration
      newStart = new Date(originalStart.getTime() + daysDelta * 24 * 60 * 60 * 1000)
      newEnd = new Date(newStart.getTime() + originalGap * 24 * 60 * 60 * 1000) // Preserve gap
    } else if (dragState.mode === 'resize-left' && isGantt) {
      // Resize from left (only for gantt shape)
      newStart = new Date(originalStart.getTime() + daysDelta * 24 * 60 * 60 * 1000)
      newEnd = originalEnd
      if (newStart >= newEnd) return
    } else if (dragState.mode === 'resize-right' && isGantt) {
      // Resize from right (only for gantt shape)
      newStart = originalStart
      newEnd = new Date(originalEnd.getTime() + daysDelta * 24 * 60 * 60 * 1000)
      if (newEnd <= newStart) return
    } else {
      // Ignore resize for non-gantt shapes
      return
    }

    // Update local state (optimistic update)
    setTasks(tasks.map(t =>
      t.id === dragState.taskId
        ? { ...t, startDate: newStart.toISOString().split('T')[0], endDate: newEnd.toISOString().split('T')[0] }
        : t
    ))
  }

  const handleMouseUp = () => {
    if (dragState.isDragging && dragState.taskId) {
      // Note: Changes are only in-memory, not saved to database
      // This allows temporary adjustments without persisting to DB
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

  const allRows = generateAllRows(tasks, structureRows[0].depths)
  const numDepths = structureRows[0].depths.length

  return (
    <div
      className="min-h-screen bg-white"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Header */}
      <header className="border-b border-gray-300 p-6">
        <div className="max-w-full mx-auto">
          <p className="text-sm text-gray-500 mb-2">Report</p>
          <h1 className="text-3xl font-semibold text-gray-800">
            FlexibleGantt Report
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-full mx-auto p-6">

        {/* Summary Section - Rich Text Editor */}
        <section className="mb-8 bg-white border border-gray-300 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-300 bg-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Summary</h2>
          </div>
          <div className="p-4">
            <RichTextEditor
              value={summaryContent}
              onChange={setSummaryContent}
            />
          </div>
          <div className="p-4 border-t border-gray-300 bg-gray-50">
            <p className="text-xs text-gray-500">
              Total Tasks: <strong>{tasks.length}</strong> | Period: <strong>{startYear} ~ {endYear}</strong>
            </p>
          </div>
        </section>

        {/* Gantt Configuration Section */}
        <section className="mb-8 bg-white border border-gray-300 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-300 flex justify-between items-center bg-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Gantt Configuration</h2>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-300">
            <div className="flex gap-6 px-6">
              <button
                onClick={() => setActiveTab('timeline')}
                className={`py-3 text-sm font-semibold ${
                  activeTab === 'timeline'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                Timeline
              </button>
              <button
                onClick={() => setActiveTab('structure')}
                className={`py-3 text-sm font-semibold ${
                  activeTab === 'structure'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                Structure
              </button>
              <button
                onClick={() => setActiveTab('attributes')}
                className={`py-3 text-sm font-semibold ${
                  activeTab === 'attributes'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                Attributes
              </button>
            </div>
          </div>

          {/* Tab Content - Timeline */}
          {activeTab === 'timeline' && (
          <div className="p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Year Range
              </label>
              <div className="flex items-center gap-4">
                <select
                  className="px-4 py-2 border border-gray-300 rounded"
                  value={startYear}
                  onChange={(e) => setStartYear(Number(e.target.value))}
                >
                  <option value={2020}>2020</option>
                  <option value={2021}>2021</option>
                  <option value={2022}>2022</option>
                  <option value={2023}>2023</option>
                  <option value={2024}>2024</option>
                </select>
                <span className="text-gray-500">to</span>
                <select
                  className="px-4 py-2 border border-gray-300 rounded"
                  value={endYear}
                  onChange={(e) => setEndYear(Number(e.target.value))}
                >
                  <option value={2024}>2024</option>
                  <option value={2025}>2025</option>
                  <option value={2026}>2026</option>
                  <option value={2027}>2027</option>
                  <option value={2028}>2028</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Display Options
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showQuarters}
                    onChange={(e) => setShowQuarters(e.target.checked)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Show Quarters</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showMonths}
                    onChange={(e) => setShowMonths(e.target.checked)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Show Months</span>
                </label>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-medium text-gray-800 mb-1">
                Date Format
              </label>
              <select
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
                className="px-2 py-1 text-sm border border-gray-300 rounded"
              >
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                <option value="YYYY.MM.DD">YYYY.MM.DD</option>
                <option value="MM-DD">MM-DD</option>
              </select>
            </div>
          </div>
          )}

          {/* Tab Content - Structure */}
          {activeTab === 'structure' && (
            <StructureTab
              structureRows={structureRows}
              setStructureRows={setStructureRows}
            />
          )}

          {/* Tab Content - Attributes */}
          {activeTab === 'attributes' && (
            <AttributesTab
              taskConfig={taskConfig}
              setTaskConfig={setTaskConfig}
            />
          )}
        </section>

        {/* Gantt Chart Section */}
        <section className="bg-white border border-gray-400 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-400 bg-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Gantt Chart</h2>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-12 text-gray-500">
                Loading Gantt Chart...
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-500">{error}</div>
            ) : (
              <GanttTable
                allRows={allRows}
                years={years}
                showQuarters={showQuarters}
                showMonths={showMonths}
                numDepths={numDepths}
                getTaskPosition={getTaskPosition}
                handleTaskMouseDown={handleTaskMouseDown}
                dragState={dragState}
                taskConfig={taskConfig}
                dateFormat={dateFormat}
              />
            )}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-gray-300">
        <div className="max-w-full mx-auto px-6 text-center text-sm text-gray-500">
          <p>FlexibleGantt v1.0.0 | Backend: http://localhost:6001 | Frontend: http://localhost:5179</p>
        </div>
      </footer>
    </div>
  )
}

export default App
