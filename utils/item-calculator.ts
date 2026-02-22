import { Item } from '@/types/item'

export interface ItemCalculation {
  item: Item
  quantity: number
}

export interface CalculatorState {
  targetAmount: string
  selectedItems: {[key: string]: number}
}

export const formatItemName = (itemName: string): string => {
  // Remove namespace prefixes (minecraft:, cobblemon:, lumymon:)
  return itemName.replace(/^(minecraft:|cobblemon:|lumymon:)/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
}

export const calculateTotalValue = (
  selectedItems: {[key: string]: number},
  allItems: Item[]
): number => {
  return Object.entries(selectedItems).reduce((total, [itemKey, quantity]) => {
    const item = allItems.find(item => item.item === itemKey)
    return total + (item ? item.price * quantity : 0)
  }, 0)
}

export const calculateOptimalItems = (
  targetAmount: number,
  allItems: Item[]
): ItemCalculation[] => {
  if (targetAmount <= 0) return []

  // Sort items by price descending for optimal calculation
  const sortedItems = [...allItems].sort((a, b) => b.price - a.price)
  const result: ItemCalculation[] = []
  let remaining = targetAmount

  for (const item of sortedItems) {
    if (remaining <= 0) break
    const quantity = Math.floor(remaining / item.price)
    if (quantity > 0) {
      result.push({ item, quantity })
      remaining -= item.price * quantity
    }
  }

  return result
}

export const handleItemQuantityChange = (
  itemKey: string,
  quantity: number,
  selectedItems: {[key: string]: number}
): {[key: string]: number} => {
  return {
    ...selectedItems,
    [itemKey]: Math.max(0, quantity)
  }
}

export const getCalculatorStats = (
  targetAmount: string,
  currentTotal: number
) => {
  const targetNum = parseFloat(targetAmount) || 0
  const difference = targetNum - currentTotal
  
  return {
    targetNum,
    difference,
    isOverTarget: difference < 0,
    isUnderTarget: difference > 0,
    isExactMatch: difference === 0,
    formattedDifference: Math.abs(difference).toLocaleString(),
    statusText: difference >= 0 
      ? `Need ${difference.toLocaleString()} more` 
      : `Excess by ${Math.abs(difference).toLocaleString()}`
  }
}
