'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { pokemonCategories } from '@/data/pokemonCategories'
import { CategoryHeader } from '@/components/pokemon/CategoryHeader'
import { CategoriesLoadingSkeleton } from '@/components/loading/CategoriesLoadingSkeleton'

export default function CategoriesPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time for demonstration
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <CategoriesLoadingSkeleton />
  }
  const categoryRoutes = [
    { key: 'firstPartner', path: '/categories/first-partner', color: 'green', icon: '🌱' },
    { key: 'pseudoLegendary', path: '/categories/pseudo-legendary', color: 'purple', icon: '�' },
    { key: 'legendary', path: '/categories/legendary', color: 'red', icon: '�' },
    { key: 'mythical', path: '/categories/mythical', color: 'blue', icon: '✨' },
    { key: 'ultraBeast', path: '/categories/ultra-beast', color: 'purple', icon: '🌌' },
    { key: 'fossil', path: '/categories/fossil', color: 'amber', icon: '🦴' },
    { key: 'paradox', path: '/categories/paradox', color: 'indigo', icon: '⏰' }
  ]

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; hover: string; text: string; border: string }> = {
      blue: { bg: 'bg-blue-50', hover: 'hover:bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
      red: { bg: 'bg-red-50', hover: 'hover:bg-red-100', text: 'text-red-800', border: 'border-red-200' },
      purple: { bg: 'bg-purple-50', hover: 'hover:bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
      green: { bg: 'bg-green-50', hover: 'hover:bg-green-100', text: 'text-green-800', border: 'border-green-200' },
      indigo: { bg: 'bg-indigo-50', hover: 'hover:bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200' },
      amber: { bg: 'bg-gray-800', hover: 'hover:bg-gray-700', text: 'text-gray-100', border: 'border-gray-600' }
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-white-900">Pokémon Categories</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Explore Pokémon by their special classifications and unique characteristics. 
          Each category contains Pokémon with similar traits, origins, or roles in the Pokémon world.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                ${colorClasses.bg} ${colorClasses.hover} ${colorClasses.border}
                p-6 rounded-xl transition-all duration-300 text-center
                border-2 hover:shadow-lg hover:scale-105 group
              `}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                {route.icon}
              </div>
              <h3 className={`text-xl font-bold mb-2 ${colorClasses.text}`}>
                {category.name}
              </h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {category.description}
              </p>
              <div className="flex justify-between items-center text-sm">
                <span className={`font-medium ${colorClasses.text}`}>
                  {pokemonCount} Pokémon
                </span>
                {category.subcategories && (
                  <span className="text-gray-500">
                    {category.subcategories.length} Groups
                  </span>
                )}
              </div>
            </Link>
          )
        })}
      </div>

      <div className="bg-gray-50 p-6 rounded-lg border">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Category Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">📍 How to Use</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Click on any category to explore Pokémon</li>
              <li>• Use filters to narrow down by generation or type</li>
              <li>• View detailed information for each Pokémon</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">🎯 Quick Access</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Navigate from the main menu dropdown</li>
              <li>• Use the category cards on the home page</li>
              <li>• Bookmark your favorite categories</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
