"use client"

import { Suspense, useState, useEffect, useMemo, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Search, Filter, SlidersHorizontal, Grid, List, Star, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { SearchBar } from "@/components/search/search-bar"
import { ProductCard } from "@/components/product/product-card"
import { Loading } from "@/components/ui/loading"
import { Product } from "@/types"

interface SearchFilters {
  category: string
  brands: string[]
  priceRange: [number, number]
  rating: string
  inStock: boolean
  sortBy: string
}

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
  },
  {
    id: 4,
    name: "Samsung Galaxy S24 Ultra",
    description: "高端安卓旗舰手机",
    price: 8499,
    originalPrice: 8999,
    images: ["/placeholder-product.jpg"],
    category: "手机数码",
    categoryId: 1,
    brand: "Samsung",
    rating: 4.6,
    reviews: 342,
    stock: 25,
    sales: 860,
    specifications: [],
    features: [],
    tags: ["Galaxy", "手机", "Samsung"],
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  },
  {
    id: 5,
    name: "小米14 Pro",
    description: "徕卡影像旗舰手机",
    price: 4299,
    originalPrice: 4599,
    images: ["/placeholder-product.jpg"],
    category: "手机数码",
    categoryId: 1,
    brand: "Xiaomi",
    rating: 4.5,
    reviews: 189,
    stock: 80,
    sales: 1560,
    specifications: [],
    features: [],
    tags: ["小米", "手机", "Xiaomi"],
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  },
  {
    id: 6,
    name: "华为 MateBook X Pro",
    description: "商务办公笔记本电脑",
    price: 6999,
    originalPrice: 7599,
    images: ["/placeholder-product.jpg"],
    category: "电脑办公",
    categoryId: 2,
    brand: "Huawei",
    rating: 4.4,
    reviews: 156,
    stock: 15,
    sales: 420,
    specifications: [],
    features: [],
    tags: ["MateBook", "笔记本电脑", "Huawei"],
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  }
]

// 获取所有品牌和分类的统计信息
const getCategoriesAndBrands = (products: Product[]) => {
  const categories = new Map<string, number>()
  const brands = new Map<string, number>()
  
  products.forEach(product => {
    categories.set(product.category, (categories.get(product.category) || 0) + 1)
    brands.set(product.brand, (brands.get(product.brand) || 0) + 1)
  })
  
  return {
    categories: Array.from(categories.entries()).map(([name, count]) => ({ name, count })),
    brands: Array.from(brands.entries()).map(([name, count]) => ({ name, count }))
  }
}

