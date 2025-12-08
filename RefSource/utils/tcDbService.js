/**
 * Teamcenter DB 연동 서비스
 *
 * 이 파일은 Teamcenter ActiveWorkspace 환경에서
 * Gantt 설정 및 Task 데이터를 저장/로드하기 위한 템플릿입니다.
 *
 * 기존 PostgreSQL API 호출을 Teamcenter SOA 호출로 대체해야 합니다.
 */

// ============================================================================
// Teamcenter SOA 호출 래퍼 (프로젝트에 맞게 수정)
// ============================================================================

/**
 * Teamcenter SOA 호출 유틸리티
 *
 * 실제 구현 시 프로젝트의 SOA 호출 방식에 맞춰 수정하세요.
 *
 * @예시
 * const result = await callTeamcenterSOA('Custom-2024-06-DataManagement', 'loadObjects', {
 *   uids: ['abc123']
 * })
 */
const callTeamcenterSOA = async (serviceName, operationName, inputData) => {
  // 할일: 실제 Teamcenter SOA 호출 구현
  // 예시: return await soaService.post(serviceName, operationName, inputData)
  throw new Error('Teamcenter SOA 연동이 필요합니다. 이 함수를 구현하세요.')
}

// ============================================================================
// Gantt 설정 저장/로드
// ============================================================================

/**
 * Gantt 설정을 Teamcenter DB에서 로드
 *
 * Teamcenter DB 테이블: TC_GANTT_CONFIG
 *
 * @매개변수 {string} userId - 사용자 ID
 * @매개변수 {string} projectId - 프로젝트 ID
 * @반환값 {Promise<Object>} Gantt 설정 객체
 *
 * @예시
 * const config = await loadGanttConfig('user123', 'proj456')
 * // 반환값:
 * // {
 * //   summary: "Summary 내용",
 * //   timeline: { startYear: 2022, endYear: 2026, ... },
 * //   structure: [ { depths: [...] } ],
 * //   attributes: { ganttAttributes: [...], shapeAttributes: [...] },
 * //   taskShapes: { '1': 'circle', '5': 'rectangle' }
 * // }
 */
export const loadGanttConfig = async (userId, projectId) => {
  try {
    // 할일: Teamcenter DB에서 설정 조회
    // SELECT * FROM TC_GANTT_CONFIG WHERE user_id = ? AND project_id = ?

    const result = await callTeamcenterSOA(
      'Custom-GanttService',
      'loadGanttConfig',
      { userId, projectId }
    )

    // JSON 파싱
    return {
      summary: result.summaryContent,
      timeline: JSON.parse(result.timelineConfig),
      structure: JSON.parse(result.structureConfig),
      attributes: JSON.parse(result.attributesConfig),
      taskShapes: JSON.parse(result.taskShapes || '{}')
    }
  } catch (error) {
    console.error('Gantt 설정 로드 실패:', error)
    // 기본값 반환
    return getDefaultConfig()
  }
}

/**
 * Gantt 설정을 Teamcenter DB에 저장
 *
 * @매개변수 {string} configId - 설정 ID (없으면 신규 생성)
 * @매개변수 {Object} configData - 저장할 설정 데이터
 *
 * @예시
 * await saveGanttConfig('config123', {
 *   summary: summaryContent,
 *   timeline: { startYear, endYear, ... },
 *   structure: structureRows,
 *   attributes: taskConfig,
 *   taskShapes: taskShapes
 * })
 */
export const saveGanttConfig = async (configId, configData) => {
  try {
    // 할일: Teamcenter DB에 저장
    // INSERT INTO TC_GANTT_CONFIG ... 또는 UPDATE ...

    await callTeamcenterSOA(
      'Custom-GanttService',
      'saveGanttConfig',
      {
        configId,
        summaryContent: configData.summary,
        timelineConfig: JSON.stringify(configData.timeline),
        structureConfig: JSON.stringify(configData.structure),
        attributesConfig: JSON.stringify(configData.attributes),
        taskShapes: JSON.stringify(configData.taskShapes)
      }
    )

    return { success: true }
  } catch (error) {
    console.error('Gantt 설정 저장 실패:', error)
    throw error
  }
}

// ============================================================================
// Task 데이터 저장/로드
// ============================================================================

