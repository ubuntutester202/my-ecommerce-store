"use client"

import { useState, useEffect, useCallback } from "react"
import { Product } from "@/types"

interface SearchSuggestion {
  id: string
  text: string
  type: 'product' | 'category' | 'brand'
  count?: number
}

interface SearchFilters {
  category: string
  brand: string
  priceMin: string
  priceMax: string
  rating: string
  inStock: boolean
}

interface UseSearchOptions {
  debounceMs?: number
  maxSuggestions?: number
  maxHistory?: number
}

// 模拟的热门搜索词
const POPULAR_SEARCHES = [
  "iPhone", "笔记本电脑", "运动鞋", "无线耳机", "连衣裙", 
  "护肤品", "咖啡", "背包", "手表", "游戏手柄"
]

// 模拟的商品数据 - 在实际项目中应该从API获取
const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    description: "最新款iPhone，配备钛金属外壳",
    price: 9999,
    originalPrice: 10999,
    images: ["/placeholder-product.jpg"],
    category: "手机数码",
    categoryId: 1,
    brand: "Apple",
    rating: 4.8,
    reviews: 256,
    stock: 50,
    sales: 1280,
    badge: "热销",
    specifications: [],
    features: [],
    tags: ["iPhone", "手机", "Apple"],
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  },
  {
    id: 2,
    name: "MacBook Air M3",
    description: "超薄轻便的笔记本电脑",
    price: 8999,
    originalPrice: 9999,
    images: ["/placeholder-product.jpg"],
    category: "电脑办公",
    categoryId: 2,
    brand: "Apple",
    rating: 4.9,
    reviews: 189,
    stock: 30,
    sales: 890,
    specifications: [],
    features: [],
    tags: ["MacBook", "笔记本电脑", "Apple"],
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  },
  {
    id: 3,
    name: "AirPods Pro 3",
    description: "主动降噪无线耳机",
    price: 1999,
    originalPrice: 2299,
    images: ["/placeholder-product.jpg"],
    category: "数码配件",
    categoryId: 3,
    brand: "Apple",
    rating: 4.7,
    reviews: 445,
    stock: 100,
    sales: 2100,
    badge: "新品",
    specifications: [],
    features: [],
    tags: ["AirPods", "耳机", "Apple"],
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  }
]

export function useSearch(options: UseSearchOptions = {}) {
  const {
    debounceMs = 300,
    maxSuggestions = 8,
    maxHistory = 10
  } = options

  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // 加载搜索历史
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const history = localStorage.getItem('searchHistory')
      if (history) {
        try {
          setSearchHistory(JSON.parse(history))
        } catch (error) {
          console.error('解析搜索历史失败:', error)
        }
      }
    }
  }, [])

  // 获取搜索建议
  const getSuggestions = useCallback(async (query: string): Promise<SearchSuggestion[]> => {
    if (!query.trim()) return []

    setIsLoading(true)
    try {
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, debounceMs))

             // 生成搜索建议
       const suggestions: SearchSuggestion[] = [
         { id: '1', text: `${query} 手机`, type: 'product' as const, count: 128 },
         { id: '2', text: `${query} 配件`, type: 'category' as const, count: 85 },
         { id: '3', text: `${query} 品牌`, type: 'brand' as const, count: 42 },
         { id: '4', text: `${query} 电脑`, type: 'product' as const, count: 67 },
         { id: '5', text: `${query} 耳机`, type: 'product' as const, count: 234 },
       ].filter(s => s.text.toLowerCase().includes(query.toLowerCase()))

      return suggestions.slice(0, maxSuggestions)
    } catch (error) {
      console.error('获取搜索建议失败:', error)
      return []
    } finally {
      setIsLoading(false)
    }
  }, [debounceMs, maxSuggestions])

  // 搜索商品
  const searchProducts = useCallback(async (
    query: string, 
    filters: Partial<SearchFilters> = {},
    sortBy: string = 'relevance'
  ): Promise<Product[]> => {
    setIsLoading(true)
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500))
      
      let results = [...MOCK_PRODUCTS]
      
      // 根据查询词过滤
      if (query.trim()) {
        results = results.filter(product => 
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase()) ||
          product.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        )
      }

      // 应用筛选条件
      if (filters.category) {
        results = results.filter(p => p.category === filters.category)
      }
      if (filters.brand) {
        results = results.filter(p => p.brand === filters.brand)
      }
      if (filters.priceMin && !isNaN(Number(filters.priceMin))) {
        results = results.filter(p => p.price >= Number(filters.priceMin))
      }
      if (filters.priceMax && !isNaN(Number(filters.priceMax))) {
        results = results.filter(p => p.price <= Number(filters.priceMax))
      }
      if (filters.rating && !isNaN(Number(filters.rating))) {
        results = results.filter(p => p.rating >= Number(filters.rating))
      }
      if (filters.inStock) {
        results = results.filter(p => p.stock > 0)
      }

      // 应用排序
      switch (sortBy) {
        case "price-asc":
          results.sort((a, b) => a.price - b.price)
          break
        case "price-desc":
          results.sort((a, b) => b.price - a.price)
          break
        case "rating":
          results.sort((a, b) => b.rating - a.rating)
          break
        case "sales":
          results.sort((a, b) => b.sales - a.sales)
          break
        case "newest":
          results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          break
        default:
          // relevance - 保持默认顺序
          break
      }

      return results
    } catch (error) {
      console.error('搜索商品失败:', error)
      return []
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 添加到搜索历史
  const addToHistory = useCallback((query: string) => {
    if (!query.trim()) return

    const newHistory = [
      query,
      ...searchHistory.filter(h => h !== query)
    ].slice(0, maxHistory)

    setSearchHistory(newHistory)
    
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('searchHistory', JSON.stringify(newHistory))
      } catch (error) {
        console.error('保存搜索历史失败:', error)
      }
    }
  }, [searchHistory, maxHistory])

  // 删除搜索历史项
  const removeFromHistory = useCallback((query: string) => {
    const newHistory = searchHistory.filter(h => h !== query)
    setSearchHistory(newHistory)
    
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('searchHistory', JSON.stringify(newHistory))
      } catch (error) {
        console.error('更新搜索历史失败:', error)
      }
    }
  }, [searchHistory])

  // 清空搜索历史
  const clearHistory = useCallback(() => {
    setSearchHistory([])
    
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('searchHistory')
      } catch (error) {
        console.error('清空搜索历史失败:', error)
      }
    }
  }, [])

  // 获取热门搜索
  const getPopularSearches = useCallback(() => {
    return POPULAR_SEARCHES
  }, [])

  return {
    searchHistory,
    isLoading,
    getSuggestions,
    searchProducts,
    addToHistory,
    removeFromHistory,
    clearHistory,
    getPopularSearches
  }
} 