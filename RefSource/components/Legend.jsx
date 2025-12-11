import { availableAttributes } from '../constants/attributes'

function Legend({ taskConfig }) {
  return (
    <div className="p-3 border-b border-gray-300 bg-gray-50">
      <div className="flex justify-end">
        <div className="border-2 border-dashed border-gray-400 rounded-lg p-3 bg-white">
          <div className="flex items-center gap-6">
            <span className="text-xs font-semibold text-gray-600">범례:</span>

            {/* Gantt Bar */}
            <div>
              <div
                className="border border-gray-400 relative"
                style={{
                  width: '80px',
                  height: '32px',
                  backgroundColor: '#93C5FD',
                  clipPath: 'polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)'
                }}
              >
                {taskConfig.ganttAttributes.slice(0, 3).map((attr, idx) => (
                  <div key={attr} className="absolute bg-white border border-gray-400 px-1 rounded" style={{
                    left: '8%',
                    top: `${25 + idx * 30}%`,
                    fontSize: '6px',
                    transform: 'translateY(-50%)'
                  }}>
                    {availableAttributes.find(a => a.value === attr)?.label.slice(0, 4)}
                  </div>
                ))}
              </div>
            </div>

            {/* Circle */}
            <div className="flex items-center gap-1">
              <div
                className="border border-gray-400 flex items-center justify-center"
                style={{
                  width: '28px',
                  height: '28px',
                  backgroundColor: '#93C5FD',
                  clipPath: 'circle(50% at 50% 50%)',
                  fontSize: '6px'
                }}
              >
                ①
              </div>
              <div className="flex flex-col gap-1" style={{ fontSize: '6px' }}>
                <div>②</div>
                <div>③</div>
                <div>④</div>
              </div>
            </div>

            {/* Rectangle */}
            <div>
              <div
                className="border border-gray-400 relative"
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#93C5FD'
                }}
              >
                {[
                  { x: '50%', y: '50%' },
                  { x: '20%', y: '20%' },
                  { x: '80%', y: '20%' },
                  { x: '20%', y: '80%' },
                  { x: '80%', y: '80%' }
                ].map((pos, idx) => (
                  <div
                    key={idx}
                    className="absolute text-gray-800"
                    style={{
                      left: pos.x,
                      top: pos.y,
                      transform: 'translate(-50%, -50%)',
                      fontSize: '7px',
                      fontWeight: 'bold'
                    }}
                  >
                    {idx + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Legend
