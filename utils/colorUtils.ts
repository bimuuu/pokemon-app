import { getTypeColor } from '@/lib/utils'

export class ColorUtils {
  static getDamageClassColor(damageClass: string): string {
    const colors: Record<string, string> = {
      physical: 'bg-red-500',
      special: 'bg-blue-500',
      status: 'bg-gray-500'
    }
    return colors[damageClass] || 'bg-gray-400'
  }

  static getAccuracyColor(accuracy: number): string {
    if (accuracy >= 90) return 'text-green-600'
    if (accuracy >= 75) return 'text-yellow-600'
    return 'text-red-600'
  }

  static getPowerColor(power: number | null): string {
    if (!power) return 'text-gray-500'
    if (power >= 120) return 'text-red-600'
    if (power >= 80) return 'text-orange-600'
    if (power >= 60) return 'text-yellow-600'
    return 'text-green-600'
  }

  static getPriorityColor(priority: number): string {
    if (priority > 0) return 'text-green-600 font-bold'
    if (priority < 0) return 'text-red-600 font-bold'
    return 'text-gray-500'
  }

  static getGenerationColor(generation: string): string {
    const colors: Record<string, string> = {
      'generation-i': '#ef4444',
      'generation-ii': '#3b82f6',
      'generation-iii': '#10b981',
      'generation-iv': '#8b5cf6',
      'generation-v': '#eab308',
      'generation-vi': '#ec4899',
      'generation-vii': '#06b6d4',
      'generation-viii': '#f97316',
      'generation-ix': '#6366f1'
    }
    return colors[generation] || '#6b7280'
  }

  static getTypeBadgeStyle(type: string): React.CSSProperties {
    return {
      backgroundColor: getTypeColor(type)
    }
  }
}
