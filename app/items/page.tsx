'use client'

import { useState, useEffect, useMemo } from 'react'
import { Pagination } from '@/components/common/Pagination'
import { useLanguage } from '@/contexts/LanguageContext'
import itemSellData from '@/public/data/item-sell.json'
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

export default function ItemsPage() {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [loading, setLoading] = useState(true)
  const [targetAmount, setTargetAmount] = useState('')
  const [selectedItems, setSelectedItems] = useState<{[key: string]: number}>({})
  const [showCalculator, setShowCalculator] = useState(false)
  const [manualItemSearchTerm, setManualItemSearchTerm] = useState('')
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())
  const [manualSortOrder, setManualSortOrder] = useState<'price-desc' | 'price-asc' | 'name-asc' | 'name-desc'>('price-desc')

  const itemsPerPage = 20

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const allItems = useMemo(() => {
    const data = itemSellData as ItemSellData
    return data.bank || []
  }, [])

  const filteredAndSortedItems = useMemo(() => {
    let filtered = allItems.filter(item =>
      item.item.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Sort by price
    filtered.sort((a, b) => {
      return sortOrder === 'asc' ? a.price - b.price : b.price - a.price
    })

    return filtered
  }, [allItems, searchTerm, sortOrder])

  const filteredManualItems = useMemo(() => {
    let filtered = allItems.filter(item =>
      item.item.toLowerCase().includes(manualItemSearchTerm.toLowerCase())
    )

    // Sort based on manual sort order
    filtered.sort((a, b) => {
      switch (manualSortOrder) {
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
  }, [allItems, manualItemSearchTerm, manualSortOrder])

  const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedItems = filteredAndSortedItems.slice(startIndex, startIndex + itemsPerPage)

  const totalValue = useMemo(() => {
    return filteredAndSortedItems.reduce((sum, item) => sum + item.price, 0)
  }, [filteredAndSortedItems])

  const currentTotal = useMemo(() => {
    return calculateTotalValue(selectedItems, allItems)
  }, [selectedItems, allItems])

  const optimalItems = useMemo(() => {
    return calculateOptimalItems(parseFloat(targetAmount) || 0, allItems)
  }, [targetAmount, allItems])

  const calculatorStats = useMemo(() => {
    return getCalculatorStats(targetAmount, currentTotal)
  }, [targetAmount, currentTotal])

  const handleQuantityChange = (itemKey: string, quantity: number) => {
    setSelectedItems(prev => handleItemQuantityChange(itemKey, quantity, prev))
  }

  const handleCheckboxChange = (itemKey: string, checked: boolean) => {
    setCheckedItems(prev => {
      const newSet = new Set(prev)
      if (checked) {
        newSet.add(itemKey)
        // Initialize quantity to 1 if not already set
        setSelectedItems(selected => ({
          ...selected,
          [itemKey]: selected[itemKey] || 1
        }))
      } else {
        newSet.delete(itemKey)
        // Remove quantity when unchecked
        setSelectedItems(selected => {
          const newSelected = { ...selected }
          delete newSelected[itemKey]
          return newSelected
        })
      }
      return newSet
    })
  }

  const getSelectedItemsList = () => {
    return Array.from(checkedItems).map(itemKey => {
      const item = allItems.find(i => i.item === itemKey)
      const quantity = selectedItems[itemKey] || 0
      return item ? { ...item, quantity } : null
    }).filter(Boolean)
  }

  if (loading) {
    return (
      <section className="space-y-6">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">{t('common.loading')}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <header className="text-center">
        <h1 className="text-4xl font-bold mb-4">{t('items.title')}</h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          {t('items.subtitle')}
        </p>
      </header>

      <section className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder={t('items.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('items.sortByPrice')} ({sortOrder === 'asc' ? t('items.sortAscending') : t('items.sortDescending')})
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-300 mb-4">
          <div>
            {t('items.totalItems')}: {filteredAndSortedItems.length}
          </div>
          <div>
            {t('items.totalValue')}: {totalValue.toLocaleString()} {t('items.cobbleDollar')}
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Item Calculator</h2>
          <button
            onClick={() => setShowCalculator(!showCalculator)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showCalculator ? 'Hide Calculator' : 'Show Calculator'}
          </button>
        </div>

        {showCalculator && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Target Amount Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Target Amount ({t('items.cobbleDollar')})
                </label>
                <input
                  type="number"
                  placeholder="Enter target amount..."
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Current Total Display */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Current Total
                </label>
                <div className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg">
                  <div className="text-lg font-semibold text-white">
                    {currentTotal.toLocaleString()} {t('items.cobbleDollar')}
                  </div>
                  {calculatorStats.targetNum > 0 && (
                    <div className={`text-sm mt-1 ${calculatorStats.isUnderTarget ? 'text-green-400' : 'text-red-400'}`}>
                      {calculatorStats.statusText}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Optimal Items Suggestion */}
            {calculatorStats.targetNum > 0 && optimalItems.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-white mb-3">Optimal Items to Reach Target:</h3>
                <div className="bg-gray-700 rounded-lg p-4 max-h-60 overflow-y-auto">
                  {optimalItems.map(({item, quantity}, index) => (
                    <div key={item.item} className="flex justify-between items-center py-2 border-b border-gray-600 last:border-0">
                      <div>
                        <div className="text-sm font-medium text-white">{formatItemName(item.item)}</div>
                        <div className="text-xs text-gray-400">{item.price.toLocaleString()} {t('items.cobbleDollar')} each</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-green-400">{quantity}x</div>
                        <div className="text-xs text-gray-400">{(item.price * quantity).toLocaleString()} total</div>
                      </div>
                    </div>
                  ))}
                  <div className="mt-3 pt-3 border-t border-gray-600">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-white">Total Value:</span>
                      <span className="text-lg font-semibold text-green-400">
                        {optimalItems.reduce((sum, {item, quantity}) => sum + (item.price * quantity), 0).toLocaleString()} {t('items.cobbleDollar')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Manual Item Selection */}
            <div className="mt-6">
              <div className="text-lg font-medium text-gray-300 mb-3 flex justify-between items-center">
                <span>Manual Item Selection</span>
                <button
                  onClick={() => {
                    setSelectedItems({})
                    setCheckedItems(new Set())
                  }}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                >
                  Clear All
                </button>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search manual items..."
                    value={manualItemSearchTerm}
                    onChange={(e) => setManualItemSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={manualSortOrder}
                    onChange={(e) => setManualSortOrder(e.target.value as any)}
                    className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="price-desc">Price: High to Low</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="name-desc">Name: Z to A</option>
                  </select>
                </div>
              </div>
              <div className="text-sm text-gray-400 mb-3 flex justify-between items-center">
                <span>Showing {filteredManualItems.length} of {allItems.length} items</span>
                <span className="text-xs">Selected: {checkedItems.size} items | Total: {currentTotal.toLocaleString()} cobbleDollar</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
                {filteredManualItems.map(item => (
                  <div key={item.item} className={`bg-gray-700 rounded-lg p-3 transition-colors border ${checkedItems.has(item.item) ? 'border-blue-500 bg-gray-600' : 'border-gray-600 hover:bg-gray-600'}`}>
                    <div className="flex items-start gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={checkedItems.has(item.item)}
                        onChange={(e) => handleCheckboxChange(item.item, e.target.checked)}
                        className="mt-1 w-4 h-4 text-blue-600 bg-gray-800 border-gray-500 rounded focus:ring-blue-500 focus:ring-2"
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
                        <input
                          type="number"
                          min="1"
                          placeholder="1"
                          value={selectedItems[item.item] || ''}
                          onChange={(e) => handleQuantityChange(item.item, parseInt(e.target.value) || 1)}
                          className="flex-1 px-2 py-1 bg-gray-800 border border-gray-500 rounded text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="text-xs text-gray-400 min-w-[60px] text-right">
                          = {(item.price * (selectedItems[item.item] || 0)).toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Selected Items Display */}
              {checkedItems.size > 0 && (
                <div className="mt-6">
                  <h4 className="text-lg font-medium text-white mb-3">Selected Items Summary:</h4>
                  <div className="bg-gray-700 rounded-lg p-4 max-h-60 overflow-y-auto">
                    {getSelectedItemsList().map((item: any) => (
                      <div key={item.item} className="flex justify-between items-center py-2 border-b border-gray-600 last:border-0">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-white">{formatItemName(item.item)}</div>
                          <div className="text-xs text-gray-400">{item.price.toLocaleString()} cobbleDollar each</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm font-semibold text-blue-400">{item.quantity}x</div>
                          <div className="text-sm font-semibold text-green-400 min-w-[80px] text-right">
                            {(item.price * item.quantity).toLocaleString()}
                          </div>
                          <button
                            onClick={() => handleCheckboxChange(item.item, false)}
                            className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="mt-3 pt-3 border-t border-gray-600">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-white">Total Value:</span>
                        <span className="text-lg font-semibold text-green-400">
                          {currentTotal.toLocaleString()} cobbleDollar
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {paginatedItems.length === 0 ? (
        <section className="text-center py-12">
          <p className="text-gray-400">{t('items.noItemsFound')}</p>
        </section>
      ) : (
        <>
          <section className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700 border-b border-gray-600">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      {t('items.itemName')}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      {t('items.price')} ({t('items.cobbleDollar')})
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {paginatedItems.map((item, index) => (
                    <tr key={item.item} className="hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {startIndex + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {formatItemName(item.item)}
                        </div>
                        <div className="text-xs text-gray-400">
                          {item.item}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm font-semibold text-green-400">
                          {item.price.toLocaleString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {totalPages > 1 && (
            <nav aria-label="Pagination">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </nav>
          )}
        </>
      )}
    </section>
  )
}
