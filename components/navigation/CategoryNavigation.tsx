'use client'

import Link from 'next/link'
import { pokemonCategories } from '@/data/pokemonCategories'

export function CategoryNavigation() {
  const categoryRoutes = [
    { key: 'mythical', path: '/categories/mythical', color: 'blue' },
    { key: 'legendary', path: '/categories/legendary', color: 'red' },
    { key: 'pseudoLegendary', path: '/categories/pseudo-legendary', color: 'purple' },
    { key: 'firstPartner', path: '/categories/first-partner', color: 'green' },
    { key: 'paradox', path: '/categories/paradox', color: 'indigo' },
    { key: 'fossil', path: '/categories/fossil', color: 'amber' },
    { key: 'ultraBeast', path: '/categories/ultra-beast', color: 'purple' }
  ]

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; hover: string; text: string }> = {
      blue: { bg: 'bg-blue-100', hover: 'hover:bg-blue-200', text: 'text-blue-800' },
      red: { bg: 'bg-red-100', hover: 'hover:bg-red-200', text: 'text-red-800' },
      purple: { bg: 'bg-purple-100', hover: 'hover:bg-purple-200', text: 'text-purple-800' },
      green: { bg: 'bg-green-100', hover: 'hover:bg-green-200', text: 'text-green-800' },
      indigo: { bg: 'bg-indigo-100', hover: 'hover:bg-indigo-200', text: 'text-indigo-800' },
      amber: { bg: 'bg-amber-100', hover: 'hover:bg-amber-200', text: 'text-amber-800' }
    }
    return colors[color] || colors.blue
  }

  return (
    <nav className="bg-white p-4 rounded-lg shadow-sm border">
      <h2 className="text-lg font-semibold mb-3 text-gray-900">Pokémon Categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {categoryRoutes.map((route) => {
          const category = pokemonCategories[route.key]
          const colorClasses = getColorClasses(route.color)
          const pokemonCount = category.subcategories 
            ? category.subcategories.reduce((total, sub) => total + sub.pokemon.length, 0)
            : category.pokemon?.length || 0

          return (
            <Link
              key={route.key}
              href={route.path}
              className={`
                ${colorClasses.bg} ${colorClasses.hover} ${colorClasses.text}
                p-3 rounded-lg transition-colors duration-200 text-center
                border border-gray-200 hover:shadow-md
              `}
            >
              <div className="text-sm font-medium mb-1">
                {category.name}
              </div>
              <div className="text-xs opacity-75">
                {pokemonCount} Pokémon
              </div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
