/**
 * ============================================================================
 * Teamcenter ActiveWorkspace - FlexibleGantt 통합 예시
 * ============================================================================
 *
 * 이 파일은 Teamcenter ActiveWorkspace 환경에서
 * FlexibleGantt 기능을 통합하는 예시입니다.
 *
 * 주요 통합 포인트:
 * 1. Teamcenter DB에서 설정/데이터 로드
 * 2. Teamcenter SOA를 통한 저장
 * 3. 기존 UI 시스템과 통합
 */

import React, { useState, useEffect } from 'react'
import { loadGanttConfig, saveGanttConfig, loadTasks } from '../utils/tcDbService'
import GanttTable from '../components/GanttTable'

/**
 * Teamcenter 통합 Gantt Report 컴포넌트
 *
 * @component
 */
function TeamcenterGanttReport({ userId, projectId }) {
  // =========================================================================
  // State 관리
  // =========================================================================

  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  // Gantt 설정 State
  const [summaryContent, setSummaryContent] = useState('')
  const [startYear, setStartYear] = useState(2022)
  const [endYear, setEndYear] = useState(2026)
  const [structureRows, setStructureRows] = useState([])
  const [taskConfig, setTaskConfig] = useState({})

  // =========================================================================
  // Teamcenter DB 연동
  // =========================================================================

  /**
   * 컴포넌트 마운트 시 Teamcenter DB에서 데이터 로드
   */
  useEffect(() => {
    initializeFromTeamcenter()
  }, [userId, projectId])

  /**
   * Teamcenter DB에서 Gantt 설정 및 Task 로드
   *
   * 이 함수는 컴포넌트 초기화 시 호출됩니다.
   * Teamcenter DB에서 저장된 설정을 불러와 State에 적용합니다.
   */
  const initializeFromTeamcenter = async () => {
    try {
      setLoading(true)

      // Step 1: Gantt 설정 로드
      const config = await loadGanttConfig(userId, projectId)

      // Step 2: State 복원
      if (config.summary) setSummaryContent(config.summary)
      if (config.timeline) {
        setStartYear(config.timeline.startYear)
        setEndYear(config.timeline.endYear)
      }
      if (config.structure) setStructureRows(config.structure)
      if (config.attributes) setTaskConfig(config.attributes)

      // Step 3: Task 데이터 로드
      const tasks = await loadTasks(config.configId)
      setTasks(tasks)

      setLoading(false)
    } catch (error) {
      console.error('Teamcenter 초기화 실패:', error)
      setLoading(false)
    }
  }

  /**
   * 현재 설정을 Teamcenter DB에 저장
   *
   * Export JSON 버튼 대신 "저장" 버튼으로 대체
   * 파일 다운로드가 아닌 DB INSERT/UPDATE 수행
   */
  const handleSaveToTeamcenter = async () => {
    try {
      const configData = {
        summary: summaryContent,
        timeline: { startYear, endYear, showQuarters, showMonths },
        structure: structureRows,
        attributes: taskConfig,
        taskShapes: taskShapes
      }

      // Teamcenter DB에 저장
      await saveGanttConfig(configId, configData)

      alert('설정이 저장되었습니다')
    } catch (error) {
      console.error('저장 실패:', error)
      alert('저장 중 오류가 발생했습니다')
    }
  }

  // =========================================================================
  // 렌더링
  // =========================================================================

  if (loading) {
    return <div>Loading Gantt Report...</div>
  }

  return (
    <div className="gantt-report-container">
      {/* Header */}
      <div className="gantt-header">
        <h2>Gantt Report</h2>
        <button onClick={handleSaveToTeamcenter}>
          저장
        </button>
      </div>

      {/* Summary Section */}
      <div className="gantt-summary">
        {/* ... Summary 컴포넌트 */}
      </div>

      {/* Gantt Chart */}
      <div className="gantt-chart">
        <GanttTable
          allRows={allRows}
          tasks={tasks}
          // ... props
        />
      </div>
    </div>
  )
}

export default TeamcenterGanttReport

/**
 * ============================================================================
 * 사용 방법
 * ============================================================================
 *
 * 1. ActiveWorkspace 라우터에 등록:
 *
 * <Route path="/gantt-report" element={
 *   <TeamcenterGanttReport
 *     userId={currentUser.uid}
 *     projectId={currentProject.uid}
 *   />
 * } />
 *
 * 2. 메뉴에 추가:
 *
 * {
 *   label: 'Gantt Report',
 *   route: '/gantt-report',
 *   icon: 'chart'
 * }
 *
 * 3. 권한 설정:
 *
 * - TC_GANTT_CONFIG 테이블 접근 권한
 * - TC_GANTT_TASKS 테이블 접근 권한
 *
 * ============================================================================
 */
