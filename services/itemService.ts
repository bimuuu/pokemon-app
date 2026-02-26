import type { Item } from "pokenode-ts"

export class ItemService {
  private static cache = new Map<string, Item>()

  static async fetchItemDetails(itemName: string): Promise<Item> {
    // Format item name for API
    const formattedItemName = this.formatItemNameForAPI(itemName)
    
    // Check cache first
    if (this.cache.has(formattedItemName)) {
      return this.cache.get(formattedItemName)!
    }

    try {
      const response = await fetch(`https://pokeapi.co/api/v2/item/${formattedItemName}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch item: ${formattedItemName}`)
      }
      
      const itemData: Item = await response.json()
      
      // Cache the result with both original and formatted names
      this.cache.set(formattedItemName, itemData)
      this.cache.set(itemName, itemData)
      
      return itemData
    } catch (error) {
      console.error(`Error fetching item details for ${itemName} (tried: ${formattedItemName}):`, error)
      throw error
    }
  }

  static formatItemNameForAPI(itemName: string): string {
    return itemName
      .toLowerCase()
      .replace(/_/g, '-')  // Convert underscores to hyphens
      .replace(/ /g, '-')  // Convert spaces to hyphens
      .replace(/--/g, '-') // Remove double hyphens
      .replace(/^-/, '')   // Remove leading hyphen
      .replace(/-$/, '')   // Remove trailing hyphen
  }

  static clearCache(): void {
    this.cache.clear()
  }

  static getCacheSize(): number {
    return this.cache.size
  }
}
