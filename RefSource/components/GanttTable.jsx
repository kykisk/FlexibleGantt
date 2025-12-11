import React from 'react'
import { isDarkColor } from '../constants/shapes'

function GanttTable({ ganttByRow, years, showQuarters, showMonths, getTaskPosition, handleTaskMouseDown, dragState, taskConfig, dateFormat, getTaskShape, getTaskColor, handleTaskRightClick, handleRowRightClick, structureRows }) {
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  // 모든 Row 중 최대 Depth 개수 사용 (헤더용)
  const numDepths = Math.max(...ganttByRow.map(g => g.numDepths))

  // Format date based on selected format
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    switch (dateFormat) {
      case 'MM/DD/YYYY':
        return `${month}/${day}/${year}`
      case 'DD-MM-YYYY':
        return `${day}-${month}-${year}`
      case 'YYYY.MM.DD':
        return `${year}.${month}.${day}`
      case 'MM-DD':
        return `${month}-${day}`
      case 'YYYY-MM-DD':
      default:
        return `${year}-${month}-${day}`
    }
  }

  // Calculate columns per year
  const getColumnsPerYear = () => {
    if (showMonths) return 12
    if (showQuarters) return 4
    return 1
  }

  const columnsPerYear = getColumnsPerYear()
  const totalColumns = years.length * columnsPerYear

  // Calculate header rowspan
  const getHeaderRowSpan = () => {
    let rows = 1 // Year row
    if (showQuarters && !showMonths) rows++
    if (showMonths) rows += showQuarters ? 2 : 1
    return rows
  }

  const headerRowSpan = getHeaderRowSpan()

  return (
    <div style={{ minWidth: '1200px' }}>
      <table className="w-full border-collapse">
        {/* Header - 한 번만 렌더링 */}
        <thead>
          {/* Year row */}
          <tr>
            <th
              rowSpan={headerRowSpan}
              className="bg-gray-300 border border-gray-400 px-4 py-2 text-sm font-semibold text-gray-800 w-32 align-middle"
            >
              구분
            </th>
            {numDepths > 1 && Array.from({ length: numDepths - 1 }).map((_, idx) => (
              <th
                key={`depth-${idx}`}
                rowSpan={headerRowSpan}
                className="bg-gray-300 border border-gray-400 px-4 py-2 text-sm font-semibold text-gray-800 w-24 align-middle"
              >
              </th>
            ))}
            {years.map(year => (
              <th
                key={year}
                colSpan={columnsPerYear}
                className="bg-gray-300 border border-gray-400 px-4 py-2 text-center text-sm font-semibold text-gray-800"
              >
                {year}
              </th>
            ))}
          </tr>

          {/* Quarter row (if showQuarters) */}
          {showQuarters && (
            <tr>
              {years.map(year => (
                quarters.map(q => (
                  <th
                    key={`${year}-${q}`}
                    colSpan={showMonths ? 3 : 1}
                    className="bg-gray-300 border border-gray-400 px-2 py-2 text-center text-xs font-medium text-gray-700"
                  >
                    {q}
                  </th>
                ))
              ))}
            </tr>
          )}

          {/* Month row (if showMonths) */}
          {showMonths && (
            <tr>
              {years.map(year => (
                months.map(m => (
                  <th
                    key={`${year}-${m}`}
                    className="bg-gray-300 border border-gray-400 px-1 py-2 text-center text-xs font-medium text-gray-700"
                  >
                    {m}
                  </th>
                ))
              ))}
            </tr>
          )}
        </thead>

        {/* Body - 단일 tbody로 통합 */}
        <tbody>
          {ganttByRow.map(({ row: structureRow, filteredRows, numDepths: rowNumDepths }, ganttRowIndex) => (
            <React.Fragment key={structureRow.id}>
              {/* Row 데이터 */}
              {filteredRows.map((row, rowIdx) => {
                const laneHeight = 60

                return (
                  <tr key={`${structureRow.id}-${rowIdx}`} className="hover:bg-gray-50">
                    {/* Depth columns with nested rowspans */}
                    {row.columnValues.map((colValue, colIdx) => {
                      const rowspan = row.rowspans && row.rowspans[colIdx]

                      // Skip if this cell was merged by previous row (rowspan === 0)
                      if (rowspan === 0 || rowspan === undefined) return null

                      return (
                        <td
                          key={colIdx}
                          rowSpan={rowspan}
                          colSpan={1}
                          className="bg-gray-200 border border-gray-400 px-4 py-3 text-center text-sm font-semibold text-gray-800 align-middle cursor-pointer hover:bg-gray-300"
                          onContextMenu={(e) => handleRowRightClick(e, row.tasks)}
                          title="Right-click to change all tasks in this row"
                        >
                          {colValue}
                        </td>
                      )
                    })}

                    {/* 부족한 Depth 컬럼 채우기 (첫 번째 Row 기준) */}
                    {rowNumDepths < numDepths && row.columnValues.length === rowNumDepths && (
                      Array.from({ length: numDepths - rowNumDepths }).map((_, idx) => (
                        <td
                          key={`empty-${idx}`}
                          className="bg-gray-200 border border-gray-400"
                        />
                      ))
                    )}

                <td
                  colSpan={totalColumns}
                  className="bg-white border border-gray-400 p-0 relative"
                  style={{ height: `${row.rowHeight}px`, minHeight: '40px', overflow: 'visible' }}
                >
                  {/* Grid lines */}
                  <div className="absolute inset-0 flex pointer-events-none">
                    {Array.from({ length: totalColumns }).map((_, colIdx) => (
                      <div
                        key={colIdx}
                        className="flex-1 border-r border-gray-300"
                        style={{ borderStyle: 'dotted' }}
                      ></div>
                    ))}
                  </div>

                  {/* Task bars */}
                  {row.tasks.map((task) => {
                    const position = getTaskPosition(task)
                    const topPosition = task.lane * laneHeight + 26 // Increased to make room for date labels above
                    const isActive = dragState.taskId === task.id

                    // Get individual task shape and color (or default)
                    const taskShape = getTaskShape(task.id)
                    const taskColor = getTaskColor(task.id)
                    const isGantt = taskShape === 'gantt'

                    // Calculate shape size and position based on type
                    let shapeLeft = position.left
                    let shapeWidth = '52px'
                    let shapeHeight = '52px'

                    if (isGantt) {
                      shapeWidth = position.width
                      shapeHeight = `${laneHeight - 8}px`
                    } else if (taskShape === 'rectangle') {
                      // Rectangle: 종료일에 오른쪽 맞춤, 넓이 100px
                      shapeWidth = '100px'
                      shapeHeight = '52px'
                      const endPercent = parseFloat(position.left) + parseFloat(position.width)
                      shapeLeft = `calc(${endPercent}% - 100px)`
                    } else if (taskShape === 'circle') {
                      // Circle: 종료일에 중심 맞춤
                      shapeWidth = '52px'
                      shapeHeight = '52px'
                      const endPercent = parseFloat(position.left) + parseFloat(position.width)
                      shapeLeft = `calc(${endPercent}% - 26px)` // 반지름만큼 빼기
                    }

                    return (
                      <React.Fragment key={task.id}>
                        {/* Date Labels - Outside the bar, above (Gantt only) */}
                        {isGantt && (
                          <>
                            {/* Start Date - Top Left of bar */}
                            <div
                              key={`${task.id}-start`}
                              className="absolute pointer-events-none"
                              style={{
                                left: position.left,
                                top: `${topPosition - 18}px`,
                                zIndex: 25
                              }}
                            >
                              <div className="bg-white border border-gray-400 px-1 rounded" style={{ fontSize: '7px', color: '#374151', whiteSpace: 'nowrap', paddingTop: '1px', paddingBottom: '1px' }}>
                                {formatDate(task.startDate)}
                              </div>
                            </div>

                            {/* End Date - Top Right of bar */}
                            <div
                              key={`${task.id}-end`}
                              className="absolute pointer-events-none"
                              style={{
                                left: position.left,
                                width: position.width,
                                top: `${topPosition - 18}px`,
                                zIndex: 25,
                                display: 'flex',
                                justifyContent: 'flex-end'
                              }}
                            >
                              <div className="bg-white border border-gray-400 px-1 rounded" style={{ fontSize: '7px', color: '#374151', whiteSpace: 'nowrap', paddingTop: '1px', paddingBottom: '1px' }}>
                                {formatDate(task.endDate)}
                              </div>
                            </div>
                          </>
                        )}

                        {/* Task Bar - Shape only */}
                        <div
                          key={task.id}
                          className={`absolute border-2 hover:brightness-110 transition select-none ${
                            isActive ? 'opacity-70 shadow-lg' : 'cursor-move'
                          }`}
                          style={{
                            left: shapeLeft,
                            width: shapeWidth,
                            top: `${topPosition}px`,
                            height: shapeHeight,
                            backgroundColor: taskColor,
                            borderColor: taskColor,
                            clipPath: taskShape === 'gantt'
                              ? 'polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)'
                              : taskShape === 'circle'
                              ? 'circle(50% at 50% 50%)'
                              : taskShape === 'triangle'
                              ? 'polygon(50% 0%, 0% 100%, 100% 100%)'
                              : 'none',
                            zIndex: isActive ? 20 : 10
                          }}
                          onMouseDown={(e) => handleTaskMouseDown(e, task, 'move')}
                          onContextMenu={(e) => handleTaskRightClick(e, task.id)}
                          title={`${row.columnValues.join(' - ')} | ${task.process} | ${new Date(task.startDate).toLocaleDateString()} ~ ${new Date(task.endDate).toLocaleDateString()}\n\nDrag to move | Right click to change shape`}
                        >
                          {/* Resize handles - only for gantt shape */}
                          {taskShape === 'gantt' && (
                            <>
                              {/* Left resize handle */}
                              <div
                                className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize"
                                style={{ zIndex: 5 }}
                                onMouseDown={(e) => {
                                  e.stopPropagation()
                                  handleTaskMouseDown(e, task, 'resize-left')
                                }}
                              />

                              {/* Right resize handle */}
                              <div
                                className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize"
                                style={{ zIndex: 5 }}
                                onMouseDown={(e) => {
                                  e.stopPropagation()
                                  handleTaskMouseDown(e, task, 'resize-right')
                                }}
                              />
                            </>
                          )}
                        </div>

                        {/* Attribute Labels */}
                        {taskShape === 'gantt' ? (
                          // Gantt Bar: draggable positioned labels
                          taskConfig.ganttAttributes.map((attrKey, attrIdx) => {
                            const labelPos = taskConfig.ganttLabelPositions[attrKey] || { x: 50, y: 35 + attrIdx * 15 }
                            const attrValue = task[attrKey]

                            const barLeftPercent = parseFloat(position.left)
                            const barWidthPercent = parseFloat(position.width)
                            const labelLeftPercent = barLeftPercent + (barWidthPercent * labelPos.x / 100)
                            const labelTopPx = topPosition + ((parseFloat(shapeHeight) * labelPos.y / 100))

                            return (
                              <div
                                key={`${task.id}-${attrKey}`}
                                className="absolute pointer-events-none"
                                style={{
                                  left: `${labelLeftPercent}%`,
                                  top: `${labelTopPx}px`,
                                  transform: 'translate(-50%, -50%)',
                                  zIndex: 30
                                }}
                              >
                                <div className="bg-white bg-opacity-90 border border-gray-400 px-1 rounded shadow-sm" style={{
                                  fontSize: '8px',
                                  color: '#374151',
                                  whiteSpace: 'nowrap',
                                  paddingTop: '1px',
                                  paddingBottom: '1px'
                                }}>
                                  {attrValue}
                                </div>
                              </div>
                            )
                          })
                        ) : taskShape === 'circle' ? (
                          // Circle: 1번 중앙, 2-4번 오른쪽
                          <>
                            {/* 1번 - 중앙 */}
                            {taskConfig.circleAttributes[0] && (
                              <div
                                key={`${task.id}-circle-0`}
                                className="absolute pointer-events-none flex items-center justify-center"
                                style={{
                                  left: shapeLeft,
                                  width: shapeWidth,
                                  top: `${topPosition}px`,
                                  height: shapeHeight,
                                  zIndex: 30
                                }}
                              >
                                <div style={{
                                  fontSize: `${taskConfig.circleFontSize || 9}px`,
                                  whiteSpace: 'nowrap',
                                  color: isDarkColor(taskColor) ? '#ffffff' : '#1f2937'
                                }}>
                                  {task[taskConfig.circleAttributes[0]]}
                                </div>
                              </div>
                            )}

                            {/* 2-4번 - 오른쪽 (Circle 위치 기준) */}
                            {taskConfig.circleAttributes.slice(1, 4).map((attrKey, idx) => {
                              const attrValue = task[attrKey]
                              const shapeHeightPx = 52
                              const spacing = shapeHeightPx / 4
                              const topOffset = spacing * (idx + 1)

                              return (
                                <div
                                  key={`${task.id}-${attrKey}`}
                                  className="absolute pointer-events-none"
                                  style={{
                                    left: `calc(${shapeLeft} + 52px + 8px)`,
                                    top: `${topPosition + topOffset}px`,
                                    zIndex: 30
                                  }}
                                >
                                  <div style={{
                                    fontSize: `${taskConfig.circleFontSize || 9}px`,
                                    whiteSpace: 'nowrap',
                                    color: '#1f2937'
                                  }}>
                                    {attrValue}
                                  </div>
                                </div>
                              )
                            })}
                          </>
                        ) : taskShape === 'rectangle' ? (
                          // Rectangle: 5개 모두 도형 안 고정 위치
                          taskConfig.rectangleAttributes.map((attrKey, idx) => {
                            const attrValue = task[attrKey]
                            // 고정 위치: 1중앙, 2좌상, 3우상, 4좌하, 5우하
                            const positions = [
                              { x: 50, y: 50 },
                              { x: 20, y: 20 },
                              { x: 80, y: 20 },
                              { x: 20, y: 80 },
                              { x: 80, y: 80 }
                            ]
                            const pos = positions[idx]

                            return (
                              <div
                                key={`${task.id}-${attrKey}`}
                                className="absolute pointer-events-none"
                                style={{
                                  left: `calc(${shapeLeft} + ${100 * pos.x / 100}px)`,
                                  top: `${topPosition + (52 * pos.y / 100)}px`,
                                  transform: 'translate(-50%, -50%)',
                                  zIndex: 30
                                }}
                              >
                                <div style={{
                                  fontSize: `${taskConfig.rectangleFontSize || 7}px`,
                                  whiteSpace: 'nowrap',
                                  color: isDarkColor(taskColor) ? '#ffffff' : '#1f2937'
                                }}>
                                  {attrValue}
                                </div>
                              </div>
                            )
                          })
                        ) : null}
                      </React.Fragment>
                    )
                  })}
                </td>
                  </tr>
                )
              })}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default GanttTable