// 防抖Hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filters, setFilters] = useState<SearchFilters>({
    category: "",
    brands: [],
    priceRange: [0, 12000],
    rating: "",
    inStock: false,
    sortBy: "relevance"
  })

  // 防抖筛选条件
  const debouncedFilters = useDebounce(filters, 300)

  // 计算筛选后的产品和统计信息
  const { filteredProducts, categoriesAndBrands } = useMemo(() => {
    let results = MOCK_PRODUCTS

    // 搜索关键词筛选
    if (query) {
      results = results.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      )
    }

    // 应用筛选条件
    if (debouncedFilters.category) {
      results = results.filter(p => p.category === debouncedFilters.category)
    }
    if (debouncedFilters.brands.length > 0) {
      results = results.filter(p => debouncedFilters.brands.includes(p.brand))
    }
    if (debouncedFilters.priceRange) {
      results = results.filter(p => p.price >= debouncedFilters.priceRange[0] && p.price <= debouncedFilters.priceRange[1])
    }
    if (debouncedFilters.rating) {
      results = results.filter(p => p.rating >= Number(debouncedFilters.rating))
    }
    if (debouncedFilters.inStock) {
      results = results.filter(p => p.stock > 0)
    }

    // 应用排序
    switch (debouncedFilters.sortBy) {
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

    return {
      filteredProducts: results,
      categoriesAndBrands: getCategoriesAndBrands(MOCK_PRODUCTS)
    }
  }, [query, debouncedFilters])

  useEffect(() => {
    const searchProducts = async () => {
      setLoading(true)
      try {
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 300))
        setProducts(filteredProducts)
      } catch (error) {
        console.error("搜索失败:", error)
      } finally {
        setLoading(false)
      }
    }

    searchProducts()
  }, [filteredProducts])

  const clearFilters = useCallback(() => {
    setFilters({
      category: "",
      brands: [],
      priceRange: [0, 12000],
      rating: "",
      inStock: false,
      sortBy: "relevance"
    })
  }, [])

  const hasActiveFilters = useMemo(() => {
    return filters.category !== "" || 
           filters.brands.length > 0 || 
           filters.priceRange[0] !== 0 || 
           filters.priceRange[1] !== 12000 ||
           filters.rating !== "" || 
           filters.inStock
  }, [filters])

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.category) count++
    if (filters.brands.length > 0) count++
    if (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 12000) count++
    if (filters.rating) count++
    if (filters.inStock) count++
    return count
  }, [filters])

  return (
    <div className="container mx-auto px-4 py-6">
      {/* 搜索栏 */}
      <div className="mb-6">
        <SearchBar className="max-w-2xl mx-auto" />
      </div>

      {/* 搜索信息和操作栏 */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            {query ? (
              <h1 className="text-2xl font-bold">
                搜索 &quot;{query}&quot; 的结果
                <span className="ml-2 text-lg font-normal text-muted-foreground">
                  ({products.length} 个商品)
                </span>
              </h1>
            ) : (
              <h1 className="text-2xl font-bold">
                全部商品
                <span className="ml-2 text-lg font-normal text-muted-foreground">
                  ({products.length} 个商品)
                </span>
              </h1>
            )}
            
            {/* 活跃筛选条件显示 */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="text-sm text-muted-foreground">已选择筛选:</span>
                {filters.category && (
                  <Badge variant="secondary" className="gap-1">
                    分类: {filters.category}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-muted-foreground hover:text-foreground"
                      onClick={() => setFilters(prev => ({ ...prev, category: "" }))}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {filters.brands.map(brand => (
                  <Badge key={brand} variant="secondary" className="gap-1">
                    品牌: {brand}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-muted-foreground hover:text-foreground"
                      onClick={() => setFilters(prev => ({ 
                        ...prev, 
                        brands: prev.brands.filter(b => b !== brand) 
                      }))}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
                {(filters.priceRange[0] !== 0 || filters.priceRange[1] !== 12000) && (
                  <Badge variant="secondary" className="gap-1">
                    价格: ¥{filters.priceRange[0]} - ¥{filters.priceRange[1]}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-muted-foreground hover:text-foreground"
                      onClick={() => setFilters(prev => ({ ...prev, priceRange: [0, 12000] }))}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {filters.rating && (
                  <Badge variant="secondary" className="gap-1">
                    评分: {filters.rating}星以上
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-muted-foreground hover:text-foreground"
                      onClick={() => setFilters(prev => ({ ...prev, rating: "" }))}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {filters.inStock && (
                  <Badge variant="secondary" className="gap-1">
                    仅显示有库存
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-muted-foreground hover:text-foreground"
                      onClick={() => setFilters(prev => ({ ...prev, inStock: false }))}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  清空全部
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {/* 视图切换 */}
            <div className="flex items-center border rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="px-2"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="px-2"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* 排序 */}
            <Select 
              value={filters.sortBy} 
              onValueChange={(value: string) => setFilters(prev => ({ ...prev, sortBy: value }))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="排序方式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">相关性</SelectItem>
                <SelectItem value="sales">销量从高到低</SelectItem>
                <SelectItem value="price-asc">价格从低到高</SelectItem>
                <SelectItem value="price-desc">价格从高到低</SelectItem>
                <SelectItem value="rating">评分从高到低</SelectItem>
                <SelectItem value="newest">最新上架</SelectItem>
              </SelectContent>
            </Select>

            {/* 移动端筛选 */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden relative">
                  <Filter className="h-4 w-4 mr-2" />
                  筛选
                  {activeFiltersCount > 0 && (
                    <Badge variant="destructive" className="ml-2 px-1 min-w-[1.25rem] h-5">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>商品筛选</SheetTitle>
                  <SheetDescription>
                    根据条件筛选商品
                  </SheetDescription>
                </SheetHeader>
                <FilterSection 
                  filters={filters} 
                  setFilters={setFilters} 
                  clearFilters={clearFilters}
                  categoriesAndBrands={categoriesAndBrands}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* 侧边栏筛选 */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <div className="sticky top-6">
            <div className="border rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold flex items-center text-lg">
                  <SlidersHorizontal className="h-5 w-5 mr-2" />
                  筛选条件
                </h3>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-xs"
                  >
                    清空全部
                  </Button>
                )}
              </div>
              <FilterSection 
                filters={filters} 
                setFilters={setFilters} 
                clearFilters={clearFilters}
                categoriesAndBrands={categoriesAndBrands}
              />
            </div>
          </div>
        </div>

        {/* 商品列表 */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loading />
            </div>
          ) : products.length > 0 ? (
            <div className={
              viewMode === "grid" 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6" 
                : "space-y-4"
            }>
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  layout={viewMode}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">没有找到相关商品</h3>
              <p className="text-muted-foreground mb-4">
                试试调整搜索关键词或筛选条件
              </p>
              <div className="flex justify-center space-x-2">
                <Button variant="outline" onClick={clearFilters}>
                  清空筛选
                </Button>
                <Button asChild>
                  <Link href="/">浏览全部商品</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function FilterSection({ 
  filters, 
  setFilters, 
  clearFilters,
  categoriesAndBrands
}: { 
  filters: SearchFilters
  setFilters: (filters: SearchFilters) => void
  clearFilters: () => void
  categoriesAndBrands: {
    categories: { name: string; count: number }[]
    brands: { name: string; count: number }[]
  }
}) {
  const handleBrandToggle = (brand: string) => {
    setFilters({
      ...filters,
      brands: filters.brands.includes(brand)
        ? filters.brands.filter(b => b !== brand)
        : [...filters.brands, brand]
    })
  }

  return (
    <div className="space-y-8">
      {/* 分类筛选 */}
      <div>
        <Label className="text-sm font-medium mb-4 block">商品分类</Label>
        <div className="space-y-2">
          <div
            className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
              filters.category === "" ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"
            }`}
            onClick={() => setFilters({ ...filters, category: "" })}
          >
            <span className="text-sm">全部分类</span>
            <span className="text-xs text-muted-foreground">
              {categoriesAndBrands.categories.reduce((sum, cat) => sum + cat.count, 0)}
            </span>
          </div>
          {categoriesAndBrands.categories.map((category) => (
            <div
              key={category.name}
              className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                filters.category === category.name ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"
              }`}
              onClick={() => setFilters({ ...filters, category: category.name })}
            >
              <span className="text-sm">{category.name}</span>
              <span className="text-xs text-muted-foreground">{category.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 品牌筛选 */}
      <div>
        <Label className="text-sm font-medium mb-4 block">品牌</Label>
        <div className="space-y-2">
          {categoriesAndBrands.brands.map((brand) => (
            <label key={brand.name} className="flex items-center justify-between p-2 rounded hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand.name)}
                  onChange={() => handleBrandToggle(brand.name)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">{brand.name}</span>
              </div>
              <span className="text-xs text-muted-foreground">{brand.count}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 价格范围滑动条 */}
      <div>
        <Label className="text-sm font-medium mb-4 block">价格范围</Label>
        <div className="px-2">
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => setFilters({ ...filters, priceRange: value as [number, number] })}
            max={12000}
            min={0}
            step={100}
            className="mb-4"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>¥{filters.priceRange[0]}</span>
            <span>¥{filters.priceRange[1]}</span>
          </div>
          <div className="flex items-center space-x-2 mt-3">
            <Input
              type="number"
              placeholder="最低价"
              value={filters.priceRange[0]}
              onChange={(e) => {
                const value = Math.max(0, Math.min(Number(e.target.value), filters.priceRange[1]))
                setFilters({ ...filters, priceRange: [value, filters.priceRange[1]] })
              }}
              className="h-8 text-sm"
            />
            <span className="text-muted-foreground text-sm">-</span>
            <Input
              type="number"
              placeholder="最高价"
              value={filters.priceRange[1]}
              onChange={(e) => {
                const value = Math.min(12000, Math.max(Number(e.target.value), filters.priceRange[0]))
                setFilters({ ...filters, priceRange: [filters.priceRange[0], value] })
              }}
              className="h-8 text-sm"
            />
          </div>
        </div>
      </div>

      {/* 评分筛选 */}
      <div>
        <Label className="text-sm font-medium mb-4 block">用户评分</Label>
        <div className="space-y-2">
          {[
            { value: "", label: "全部评分" },
            { value: "4.5", label: "4.5星以上" },
            { value: "4.0", label: "4.0星以上" },
            { value: "3.5", label: "3.5星以上" },
            { value: "3.0", label: "3.0星以上" }
          ].map((rating) => (
            <div
              key={rating.value}
              className={`flex items-center p-2 rounded cursor-pointer transition-colors ${
                filters.rating === rating.value ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"
              }`}
              onClick={() => setFilters({ ...filters, rating: rating.value })}
            >
              {rating.value && (
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-2" />
              )}
              <span className="text-sm">{rating.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 库存状态 */}
      <div>
        <label className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-medium">仅显示有库存商品</span>
        </label>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center py-12">
          <Loading />
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
} 