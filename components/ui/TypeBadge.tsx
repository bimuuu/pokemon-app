import { getTypeColor } from '@/lib/utils'
import { useLanguage } from '@/contexts/LanguageContext'

interface TypeBadgeProps {
  type: string
  className?: string
}

export function TypeBadge({ type, className = '' }: TypeBadgeProps) {
  const { t } = useLanguage()
  const color = getTypeColor(type)
  
  return (
    <span 
      className={`type-badge ${className}`}
      style={{ backgroundColor: color }}
    >
      {t(`types.${type}`)}
    </span>
  )
}
