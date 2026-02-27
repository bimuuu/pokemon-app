import React from 'react'
import { Sword, Target, TrendingUp, Shield, Heart, Cloud, Mountain, Zap, Star, Package } from 'lucide-react'
import { EVSpread } from '@/types/pokemon'

// Move-related utilities
export const getLearnMethodIcon = (method: string) => {
  const icons: Record<string, string> = {
    'level-up': '📈',
    'machine': '💿',
    'egg': '🥚',
    'tutor': '👨‍🏫',
    'other': '⭐'
  }
  return icons[method] || '❓'
}

export const getMoveCategoryColor = (category: string) => {
  const colors = {
    attacking: 'bg-red-500',
    buff: 'bg-green-500',
    debuff: 'bg-purple-500',
    support: 'bg-blue-500',
    recovery: 'bg-pink-500',
    weather: 'bg-yellow-500',
    terrain: 'bg-orange-500'
  }
  return colors[category as keyof typeof colors] || 'bg-gray-500'
}

export const getMoveCategoryIcon = (category: string) => {
  const icons = {
    attacking: Sword,
    buff: TrendingUp,
    debuff: Target,
    support: Shield,
    recovery: Heart,
    weather: Cloud,
    terrain: Mountain
  }
  return icons[category as keyof typeof icons] || Target
}

export const getMoveCategoryLabel = (category: string) => {
  const labels = {
    attacking: 'Attack',
    buff: 'Buff',
    debuff: 'Debuff',
    support: 'Support',
    recovery: 'Recovery',
    weather: 'Weather',
    terrain: 'Terrain'
  }
  return labels[category as keyof typeof labels] || category
}

export const getLearnMethodColor = (method: string) => {
  const colors: Record<string, string> = {
    'level-up': 'bg-green-100 text-green-800',
    'machine': 'bg-blue-100 text-blue-800',
    'egg': 'bg-pink-100 text-pink-800',
    'tutor': 'bg-purple-100 text-purple-800',
    'other': 'bg-gray-100 text-gray-800'
  }
  return colors[method] || 'bg-gray-100 text-gray-800'
}

// Item-related utilities
export const getCategoryIcon = (category: string) => {
  const icons: Record<string, React.ReactNode> = {
    'mega-stone': React.createElement(Zap, { className: "h-4 w-4 text-orange-500" }),
    'plate': React.createElement(Star, { className: "h-4 w-4 text-purple-500" }),
    'choice-item': React.createElement(Sword, { className: "h-4 w-4 text-red-500" }),
    'offensive-item': React.createElement(Zap, { className: "h-4 w-4 text-blue-500" }),
    'defensive-item': React.createElement(Shield, { className: "h-4 w-4 text-green-500" }),
    'recovery-item': React.createElement(Package, { className: "h-4 w-4 text-teal-500" }),
    'resist-berry': React.createElement(Package, { className: "h-4 w-4 text-pink-500" }),
    'survival-item': React.createElement(Shield, { className: "h-4 w-4 text-yellow-500" })
  }
  return icons[category] || React.createElement(Package, { className: "h-4 w-4 text-gray-500" })
}

export const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'mega-stone': 'bg-orange-100 text-orange-800 border-orange-200',
    'plate': 'bg-purple-100 text-purple-800 border-purple-200',
    'choice-item': 'bg-red-100 text-red-800 border-red-200',
    'offensive-item': 'bg-blue-100 text-blue-800 border-blue-200',
    'defensive-item': 'bg-green-100 text-green-800 border-green-200',
    'recovery-item': 'bg-teal-100 text-teal-800 border-teal-200',
    'resist-berry': 'bg-pink-100 text-pink-800 border-pink-200',
    'survival-item': 'bg-yellow-100 text-yellow-800 border-yellow-200'
  }
  return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200'
}

export const getEffectivenessColor = (value: number) => {
  if (value >= 90) return 'text-green-600'
  if (value >= 75) return 'text-blue-600'
  if (value >= 60) return 'text-yellow-600'
  return 'text-gray-600'
}

// EV-related utilities
export const getStatColor = (stat: keyof EVSpread, value: number) => {
  if (value === 0) return 'text-gray-400'
  if (value <= 50) return 'text-blue-600'
  if (value <= 100) return 'text-green-600'
  if (value <= 200) return 'text-yellow-600'
  return 'text-red-600'
}

export const getTotalEVs = (spread: EVSpread) => {
  return Object.values(spread).reduce((total, ev) => total + ev, 0)
}

export const getRemainingEVs = (spread: EVSpread) => {
  return 510 - getTotalEVs(spread)
}

export const isValidSpread = (spread: EVSpread) => {
  const total = getTotalEVs(spread)
  const allValid = Object.values(spread).every(ev => ev >= 0 && ev <= 252 && ev % 4 === 0)
  return total <= 510 && allValid
}
