// Rarity colors matching constants
const RARITY_COLORS = {
  'Common': '#22c55e',
  'Uncommon': '#84cc16', 
  'Rare': '#eab308',
  'Ultra-Rare': '#f97316',
  'Legendary': '#ef4444'
} as const

interface RarityBadgeProps {
  rarity: string
  className?: string
}

export function RarityBadge({ rarity, className = "" }: RarityBadgeProps) {
  const color = RARITY_COLORS[rarity as keyof typeof RARITY_COLORS] || '#6b7280'
  
  return (
    <div 
      className={`text-[10px] font-bold px-2 py-1 rounded-full text-white leading-tight whitespace-nowrap ${className}`}
      style={{ backgroundColor: color }}
    >
      {rarity}
    </div>
  )
}
