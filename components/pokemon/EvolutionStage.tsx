import Link from 'next/link'
import { formatPokemonName } from '@/lib/utils'

interface EvolutionStageProps {
  evolution: any
  currentPokemonName?: string
  isLast?: boolean
}

export function EvolutionStage({ evolution, currentPokemonName, isLast = false }: EvolutionStageProps) {
  const isCurrentPokemon = evolution.species.name === currentPokemonName
  const pokemonId = evolution.species.url.split('/')[6]
  const hasMultipleEvolutions = evolution.evolves_to.length > 1

  const getEvolutionCondition = (details: any[]) => {
    if (!details || details.length === 0) return null
    const detail = details[0]
    
    if (detail.min_level) return `Level ${detail.min_level}` 
    if (detail.item) return formatPokemonName(detail.item.name.replace('-', ' '))
    if (detail.trigger?.name === 'trade') {
      return detail.trade_species ? `Trade with ${formatPokemonName(detail.trade_species.name)}` : 'Trade'
    }
    return detail.trigger?.name || 'Unknown'
  }

  return (
    <div className="flex flex-col items-center">
      {/* Pokemon Card */}
      <div className={`text-center ${isCurrentPokemon ? 'ring-2 ring-blue-500 rounded-lg p-3 bg-blue-50' : 'p-3'}`}>
        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
          <img 
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`}
            alt={evolution.species.name}
            className="w-16 h-16 object-contain"
          />
        </div>
        <p className={`text-sm font-medium ${isCurrentPokemon ? 'text-blue-600' : ''}`}>
          {formatPokemonName(evolution.species.name)}
          {isCurrentPokemon && (
            <span className="block text-xs text-blue-500 font-normal">Current</span>
          )}
        </p>
        {!isCurrentPokemon && (
          <Link 
            href={`/pokemon/${evolution.species.name}`}
            className="block text-xs text-blue-500 hover:text-blue-700 hover:underline mt-1"
          >
            View Details
          </Link>
        )}
      </div>
      
      {/* Evolution Path */}
      {evolution.evolves_to.length > 0 && !isLast && (
        <div className="mt-4 flex flex-col items-center">
          {/* Arrow */}
          <div className="text-gray-400 text-2xl mb-2">↓</div>
          
          {/* Evolution Conditions */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {evolution.evolves_to.map((evo: any, index: number) => {
              const condition = getEvolutionCondition(evo.evolution_details)
              return (
                <div key={index} className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
                  {condition}
                </div>
              )
            })}
          </div>
          
          {/* Branch Layout */}
          {hasMultipleEvolutions ? (
            // Multiple evolutions - side by side
            <div className="flex justify-center space-x-8">
              {evolution.evolves_to.map((evo: any, index: number) => (
                <div key={index} className="flex flex-col items-center">
                  <EvolutionStage 
                    evolution={evo} 
                    currentPokemonName={currentPokemonName}
                    isLast={evo.evolves_to.length === 0}
                  />
                </div>
              ))}
            </div>
          ) : (
            // Single evolution - centered
            <div className="flex justify-center">
              {evolution.evolves_to.map((evo: any, index: number) => (
                <EvolutionStage 
                  key={index} 
                  evolution={evo} 
                  currentPokemonName={currentPokemonName}
                  isLast={evo.evolves_to.length === 0}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
