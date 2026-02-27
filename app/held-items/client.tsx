'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Package, Star, X, ArrowUpDown, Activity } from 'lucide-react'
import { Pagination } from '@/components/common'
import { ColorUtils } from '@/utils/colorUtils'
import { SortUtils, type ItemSortField, type SortOrder } from '@/utils/sortUtils'
import { FilterUtils, ITEMS_PER_PAGE } from '@/utils/filterUtils'
import { ItemDetailModal } from '@/components/modals/ItemDetailModal'
import type { Item } from 'pokenode-ts'

interface HeldItemsListClientProps {
  initialItems: any
}

export function HeldItemsListClient({ initialItems }: HeldItemsListClientProps) {
  const searchParams = useSearchParams()
  const [items, setItems] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [isLoadingItem, setIsLoadingItem] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState<ItemSortField>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const itemsPerPage = ITEMS_PER_PAGE

  // Handle URL search parameter
  useEffect(() => {
    const searchFromUrl = searchParams.get('search')
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl)
    }
  }, [searchParams])

  const categories = [
    'all',
    'holdable',
    'holdable-active',
    'mega-stones'
  ]

  // Fetch detailed item data on component mount
  useEffect(() => {
    const fetchDetailedItems = async () => {
      setIsLoading(true)
      try {
        const detailedItems = await Promise.all(
          initialItems.results.map(async (item: any) => {
            try {
              const response = await fetch(item.url)
              if (response.ok) {
                const itemDetail = await response.json()
                const attributes = itemDetail.attributes?.map((attr: any) => attr.name) || []
                const category = itemDetail.category?.name || ''
                
                // Exclude specific categories: flutes, healing, special balls, spelunking, standard balls, status cures, vitamins
                // But allow holdable, holdable-active, and mega-stones
                const excludedCategories = [
                  'flutes',
                  'healing', 
                  'special-balls',
                  'spelunking',
                  'standard-balls',
                  'status-cures',
                  'vitamins'
                ]
                
                if ((attributes.includes('holdable') || 
                    attributes.includes('holdable-active') ||
                    category === 'mega-stones') &&
                    !excludedCategories.includes(category)) {
                  return itemDetail
                }
              }
            } catch (error) {
              console.warn(`Failed to fetch item details for ${item.name}:`, error)
            }
            return null
          })
        )
        setItems(detailedItems.filter(Boolean))
      } catch (error) {
        console.error('Failed to fetch detailed items:', error)
        setItems([])
      } finally {
        setIsLoading(false)
      }
    }

    if (initialItems.results?.length > 0) {
      fetchDetailedItems()
    } else {
      setIsLoading(false)
    }
  }, [initialItems])

  const handleItemClick = async (itemName: string) => {
    setIsLoadingItem(true)
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/item/${itemName}`)
      if (response.ok) {
        const itemData = await response.json()
        setSelectedItem(itemData)
      }
    } catch (error) {
      console.error('Failed to fetch item details:', error)
    } finally {
      setIsLoadingItem(false)
    }
  }

  const closeModal = () => {
    setSelectedItem(null)
  }

  const handleSort = (field: ItemSortField) => {
    const { field: newField, order: newOrder } = SortUtils.handleItemSort(sortBy, field, sortOrder)
    setSortBy(newField)
    setSortOrder(newOrder)
    setCurrentPage(1)
  }

  // Data processing
  const filteredItems = FilterUtils.filterItems(items, searchTerm, selectedCategory)
  const sortedItems = SortUtils.sortItems(filteredItems, sortBy, sortOrder)
  const totalPages = FilterUtils.getTotalPages(sortedItems.length, itemsPerPage)
  const currentItems = FilterUtils.paginateItems(sortedItems, currentPage, itemsPerPage)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedCategory])
  
  // ESC key handler to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selectedItem) {
        closeModal()
      }
    }

    document.addEventListener('keydown', handleEscKey)
    return () => {
      document.removeEventListener('keydown', handleEscKey)
    }
  }, [selectedItem])

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Pokemon Held Items</h1>
        <p className="text-lg text-muted-foreground mb-2">
          Browse all Pokemon held items with detailed information about their effects and battle advantages.
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          Showing <span className="font-semibold">{filteredItems.length}</span> of <span className="font-semibold">{items.length}</span> total items
        </p>
        
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search items by name..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value)
                setCurrentPage(1)
              }}
              className="px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : 
                   category === 'holdable' ? 'Holdable Items' :
                   category === 'holdable-active' ? 'Holdable Active Items' :
                   category === 'mega-stones' ? 'Mega Stones' :
                   category.replace('-', ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <Button
              variant={sortBy === 'name' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSort('name')}
              className="flex items-center gap-1"
            >
              <ArrowUpDown className="h-3 w-3" />
              A-Z
              {sortBy === 'name' && (
                <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
              )}
            </Button>
            <Button
              variant={sortBy === 'category' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSort('category')}
              className="flex items-center gap-1"
            >
              <Package className="h-3 w-3" />
              Category
              {sortBy === 'category' && (
                <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading items...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentItems.map((item: any) => (
            <Card 
              key={item.name} 
              className="hover:shadow-lg transition-shadow cursor-pointer h-full"
              onClick={() => handleItemClick(item.name)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg capitalize">
                    {item.name.replace('-', ' ')}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      <span className={`text-sm ${ColorUtils.getCategoryColor(item.category?.name || '')}`}>
                        {item.category?.name?.replace('-', ' ').toUpperCase() || '—'}
                      </span>
                    </div>
                    <Star className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Badge 
                      className="text-white border-0"
                      style={{ backgroundColor: ColorUtils.getCategoryColor(item.category?.name || '') }}
                    >
                      {item.category?.name?.replace('-', ' ').toUpperCase() || 'UNKNOWN'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {item.flavor_text_entries?.find((f: any) => f.language.name === 'en')?.flavor_text || 
                     item.effect_entries?.find((e: any) => e.language.name === 'en')?.short_effect ||
                     'Click to view detailed information about this item'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {currentItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No items found matching your search.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Item Detail Modal */}
      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          onClose={closeModal}
        />
      )}
    </div>
  )
}
