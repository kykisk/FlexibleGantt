// Available task attributes for selection
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

// Get attribute label by value
export const getAttributeLabel = (value) => {
  return availableAttributes.find(a => a.value === value)?.label || value
}
