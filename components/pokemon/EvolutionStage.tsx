import Link from 'next/link'
import { formatPokemonName } from '@/lib/utils'
import { parseEvolutionConditions, type ParsedEvolutionCondition } from '@/lib/evolution-utils'

interface EvolutionStageProps {
  evolution: any
  currentPokemonName?: string
  isLast?: boolean
}

export function EvolutionStage({ evolution, currentPokemonName, isLast = false }: EvolutionStageProps) {
  const isCurrentPokemon = evolution.species.name === currentPokemonName
  const pokemonId = evolution.species.url.split('/')[6]
  const hasMultipleEvolutions = evolution.evolves_to.length > 1

  const getEvolutionConditions = (details: any[], pokemonName?: string): ParsedEvolutionCondition[] => {
    return parseEvolutionConditions(details, pokemonName)
  }

  return (
    <div className="flex flex-row items-center">
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
        <div className="ml-4 flex flex-row items-center">
          {/* Arrow */}
          <div className="text-gray-400 text-2xl mr-4">→</div>
          
          {/* Evolution Conditions */}
          <div className="flex flex-wrap justify-center gap-2 mr-4 max-w-md">
            {evolution.evolves_to.map((evo: any, index: number) => {
              const conditions = getEvolutionConditions(evo.evolution_details, evo.species.name)
              if (conditions.length === 0) return null
              
              return (
                <div key={index} className="flex flex-wrap justify-center gap-1">
                  {conditions.map((condition, condIndex) => (
                    <div 
                      key={condIndex} 
                      className="text-xs text-gray-200 bg-gray-800 border border-gray-600 px-3 py-1.5 rounded-full whitespace-nowrap font-medium shadow-sm"
                    >
                      {condition.icon} {condition.description}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
          
          {/* Branch Layout */}
          {hasMultipleEvolutions ? (
            // Multiple evolutions - stacked vertically with horizontal arrow
            <div className="flex flex-col space-y-4">
              {evolution.evolves_to.map((evo: any, index: number) => (
                <div key={index} className="flex flex-row items-center">
                  <EvolutionStage 
                    evolution={evo} 
                    currentPokemonName={currentPokemonName}
                    isLast={evo.evolves_to.length === 0}
                  />
                </div>
              ))}
            </div>
          ) : (
            // Single evolution - same row
            <div className="flex flex-row items-center">
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
