import { ItemSellData, Item } from '@/types'

export interface CalculatorState {
  selectedItems: Record<string, number>
  targetAmount: string
}

export interface ItemCalculation {
  item: Item
  quantity: number
}

export function formatItemName(itemName: string): string {
  return itemName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function calculateTotalValue(selectedItems: Record<string, number>, allItems: Item[]): number {
  return Object.entries(selectedItems).reduce((total, [itemKey, quantity]) => {
    const item = allItems.find(i => i.item === itemKey)
    return total + (item ? item.price * quantity : 0)
  }, 0)
}

export function calculateOptimalItems(targetAmount: number, allItems: Item[]): ItemCalculation[] {
  if (targetAmount <= 0 || allItems.length === 0) return []
  
  // Sort items by price (highest first) for optimal calculation
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

export function handleItemQuantityChange(
  itemKey: string, 
  quantity: number, 
  currentItems: Record<string, number>
): Record<string, number> {
  if (quantity <= 0) {
    const { [itemKey]: removed, ...rest } = currentItems
    return rest
  }
  
  return {
    ...currentItems,
    [itemKey]: quantity
  }
}

export function getCalculatorStats(targetAmount: string, currentTotal: number): {
  target: number
  targetNum: number
  current: number
  difference: number
  percentage: number
  isUnderTarget: boolean
  statusText: string
} {
  const target = parseFloat(targetAmount) || 0
  const difference = target - currentTotal
  const percentage = target > 0 ? (currentTotal / target) * 100 : 0
  const isUnderTarget = currentTotal < target
  const statusText = isUnderTarget ? 'Under Target' : 'Target Reached'
  
  return {
    target,
    targetNum: target,
    current: currentTotal,
    difference,
    percentage,
    isUnderTarget,
    statusText
  }
}
