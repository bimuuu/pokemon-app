'use client'

import { useState, useMemo } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { 
  formatItemName, 
  calculateTotalValue, 
  calculateOptimalItems, 
  handleItemQuantityChange,
  getCalculatorStats,
  type CalculatorState,
  type ItemCalculation
} from '@/utils'
import { Item, ItemSellData } from '@/types'

// Farmer motion animation styles
const farmerAnimations = `
  @keyframes farmerBounce {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes farmerWobble {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-3deg); }
    75% { transform: rotate(3deg); }
  }
  
  @keyframes farmerGrow {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  @keyframes farmerShake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
  
  .farmer-bounce {
    animation: farmerBounce 0.6s ease-in-out;
  }
  
  .farmer-wobble {
    animation: farmerWobble 0.4s ease-in-out;
  }
  
  .farmer-grow {
    animation: farmerGrow 0.3s ease-in-out;
  }
  
  .farmer-shake {
    animation: farmerShake 0.3s ease-in-out;
  }
  
  .farmer-hover:hover {
    animation: farmerBounce 0.3s ease-in-out;
  }
  
  .farmer-pulse {
    animation: farmerGrow 2s ease-in-out infinite;
  }
`

interface ItemCalculatorSidePanelProps {
  isOpen: boolean
  onClose: () => void
  allItems: Item[]
  selectedItems: Record<string, number>
  onSelectedItemsChange: (items: Record<string, number>) => void
  checkedItems: Set<string>
  onCheckedItemsChange: (items: Set<string>) => void
}

