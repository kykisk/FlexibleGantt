import { useState, useEffect } from 'react'

// Simple rich text editor fallback (no external dependencies)
function RichTextEditor({ value, onChange }) {
  const [content, setContent] = useState(value || '')

  // Update content when value prop changes (for Import)
  useEffect(() => {
    setContent(value || '')
  }, [value])

  const handleChange = (e) => {
    const newValue = e.target.value
    setContent(newValue)
    if (onChange) onChange(newValue)
  }

  const applyFormat = (format) => {
    const textarea = document.getElementById('summary-editor')
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)

    if (!selectedText) return

    let formattedText = ''
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`
        break
      case 'italic':
        formattedText = `*${selectedText}*`
        break
      case 'underline':
        formattedText = `__${selectedText}__`
        break
      case 'bullet':
        formattedText = `\n• ${selectedText}`
        break
      default:
        return
    }

    const newContent = content.substring(0, start) + formattedText + content.substring(end)
    setContent(newContent)
    if (onChange) onChange(newContent)
  }

  return (
    <div className="border border-gray-300 rounded">
      {/* Toolbar */}
      <div className="flex gap-2 p-2 border-b border-gray-300 bg-gray-50">
        <button
          onClick={() => applyFormat('bold')}
          className="px-3 py-1 text-sm font-bold border border-gray-300 rounded hover:bg-gray-200"
          title="Bold"
        >
          B
        </button>
        <button
          onClick={() => applyFormat('italic')}
          className="px-3 py-1 text-sm italic border border-gray-300 rounded hover:bg-gray-200"
          title="Italic"
        >
          I
        </button>
        <button
          onClick={() => applyFormat('underline')}
          className="px-3 py-1 text-sm underline border border-gray-300 rounded hover:bg-gray-200"
          title="Underline"
        >
          U
        </button>
        <button
          onClick={() => applyFormat('bullet')}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200"
          title="Bullet List"
        >
          •
        </button>
      </div>

      {/* Editor */}
      <textarea
        id="summary-editor"
        value={content}
        onChange={handleChange}
        className="w-full p-4 resize-none focus:outline-none"
        style={{ minHeight: '200px' }}
        placeholder="리포트 요약을 작성하세요..."
      />
    </div>
  )
}

export default RichTextEditor
