'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, ShoppingCart, Package, Coins, Star, Filter } from 'lucide-react'

interface ShopItem {
  id: string
  name: string
  itemId: string
  price: number
  description: string
}

interface ShopCategory {
  id: string
  name: string
  description: string
  items: ShopItem[]
}

interface ShopData {
  currency: string
  categories: ShopCategory[]
}

export default function ShopClient() {
  const [shopData, setShopData] = useState<ShopData | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [cart, setCart] = useState<ShopItem[]>([])

  useEffect(() => {
    const loadShopData = async () => {
      try {
        const response = await fetch('/data/shop/shop.json')
        const data = await response.json()
        setShopData(data)
      } catch (error) {
        console.error('Failed to load shop data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadShopData()
  }, [])

  const getCategoryColor = (categoryId: string) => {
    const colors: Record<string, string> = {
      'pokeballs': 'bg-blue-500',
      'medicine': 'bg-green-500',
      'vitamins': 'bg-yellow-500',
      'special_items': 'bg-purple-500',
      'mob_drops': 'bg-orange-500',
      'food': 'bg-pink-500'
    }
    return colors[categoryId] || 'bg-gray-500'
  }

  const getPriceColor = (price: number) => {
    if (price < 100) return 'text-green-600'
    if (price < 500) return 'text-blue-600'
    if (price < 1000) return 'text-purple-600'
    if (price < 5000) return 'text-orange-600'
    return 'text-red-600'
  }

  const addToCart = (item: ShopItem) => {
    setCart(prev => [...prev, item])
  }

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId))
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price, 0)
  }

  const filteredItems = shopData ? 
    shopData.categories.flatMap(category => 
      category.items.map(item => ({ ...item, category }))
    ).filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) : []

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading shop...</p>
        </div>
      </div>
    )
  }

  if (!shopData) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center">
          <p className="text-red-600">Failed to load shop data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Pokemon Shop</h1>
            <p className="text-lg text-muted-foreground">
              Browse and purchase items using {shopData.currency}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="relative">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart ({cart.length})
              {cart.length > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
                  {getTotalPrice().toLocaleString()} {shopData.currency}
                </Badge>
              )}
            </Button>
          </div>
        </div>

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
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="all">All Items</TabsTrigger>
          {shopData.categories.map(category => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item: any) => (
              <Card key={`${item.category.id}-${item.id}`} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {item.name}
                    </CardTitle>
                    <Badge className={getCategoryColor(item.category.id)}>
                      {item.category.name}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className={`font-bold text-lg ${getPriceColor(item.price)}`}>
                        <Coins className="inline h-4 w-4 mr-1" />
                        {item.price.toLocaleString()} {shopData.currency}
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => addToCart(item)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {shopData.categories.map(category => (
          <TabsContent key={category.id} value={category.id} className="mt-6">
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2">{category.name}</h2>
              <p className="text-muted-foreground">{category.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.items
                .filter(item => 
                  item.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(item => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {item.name}
                      </CardTitle>
                      <Badge className={getCategoryColor(category.id)}>
                        {category.name}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className={`font-bold text-lg ${getPriceColor(item.price)}`}>
                          <Coins className="inline h-4 w-4 mr-1" />
                          {item.price.toLocaleString()} {shopData.currency}
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => addToCart(item)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No items found matching your search.</p>
        </div>
      )}

      {cart.length > 0 && (
        <Card className="mt-8 border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Shopping Cart ({cart.length} items)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              {cart.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="font-medium">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${getPriceColor(item.price)}`}>
                      {item.price.toLocaleString()} {shopData.currency}
                    </span>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-xl font-bold">
                Total: {getTotalPrice().toLocaleString()} {shopData.currency}
              </div>
              <Button className="bg-green-600 hover:bg-green-700">
                <Coins className="h-4 w-4 mr-2" />
                Checkout
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
