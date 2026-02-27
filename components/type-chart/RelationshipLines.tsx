'use client'

interface TypeMatchup {
  type: string
  effectiveness: number
}

interface TypePositions {
  [key: string]: { x: number; y: number }
}

interface RelationshipLinesProps {
  selectedTypes: string[]
  typePositions: TypePositions
  offensiveMatchups: TypeMatchup[]
  defensiveMatchups: TypeMatchup[]
  getLineColor: (multiplier: number) => string
  getLineWidth: (multiplier: number) => number
  getEffectivenessText: (multiplier: number) => string
}

export default function RelationshipLines({
  selectedTypes,
  typePositions,
  offensiveMatchups,
  defensiveMatchups,
  getLineColor,
  getLineWidth,
  getEffectivenessText
}: RelationshipLinesProps) {
  if (selectedTypes.length === 0 || !selectedTypes.every(type => typePositions[type])) return null

  return (
    <svg 
      className="absolute inset-0 pointer-events-none z-10"
      style={{ width: '100%', height: '100%' }}
    >
      {/* Offensive lines - solid */}
      {offensiveMatchups.map(({ type, effectiveness }) => {
        const targetPos = typePositions[type]
        
        if (!targetPos) return null

        return selectedTypes.map((selectedType, index) => {
          const sourcePos = typePositions[selectedType]
          if (!sourcePos) return null

          return (
            <g key={`offensive-${type}-${index}`}>
              <line
                x1={sourcePos.x}
                y1={sourcePos.y}
                x2={targetPos.x}
                y2={targetPos.y}
                stroke={getLineColor(effectiveness)}
                strokeWidth={getLineWidth(effectiveness)}
                strokeDasharray={effectiveness === 0 ? '5,5' : ''}
                opacity={effectiveness === 1 ? 0.2 : 0.6}
                className="animate-drawLine"
                style={{
                  animation: `drawLine 0.5s ease-out ${index * 0.1}s both`,
                }}
              />
              {effectiveness !== 1 && index === 0 && (
                <text
                  x={(sourcePos.x + targetPos.x) / 2}
                  y={(sourcePos.y + targetPos.y) / 2 - 8}
                  fill="white"
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                  className="drop-shadow-lg animate-fadeIn"
                  style={{
                    animation: `fadeIn 0.3s ease-out ${0.5 + index * 0.1}s both`,
                  }}
                >
                  {getEffectivenessText(effectiveness)}
                </text>
              )}
            </g>
          )
        })
      })}

      {/* Defensive lines - dashed */}
      {defensiveMatchups.map(({ type, effectiveness }) => {
        const targetPos = typePositions[type]
        
        if (!targetPos) return null

        return selectedTypes.map((selectedType, index) => {
          const sourcePos = typePositions[selectedType]
          if (!sourcePos) return null

          return (
            <g key={`defensive-${type}-${index}`}>
              <line
                x1={sourcePos.x}
                y1={sourcePos.y}
                x2={targetPos.x}
                y2={targetPos.y}
                stroke={getLineColor(effectiveness)}
                strokeWidth={Math.max(1, getLineWidth(effectiveness) - 1)}
                strokeDasharray="3,3"
                opacity={effectiveness === 1 ? 0.15 : 0.4}
                className="animate-drawLine"
                style={{
                  animation: `drawLine 0.5s ease-out ${0.3 + index * 0.1}s both`,
                }}
              />
              {effectiveness !== 1 && index === 0 && (
                <text
                  x={(sourcePos.x + targetPos.x) / 2}
                  y={(sourcePos.y + targetPos.y) / 2 + 8}
                  fill="white"
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                  className="drop-shadow-lg animate-fadeIn"
                  style={{
                    animation: `fadeIn 0.3s ease-out ${0.8 + index * 0.1}s both`,
                  }}
                >
                  {getEffectivenessText(effectiveness)}
                </text>
              )}
            </g>
          )
        })
      })}
    </svg>
  )
}