export default function ItemCalculatorSidePanel({
  isOpen,
  onClose,
  allItems,
  selectedItems,
  onSelectedItemsChange,
  checkedItems,
  onCheckedItemsChange
}: ItemCalculatorSidePanelProps) {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState<'price-desc' | 'price-asc' | 'name-asc' | 'name-desc'>('price-desc')

  const currentTotal = useMemo(() => {
    return calculateTotalValue(selectedItems, allItems)
  }, [selectedItems, allItems])

  const calculatorStats = useMemo(() => {
    return getCalculatorStats('', currentTotal)
  }, [currentTotal])


  const filteredItems = useMemo(() => {
    let filtered = allItems.filter(item =>
      item.item.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Sort: selected items first, then by price/name
    filtered.sort((a, b) => {
      const aSelected = checkedItems.has(a.item)
      const bSelected = checkedItems.has(b.item)
      
      // If one is selected and the other isn't, selected comes first
      if (aSelected && !bSelected) return -1
      if (!aSelected && bSelected) return 1
      
      // If both are selected or both aren't, apply regular sorting
      switch (sortOrder) {
        case 'price-desc':
          return b.price - a.price
        case 'price-asc':
          return a.price - b.price
        case 'name-asc':
          return formatItemName(a.item).localeCompare(formatItemName(b.item))
        case 'name-desc':
          return formatItemName(b.item).localeCompare(formatItemName(a.item))
        default:
          return b.price - a.price
      }
    })

    return filtered
  }, [allItems, searchTerm, sortOrder, checkedItems])

  const handleQuantityChange = (itemKey: string, quantity: number) => {
    const newSelected = handleItemQuantityChange(itemKey, quantity, selectedItems)
    onSelectedItemsChange(newSelected)
  }

  const handleCheckboxChange = (itemKey: string, checked: boolean) => {
    const newChecked = new Set(checkedItems)
    const newSelected = { ...selectedItems }
    
    if (checked) {
      newChecked.add(itemKey)
      newSelected[itemKey] = newSelected[itemKey] || 1
      
      // Add farmer animation to the item card
      const itemElement = document.querySelector(`[data-panel-item="${itemKey}"]`)
      if (itemElement) {
        itemElement.classList.add('farmer-bounce')
        setTimeout(() => itemElement.classList.remove('farmer-bounce'), 600)
      }
    } else {
      newChecked.delete(itemKey)
      delete newSelected[itemKey]
      
      // Add farmer shake animation when removing
      const itemElement = document.querySelector(`[data-panel-item="${itemKey}"]`)
      if (itemElement) {
        itemElement.classList.add('farmer-shake')
        setTimeout(() => itemElement.classList.remove('farmer-shake'), 300)
      }
    }
    
    onCheckedItemsChange(newChecked)
    onSelectedItemsChange(newSelected)
  }

  const getSelectedItemsList = () => {
    return Array.from(checkedItems).map(itemKey => {
      const item = allItems.find(i => i.item === itemKey)
      const quantity = selectedItems[itemKey] || 0
      return item ? { ...item, quantity } : null
    }).filter(Boolean)
  }

  
  if (!isOpen) return null

  return (
    <>
      <style jsx>{farmerAnimations}</style>
      <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Side Panel */}
      <div className="relative ml-auto w-full max-w-md bg-gray-900 shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white farmer-pulse">Item Calculator</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors farmer-hover"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Target Settings */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Current Total
              </label>
              <div className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg farmer-grow">
                <div className="text-lg font-semibold text-white">
                  {currentTotal.toLocaleString()} {t('items.cobbleDollar')}
                </div>
              </div>
            </div>
          </div>


          {/* Quick Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                const topItems = [...allItems]
                  .sort((a, b) => b.price - a.price)
                  .slice(0, 10)
                const newSelected = { ...selectedItems }
                const newChecked = new Set(checkedItems)
                
                topItems.forEach(item => {
                  if (!newChecked.has(item.item)) {
                    newChecked.add(item.item)
                    newSelected[item.item] = 1
                  }
                })
                
                onSelectedItemsChange(newSelected)
                onCheckedItemsChange(newChecked)
              }}
              className="flex-1 px-3 py-2 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors farmer-hover"
            >
              Add Top 10
            </button>
            <button
              onClick={() => {
                // Add items to reach a reasonable target (double current total)
                const targetAmount = currentTotal * 2
                if (targetAmount > 0) {
                  const optimal = calculateOptimalItems(targetAmount - currentTotal, allItems)
                  const newSelected = { ...selectedItems }
                  const newChecked = new Set(checkedItems)
                  
                  optimal.forEach(({item, quantity}) => {
                    newChecked.add(item.item)
                    newSelected[item.item] = (newSelected[item.item] || 0) + quantity
                  })
                  
                  onSelectedItemsChange(newSelected)
                  onCheckedItemsChange(newChecked)
                }
              }}
              className="flex-1 px-3 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition-colors farmer-hover"
            >
              Fill Target
            </button>
          </div>

          {/* Item Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-white">Item Selection</h3>
              <button
                onClick={() => {
                  onSelectedItemsChange({})
                  onCheckedItemsChange(new Set())
                }}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors farmer-hover"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-3 mb-4">
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="price-desc">Price: High to Low</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>

            <div className="text-sm text-gray-400 mb-3">
              Selected: {checkedItems.size} items | Total: {currentTotal.toLocaleString()} cobbleDollar
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredItems.map(item => (
                <div key={item.item} data-panel-item={item.item} className={`bg-gray-800 rounded-lg p-3 border transition-colors ${
                  checkedItems.has(item.item) 
                    ? 'border-blue-500 bg-gray-700' 
                    : 'border-gray-600 hover:bg-gray-700'
                } farmer-hover`}>
                  <div className="flex items-start gap-2 mb-2">
                    <input
                      type="checkbox"
                      checked={checkedItems.has(item.item)}
                      onChange={(e) => handleCheckboxChange(item.item, e.target.checked)}
                      className="mt-1 w-4 h-4 text-blue-600 bg-gray-900 border-gray-500 rounded focus:ring-blue-500 focus:ring-2 farmer-hover"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white truncate">
                        {formatItemName(item.item)}
                      </div>
                      <div className="text-xs font-semibold text-green-400">
                        {item.price.toLocaleString()} cobbleDollar
                      </div>
                    </div>
                  </div>
                  {checkedItems.has(item.item) && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(item.item, (selectedItems[item.item] || 1) - 1)}
                        className="w-6 h-6 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors text-xs farmer-hover"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        placeholder="1"
                        value={selectedItems[item.item] || ''}
                        onChange={(e) => handleQuantityChange(item.item, parseInt(e.target.value) || 1)}
                        className="flex-1 px-2 py-1 bg-gray-900 border border-gray-500 rounded text-white text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent farmer-hover"
                      />
                      <button
                        onClick={() => handleQuantityChange(item.item, (selectedItems[item.item] || 1) + 1)}
                        className="w-6 h-6 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors text-xs farmer-hover"
                      >
                        +
                      </button>
                      <div className="text-xs text-gray-400 min-w-[60px] text-right farmer-hover">
                        = {(item.price * (selectedItems[item.item] || 0)).toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Selected Items Summary */}
            {checkedItems.size > 0 && (
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="text-lg font-medium text-white mb-3">Selected Items Summary</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {getSelectedItemsList().map((item: any) => (
                    <div key={item.item} className="flex justify-between items-center py-2 border-b border-gray-700">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-white">{formatItemName(item.item)}</div>
                        <div className="text-xs text-gray-400">{item.price.toLocaleString()} cobbleDollar each</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-semibold text-white min-w-[40px] text-center">
                          x{item.quantity}
                        </div>
                        <div className="text-sm font-semibold text-green-400 min-w-[80px] text-right">
                          {(item.price * item.quantity).toLocaleString()}
                        </div>
                        <button
                          onClick={() => handleCheckboxChange(item.item, false)}
                          className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors farmer-hover"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-white">Total Value:</span>
                    <span className="text-lg font-semibold text-green-400">
                      {currentTotal.toLocaleString()} cobbleDollar
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
