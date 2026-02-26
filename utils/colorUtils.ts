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

  static getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
      'holdable': '#10b981',
      'holdable-active': '#ef4444',
      'berries': '#f97316',
      'medicine': '#3b82f6',
      'all-medicine': '#3b82f6',
      'healing': '#10b981',
      'status': '#8b5cf6',
      'spreads': '#eab308',
      'other': '#ec4899',
      'balls': '#06b6d4',
      'all-balls': '#06b6d4',
      'regular-balls': '#f97316',
      'super-balls': '#6366f1',
      'hyper-balls': '#84cc16',
      'master-balls': '#f59e0b',
      'other-balls': '#a855f7',
      'battle-items': '#ef4444',
      'all-battle': '#ef4444',
      'stat-boosts': '#3b82f6',
      'in-a-pinch': '#10b981',
      'type-enhancement': '#8b5cf6',
      'miscellaneous': '#eab308',
      'items': '#ec4899',
      'all-items': '#ec4899',
      'collectibles': '#06b6d4',
      'evolution': '#f97316',
      'spelunking': '#6366f1',
      'treasure': '#84cc16',
      'apricorn-box': '#f59e0b',
      'apricorn-balls': '#a855f7',
      'data-cards': '#ef4444',
      'jewels': '#3b82f6',
      'mega-stones': '#10b981',
      'z-crystals': '#8b5cf6',
      'plates': '#eab308',
      'species-specific': '#ec4899',
      'type-specific': '#06b6d4',
      'game-specific': '#f97316',
      'unused': '#6b7280',
      'dynamax-crystals': '#6366f1',
      'tera-shard': '#84cc16',
      'curry-ingredients': '#f59e0b',
      'feathers': '#a855f7',
      'flutes': '#ef4444',
      'sweets': '#3b82f6',
      'memory': '#10b981',
      'catching-gear': '#8b5cf6',
      'form-changers': '#eab308',
      'evolutionary': '#ec4899',
      'key-items': '#06b6d4',
      'vitamins': '#f97316',
      'exchangeable': '#84cc16',
      'update': '#f59e0b',
      'none': '#6b7280',
      'effort-training': '#a855f7',
      'training': '#ef4444',
      'choice': '#3b82f6',
      'life-orb': '#10b981',
      'type-protection': '#8b5cf6',
      'type-enhancing': '#eab308',
      'scarves': '#ec4899',
      'badges': '#06b6d4',
      'contest': '#f97316',
      'mail': '#6366f1',
      'mulch': '#84cc16',
      'fossils': '#f59e0b',
      'miracle-shooter': '#a855f7',
      'species-candies': '#ef4444',
      'nature-mints': '#3b82f6',
      'td-items': '#10b981',
      'ability-capsules': '#8b5cf6',
      'tms': '#eab308',
      'trs': '#ec4899'
    }
    return colors[category] || '#6b7280'
  }
}
