'use client'

import { PokemonCategory } from '@/data/pokemonCategories'

interface CategoryHeaderProps {
  category: PokemonCategory
  totalCount?: number
}

export function CategoryHeader({ category, totalCount }: CategoryHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-lg border border-gray-600 mb-6">
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold text-white mb-3">{category.name}</h1>
        <p className="text-gray-300 mb-4">{category.description}</p>
        {totalCount && (
          <div className="flex items-center gap-4 text-sm text-gray-300">
            <span className="bg-gray-700 px-3 py-1 rounded-full border border-gray-600">
              {totalCount} Pokémon
            </span>
            {category.subcategories && (
              <span className="bg-gray-700 px-3 py-1 rounded-full border border-gray-600">
                {category.subcategories.length} Subcategories
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