/**
 * Task 데이터를 Teamcenter DB에서 로드
 *
 * @매개변수 {string} configId - Gantt 설정 ID
 * @반환값 {Promise<Array>} Task 배열
 *
 * @예시
 * const tasks = await loadTasks('config123')
 * // 반환값: [ { id, startDate, endDate, productType, density, ... }, ... ]
 */
export const loadTasks = async (configId) => {
  try {
    // 할일: Teamcenter DB에서 Task 조회
    // SELECT * FROM TC_GANTT_TASKS WHERE config_id = ?

    const result = await callTeamcenterSOA(
      'Custom-GanttService',
      'loadTasks',
      { configId }
    )

    return result.tasks || []
  } catch (error) {
    console.error('Task 로드 실패:', error)
    return []
  }
}

/**
 * Task 생성
 *
 * @매개변수 {string} configId - Gantt 설정 ID
 * @매개변수 {Object} taskData - Task 데이터
 *
 * @예시
 * await createTask('config123', {
 *   startDate: '2022-01-15',
 *   endDate: '2022-03-15',
 *   productType: 'DDR5',
 *   density: '16Gb',
 *   // ... 기타 속성
 * })
 */
export const createTask = async (configId, taskData) => {
  try {
    // 할일: Teamcenter DB에 Task 생성
    // INSERT INTO TC_GANTT_TASKS ...

    await callTeamcenterSOA(
      'Custom-GanttService',
      'createTask',
      { configId, taskData }
    )

    return { success: true }
  } catch (error) {
    console.error('Task 생성 실패:', error)
    throw error
  }
}

/**
 * Task 업데이트
 *
 * @매개변수 {string} taskId - Task ID
 * @매개변수 {Object} updates - 업데이트할 필드
 */
export const updateTask = async (taskId, updates) => {
  try {
    // 할일: Teamcenter DB Task 업데이트
    // UPDATE TC_GANTT_TASKS SET ... WHERE task_id = ?

    await callTeamcenterSOA(
      'Custom-GanttService',
      'updateTask',
      { taskId, updates }
    )

    return { success: true }
  } catch (error) {
    console.error('Task 업데이트 실패:', error)
    throw error
  }
}

/**
 * Task 삭제
 */
export const deleteTask = async (taskId) => {
  try {
    await callTeamcenterSOA(
      'Custom-GanttService',
      'deleteTask',
      { taskId }
    )

    return { success: true }
  } catch (error) {
    console.error('Task 삭제 실패:', error)
    throw error
  }
}

// ============================================================================
// 기본 설정
// ============================================================================

/**
 * 기본 Gantt 설정 반환
 *
 * DB에 저장된 설정이 없을 때 사용
 */
const getDefaultConfig = () => {
  return {
    summary: 'FlexibleGantt Chart Report',
    timeline: {
      startYear: 2022,
      endYear: 2026,
      showQuarters: true,
      showMonths: false,
      dateFormat: 'YYYY-MM-DD'
    },
    structure: [
      {
        id: 'row-1',
        name: '제품별 구조',
        depths: [
          { attribute: 'productType', label: '제품 Type' },
          { attribute: 'density', label: 'Density' }
        ]
      }
    ],
    attributes: {
      shape: 'gantt',
      color: '#93C5FD',
      ganttAttributes: ['productType', 'density', 'process'],
      ganttLabelPositions: {
        productType: { x: 50, y: 35 },
        density: { x: 50, y: 50 },
        process: { x: 50, y: 65 }
      },
      shapeAttributes: ['productType', 'density']
    },
    taskShapes: {}
  }
}

// ============================================================================
// 개별 Task 도형 저장
// ============================================================================

/**
 * 개별 Task의 도형 설정 저장
 *
 * 우클릭으로 변경한 도형은 taskShapes에 저장되어야 함
 *
 * @매개변수 {string} configId - 설정 ID
 * @매개변수 {Object} taskShapes - { taskId: 'gantt' | 'circle' | ... }
 */
export const saveTaskShapes = async (configId, taskShapes) => {
  try {
    await callTeamcenterSOA(
      'Custom-GanttService',
      'saveTaskShapes',
      { configId, taskShapes: JSON.stringify(taskShapes) }
    )

    return { success: true }
  } catch (error) {
    console.error('Task 도형 저장 실패:', error)
    throw error
  }
}
