export const POKEMON_TYPES = [
  'all', 'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
] as const

export const ITEMS_PER_PAGE = 24

export class FilterUtils {
  static filterMoves(
    moves: any[], 
    searchTerm: string, 
    selectedType: string
  ): any[] {
    return moves.filter((move: any) => {
      const matchesSearch = move.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = selectedType === 'all' || move.type?.name === selectedType
      return matchesSearch && matchesType
    })
  }

  static filterAbilities(
    abilities: any[], 
    searchTerm: string, 
    selectedGeneration: string
  ): any[] {
    return abilities.filter((ability: any) => {
      const matchesSearch = ability.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesGeneration = selectedGeneration === 'all' || ability.generation?.name === selectedGeneration
      return matchesSearch && matchesGeneration
    })
  }

  static filterItems(
    items: any[], 
    searchTerm: string, 
    selectedCategory: string
  ): any[] {
    return items.filter((item: any) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
      
      let matchesCategory = true
      if (selectedCategory !== 'all') {
        // Check if item has the category in its attributes or category field
        const itemCategory = item.category?.name
        const itemAttributes = item.attributes?.map((attr: any) => attr.name) || []
        
        matchesCategory = itemCategory === selectedCategory || 
                         itemAttributes.includes(selectedCategory) ||
                         (selectedCategory === 'holdable' && itemAttributes.includes('holdable')) ||
                         (selectedCategory === 'holdable-active' && itemAttributes.includes('holdable-active'))
      }
      
      return matchesSearch && matchesCategory
    })
  }

  static paginateMoves<T>(moves: T[], page: number, itemsPerPage: number): T[] {
    const startIndex = (page - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return moves.slice(startIndex, endIndex)
  }

  static paginateAbilities<T>(abilities: T[], page: number, itemsPerPage: number): T[] {
    const startIndex = (page - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return abilities.slice(startIndex, endIndex)
  }

  static paginateItems<T>(items: T[], page: number, itemsPerPage: number): T[] {
    const startIndex = (page - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return items.slice(startIndex, endIndex)
  }

  static getTotalPages(totalItems: number, itemsPerPage: number): number {
    return Math.ceil(totalItems / itemsPerPage)
  }
}
