/**
 * Task 속성 정의
 *
 * Gantt에서 사용 가능한 모든 Task 속성 목록
 * Teamcenter 환경에 맞춰 속성을 추가하거나 수정할 수 있습니다.
 */
export const availableAttributes = [
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

/**
 * 속성 값으로 라벨 조회
 *
 * @매개변수 {string} value - 속성 값 (예: 'productType')
 * @반환값 {string} 속성 라벨 (예: '제품 Type')
 */
export const getAttributeLabel = (value) => {
  return availableAttributes.find(a => a.value === value)?.label || value
}
