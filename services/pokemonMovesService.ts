import { normalizePokemonName } from '@/lib/pokemon-api'

export interface PokemonMove {
  move: {
    name: string
    url: string
  }
  version_group_details: Array<{
    level_learned_at: number
    move_learn_method: {
      name: string
      url: string
    }
    version_group: {
      name: string
      url: string
    }
  }>
}

export interface MoveLearnMethod {
  name: string
  level?: number
  method: string
}

export class PokemonMovesService {
  static async fetchPokemonMoves(pokemonName: string): Promise<PokemonMove[]> {
    try {
      const normalizedName = normalizePokemonName(pokemonName)
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${normalizedName}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch Pokemon moves: ${response.statusText}`)
      }
      
      const data = await response.json()
      return data.moves || []
    } catch (error) {
      console.error('Error fetching Pokemon moves:', error)
      return []
    }
  }

  static processMovesByMethod(moves: PokemonMove[]): {
    levelUp: MoveLearnMethod[]
    tm: MoveLearnMethod[]
    egg: MoveLearnMethod[]
    tutor: MoveLearnMethod[]
    other: MoveLearnMethod[]
  } {
    const levelUp: MoveLearnMethod[] = []
    const tm: MoveLearnMethod[] = []
    const egg: MoveLearnMethod[] = []
    const tutor: MoveLearnMethod[] = []
    const other: MoveLearnMethod[] = []

    moves.forEach(moveData => {
      // Find the most recent version group data (usually the latest games)
      const sortedDetails = moveData.version_group_details.sort((a, b) => {
        // Prioritize latest versions (sword/shield, scarlet/violet)
        const versionOrder = ['scarlet-violet', 'sword-shield', 'lets-go-pikachu-eevee', 'ultra-sun-ultra-moon', 'sun-moon', 'omega-ruby-alpha-sapphire', 'x-y', 'black-2-white-2', 'black-white', 'heartgold-soulsilver', 'platinum', 'diamond-pearl']
        const aIndex = versionOrder.indexOf(a.version_group.name)
        const bIndex = versionOrder.indexOf(b.version_group.name)
        return (bIndex === -1 ? 999 : bIndex) - (aIndex === -1 ? 999 : aIndex)
      })

      const latestDetail = sortedDetails[0]
      const methodName = latestDetail.move_learn_method.name

      const moveInfo: MoveLearnMethod = {
        name: moveData.move.name.replace('-', ' '),
        method: methodName,
        level: latestDetail.level_learned_at || undefined
      }

      switch (methodName) {
        case 'level-up':
          if (moveInfo.level !== undefined) {
            levelUp.push(moveInfo)
          }
          break
        case 'machine':
          tm.push(moveInfo)
          break
        case 'egg':
          egg.push(moveInfo)
          break
        case 'tutor':
          tutor.push(moveInfo)
          break
        default:
          other.push(moveInfo)
          break
      }
    })

    // Sort level-up moves by level
    levelUp.sort((a, b) => (a.level || 0) - (b.level || 0))

    // Sort others alphabetically
    const sortAlphabetically = (a: MoveLearnMethod, b: MoveLearnMethod) => 
      a.name.localeCompare(b.name)

    tm.sort(sortAlphabetically)
    egg.sort(sortAlphabetically)
    tutor.sort(sortAlphabetically)
    other.sort(sortAlphabetically)

    return {
      levelUp,
      tm,
      egg,
      tutor,
      other
    }
  }

  static getMethodDisplayName(method: string): string {
    const methodNames: Record<string, string> = {
      'level-up': 'Level Up',
      'machine': 'TM',
      'egg': 'Egg',
      'tutor': 'Tutor',
      'other': 'Other'
    }
    return methodNames[method] || method
  }

  static getMethodIcon(method: string): string {
    const icons: Record<string, string> = {
      'level-up': '📈',
      'machine': '💿',
      'egg': '🥚',
      'tutor': '👨‍🏫',
      'other': '⭐'
    }
    return icons[method] || '❓'
  }
}
