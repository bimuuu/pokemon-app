export type SortField = 'name' | 'power' | 'accuracy' | 'pp' | 'priority'
export type AbilitySortField = 'name' | 'generation'
export type SortOrder = 'asc' | 'desc'

export class SortUtils {
  static sortMoves<T extends Record<string, any>>(
    moves: T[], 
    sortBy: SortField, 
    sortOrder: SortOrder
  ): T[] {
    return [...moves].sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortBy) {
        case 'name':
          aValue = a.name?.toLowerCase() || ''
          bValue = b.name?.toLowerCase() || ''
          break
        case 'power':
          aValue = a.power || 0
          bValue = b.power || 0
          break
        case 'accuracy':
          aValue = a.accuracy || 0
          bValue = b.accuracy || 0
          break
        case 'pp':
          aValue = a.pp || 0
          bValue = b.pp || 0
          break
        case 'priority':
          aValue = a.priority || 0
          bValue = b.priority || 0
          break
        default:
          aValue = a.name?.toLowerCase() || ''
          bValue = b.name?.toLowerCase() || ''
      }

      if (typeof aValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      } else {
        return sortOrder === 'asc' 
          ? aValue - bValue
          : bValue - aValue
      }
    })
  }

  static sortAbilities<T extends Record<string, any>>(
    abilities: T[], 
    sortBy: AbilitySortField, 
    sortOrder: SortOrder
  ): T[] {
    return [...abilities].sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortBy) {
        case 'name':
          aValue = a.name?.toLowerCase() || ''
          bValue = b.name?.toLowerCase() || ''
          break
        case 'generation':
          aValue = a.generation?.name || ''
          bValue = b.generation?.name || ''
          break
        default:
          aValue = a.name?.toLowerCase() || ''
          bValue = b.name?.toLowerCase() || ''
      }

      if (typeof aValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      } else {
        return sortOrder === 'asc' 
          ? aValue - bValue
          : bValue - aValue
      }
    })
  }

  static handleSort<T>(
    currentField: SortField,
    newField: SortField,
    currentOrder: SortOrder
  ): { field: SortField; order: SortOrder } {
    if (currentField === newField) {
      return {
        field: newField,
        order: currentOrder === 'asc' ? 'desc' : 'asc'
      }
    } else {
      return {
        field: newField,
        order: 'asc'
      }
    }
  }

  static handleAbilitySort<T>(
    currentField: AbilitySortField,
    newField: AbilitySortField,
    currentOrder: SortOrder
  ): { field: AbilitySortField; order: SortOrder } {
    if (currentField === newField) {
      return {
        field: newField,
        order: currentOrder === 'asc' ? 'desc' : 'asc'
      }
    } else {
      return {
        field: newField,
        order: 'asc'
      }
    }
  }
}
