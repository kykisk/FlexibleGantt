import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { pageSizes } from '../constants/shapes'

// Export configuration as JSON
export const exportJSON = (data) => {
  const exportData = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    ...data
  }

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `flexiblegantt-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

// Import JSON file
export const importJSON = (file, callbacks) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result)

        // Restore all settings using callbacks
        if (data.summary && callbacks.setSummary) callbacks.setSummary(data.summary)
        if (data.timeline && callbacks.setTimeline) {
          callbacks.setTimeline(data.timeline)
        }
        if (data.structure && callbacks.setStructure) callbacks.setStructure(data.structure)
        if (data.attributes && callbacks.setAttributes) callbacks.setAttributes(data.attributes)
        if (data.taskShapes && callbacks.setTaskShapes) callbacks.setTaskShapes(data.taskShapes)
        if (data.tasks && callbacks.setTasks) callbacks.setTasks(data.tasks)
        if (data.memos && callbacks.setMemos) callbacks.setMemos(data) // 메모 복원

        resolve(data)
      } catch (err) {
        reject(err)
      }
    }
    reader.readAsText(file)
  })
}

// Export as PDF
export const exportPDF = async (options, elements) => {
  const { orientation, pageSize, fitToPage } = options

  const size = pageSizes[pageSize]
  const pdfWidth = orientation === 'landscape' ? size.height : size.width
  const pdfHeight = orientation === 'landscape' ? size.width : size.height

  const pdf = new jsPDF(orientation, 'mm', pageSize)

  let currentY = 10

  // Report Title
  pdf.setFontSize(16)
  pdf.setFont(undefined, 'bold')
  pdf.text('Report', 10, currentY)
  currentY += 10

  // Summary
  if (elements.summary) {
    pdf.setFontSize(10)
    pdf.setFont(undefined, 'bold')
    pdf.text('• Summary', 10, currentY)
    currentY += 5

    const boxHeight = 30
    pdf.setDrawColor(200)
    pdf.setFillColor(250, 250, 250)
    pdf.rect(10, currentY, pdfWidth - 20, boxHeight, 'FD')

    pdf.setFontSize(9)
    pdf.setFont(undefined, 'normal')
    const lines = pdf.splitTextToSize(elements.summary, pdfWidth - 30)
    pdf.text(lines.slice(0, 4), 15, currentY + 5)
    currentY += boxHeight + 10
  }

  // Gantt
  pdf.setFontSize(10)
  pdf.setFont(undefined, 'bold')
  pdf.text('• Gantt', 10, currentY)
  currentY += 5

  if (elements.gantt) {
    const ganttCanvas = await html2canvas(elements.gantt, {
      scale: 2,
      width: elements.gantt.scrollWidth,
      windowWidth: elements.gantt.scrollWidth
    })
    const ganttImg = ganttCanvas.toDataURL('image/png')

    const availableHeight = pdfHeight - currentY - 10
    let ganttWidth = pdfWidth - 20
    let ganttHeight = (ganttCanvas.height * ganttWidth) / ganttCanvas.width

    if (fitToPage) {
      if (ganttHeight > availableHeight) {
        ganttHeight = availableHeight
        ganttWidth = (ganttCanvas.width * ganttHeight) / ganttCanvas.height
      }
      if (ganttWidth < pdfWidth - 20) {
        const scale = (pdfWidth - 20) / ganttWidth
        ganttWidth = pdfWidth - 20
        ganttHeight = ganttHeight * scale
      }
    }

    pdf.addImage(ganttImg, 'PNG', 10, currentY, ganttWidth, ganttHeight)
  }

  pdf.save(`flexiblegantt-${new Date().toISOString().split('T')[0]}.pdf`)
}
