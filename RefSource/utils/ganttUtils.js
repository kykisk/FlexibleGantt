// Generate Gantt rows with proper rowspans (Sample2.PNG style)

export function generateGanttRows(tasks, depths) {
  if (!depths || depths.length === 0 || !tasks || tasks.length === 0) {
    return []
  }

  // Step 1: Get unique values for each depth
  const uniqueValuesByDepth = depths.map(depth => {
    const values = [...new Set(tasks.map(t => t[depth.attribute]))]
      .filter(v => v != null)
      .sort()
    return values
  })

  console.log('Unique values by depth:', uniqueValuesByDepth)

  // Step 2: Generate Cartesian product
  function cartesianProduct(arrays) {
    if (arrays.length === 0) return [[]]
    if (arrays.length === 1) return arrays[0].map(v => [v])

    const [first, ...rest] = arrays
    const restProduct = cartesianProduct(rest)

    const result = []
    first.forEach(firstVal => {
      restProduct.forEach(restCombo => {
        result.push([firstVal, ...restCombo])
      })
    })
    return result
  }

  const allCombinations = cartesianProduct(uniqueValuesByDepth)
  console.log('Total combinations:', allCombinations.length)

  // Step 3: Calculate rowspans for each cell
  const rows = allCombinations.map((combo, rowIdx) => {
    const rowspans = []

    // For each depth level
    for (let depthIdx = 0; depthIdx < depths.length; depthIdx++) {
      // Check if we should render this cell or if it's merged
      let shouldRender = true

      // If there's a previous row, check if it has the same values up to this depth
      if (rowIdx > 0) {
        const prevCombo = allCombinations[rowIdx - 1]
        // Check if all previous depth values match
        const allPreviousMatch = combo.slice(0, depthIdx).every((v, i) => v === prevCombo[i])

        if (allPreviousMatch) {
          shouldRender = false // Merged with previous row
        }
      }

      if (shouldRender) {
        // Calculate span: count how many following rows have the same values up to and including this depth
        let span = 1
        for (let nextIdx = rowIdx + 1; nextIdx < allCombinations.length; nextIdx++) {
          const nextCombo = allCombinations[nextIdx]
          const matches = combo.slice(0, depthIdx + 1).every((v, i) => v === nextCombo[i])
          if (matches) {
            span++
          } else {
            break
          }
        }
        rowspans[depthIdx] = span
      } else {
        rowspans[depthIdx] = 0 // Don't render (merged)
      }
    }

    // Find matching tasks
    const matchingTasks = tasks.filter(task =>
      combo.every((val, idx) => task[depths[idx].attribute] === val)
    )

    return {
      combo,
      rowspans,
      tasks: matchingTasks
    }
  })

  console.log('Generated rows:', rows.length)
  console.log('First row:', rows[0])

  return rows
}
