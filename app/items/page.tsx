'use client'

import { useState, useEffect, useMemo } from 'react'
import { Pagination } from '@/components/common/Pagination'
import ItemCalculatorSidePanel from '@/components/items/ItemCalculatorSidePanel'
import { useLanguage } from '@/contexts/LanguageContext'
import itemSellData from '@/public/data/item-sell.json'
import { 
  formatItemName, 
  calculateTotalValue,
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

export default function ItemsPage() {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortOrder, setSortOrder] = useState<'price-desc' | 'price-asc' | 'name-asc' | 'name-desc'>('price-desc')
  const [loading, setLoading] = useState(true)
  const [selectedItems, setSelectedItems] = useState<{[key: string]: number}>({})
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [showCalculator, setShowCalculator] = useState(false)

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

    // Sort based on sort order
    filtered.sort((a, b) => {
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
  }, [allItems, searchTerm, sortOrder])


  const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedItems = filteredAndSortedItems.slice(startIndex, startIndex + itemsPerPage)

  const totalValue = useMemo(() => {
    return filteredAndSortedItems.reduce((sum, item) => sum + item.price, 0)
  }, [filteredAndSortedItems])

  const currentTotal = useMemo(() => {
    return calculateTotalValue(selectedItems, allItems)
  }, [selectedItems, allItems])

  const handleQuantityChange = (itemKey: string, quantity: number) => {
    if (quantity <= 0) {
      const { [itemKey]: removed, ...rest } = selectedItems
      setSelectedItems(rest)
      const newChecked = new Set(checkedItems)
      newChecked.delete(itemKey)
      setCheckedItems(newChecked)
    } else {
      setSelectedItems(prev => ({
        ...prev,
        [itemKey]: quantity
      }))
    }
  }

  const handleCheckboxChange = (itemKey: string, checked: boolean) => {
    const newChecked = new Set(checkedItems)
    const newSelected = { ...selectedItems }
    
    if (checked) {
      newChecked.add(itemKey)
      newSelected[itemKey] = newSelected[itemKey] || 1
      
      // Add farmer animation to the item card
      const itemElement = document.querySelector(`[data-item="${itemKey}"]`)
      if (itemElement) {
        itemElement.classList.add('farmer-bounce')
        setTimeout(() => itemElement.classList.remove('farmer-bounce'), 600)
      }
    } else {
      newChecked.delete(itemKey)
      delete newSelected[itemKey]
      
      // Add farmer shake animation when removing
      const itemElement = document.querySelector(`[data-item="${itemKey}"]`)
      if (itemElement) {
        itemElement.classList.add('farmer-shake')
        setTimeout(() => itemElement.classList.remove('farmer-shake'), 300)
      }
    }
    
    setCheckedItems(newChecked)
    setSelectedItems(newSelected)
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
    <>
      <style jsx>{farmerAnimations}</style>
      <section className="space-y-6">
        <header className="text-center">
          <h1 className="text-4xl font-bold mb-4">{t('items.title')}</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            {t('items.subtitle')}
          </p>
        </header>

      {/* Shopping Cart Summary */}
      {checkedItems.size > 0 && (
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-lg shadow-lg border border-blue-500 farmer-grow">
          <div className="flex justify-between items-center">
            <div className="text-white">
              <div className="text-sm font-medium">Shopping Cart</div>
              <div className="text-lg font-bold">{checkedItems.size} items | {currentTotal.toLocaleString()} {t('items.cobbleDollar')}</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCalculator(true)}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-medium farmer-hover"
              >
                Open Calculator
              </button>
              <button
                onClick={() => {
                  setSelectedItems({})
                  setCheckedItems(new Set())
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors farmer-hover"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </section>
      )}

      <section className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
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
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="price-desc">Price: High to Low</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors farmer-hover"
            >
              {viewMode === 'grid' ? 'Table View' : 'Grid View'}
            </button>
            <button
              onClick={() => setShowCalculator(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors farmer-hover"
            >
              Open Calculator
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

      {/* Items Display */}
      {paginatedItems.length === 0 ? (
        <section className="text-center py-12">
          <p className="text-gray-400">{t('items.noItemsFound')}</p>
        </section>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginatedItems.map((item, index) => (
                <div key={item.item} data-item={item.item} className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-blue-500 transition-colors farmer-hover">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-white truncate">
                        {formatItemName(item.item)}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">{item.item}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-400">
                        {item.price.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-400">cobbleDollar</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleCheckboxChange(item.item, !checkedItems.has(item.item))}
                      className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors farmer-hover ${
                        checkedItems.has(item.item)
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {checkedItems.has(item.item) ? 'In Cart' : 'Add to Cart'}
                    </button>
                    {checkedItems.has(item.item) && (
                      <button
                        onClick={() => handleQuantityChange(item.item, (selectedItems[item.item] || 1) + 1)}
                        className="px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors farmer-hover"
                      >
                        +1
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </section>
          ) : (
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
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {paginatedItems.map((item, index) => (
                      <tr key={item.item} data-item={item.item} className="hover:bg-gray-700 transition-colors farmer-hover">
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
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleCheckboxChange(item.item, !checkedItems.has(item.item))}
                              className={`px-3 py-1 rounded text-xs font-medium transition-colors farmer-hover ${
                                checkedItems.has(item.item)
                                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              }`}
                            >
                              {checkedItems.has(item.item) ? 'In Cart' : 'Add'}
                            </button>
                            {checkedItems.has(item.item) && (
                              <button
                                onClick={() => handleQuantityChange(item.item, (selectedItems[item.item] || 1) + 1)}
                                className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors farmer-hover"
                              >
                                +1
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

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

      {/* Item Calculator Side Panel */}
      <ItemCalculatorSidePanel
        isOpen={showCalculator}
        onClose={() => setShowCalculator(false)}
        allItems={allItems}
        selectedItems={selectedItems}
        onSelectedItemsChange={setSelectedItems}
        checkedItems={checkedItems}
        onCheckedItemsChange={setCheckedItems}
      />
    </section>
    </>
  )
}
