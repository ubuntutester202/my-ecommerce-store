"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Search, Filter, SlidersHorizontal, Grid, List, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
  brand: string
  priceMin: string
  priceMax: string
  rating: string
  inStock: boolean
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
  }
]

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("relevance")
  const [filters, setFilters] = useState<SearchFilters>({
    category: "",
    brand: "",
    priceMin: "",
    priceMax: "",
    rating: "",
    inStock: false
  })

  useEffect(() => {
    const searchProducts = async () => {
      setLoading(true)
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // 模拟搜索结果
        let results = MOCK_PRODUCTS
        
        if (query) {
          results = MOCK_PRODUCTS.filter(product => 
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
          )
        }

        // 应用筛选
        if (filters.category) {
          results = results.filter(p => p.category === filters.category)
        }
        if (filters.brand) {
          results = results.filter(p => p.brand === filters.brand)
        }
        if (filters.priceMin) {
          results = results.filter(p => p.price >= Number(filters.priceMin))
        }
        if (filters.priceMax) {
          results = results.filter(p => p.price <= Number(filters.priceMax))
        }
        if (filters.rating) {
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

        setProducts(results)
      } catch (error) {
        console.error("搜索失败:", error)
      } finally {
        setLoading(false)
      }
    }

    searchProducts()
  }, [query, filters, sortBy])

  const clearFilters = () => {
    setFilters({
      category: "",
      brand: "",
      priceMin: "",
      priceMax: "",
      rating: "",
      inStock: false
    })
  }

  const hasActiveFilters = Object.values(filters).some(value => 
    typeof value === "boolean" ? value : value !== ""
  )

  return (
    <div className="container mx-auto px-4 py-6">
      {/* 搜索栏 */}
      <div className="mb-6">
        <SearchBar className="max-w-2xl mx-auto" />
      </div>

      {/* 搜索信息 */}
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
          </div>
          
          <div className="flex items-center space-x-4">
            {/* 视图切换 */}
            <div className="flex items-center border rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* 排序 */}
            <Select value={sortBy} onValueChange={setSortBy}>
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
                <Button variant="outline" className="lg:hidden">
                  <Filter className="h-4 w-4 mr-2" />
                  筛选
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-2">
                      {Object.values(filters).filter(v => typeof v === "boolean" ? v : v !== "").length}
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
                <FilterSection filters={filters} setFilters={setFilters} clearFilters={clearFilters} />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* 侧边栏筛选 */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-6">
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  筛选条件
                </h3>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-xs"
                  >
                    清空
                  </Button>
                )}
              </div>
              <FilterSection filters={filters} setFilters={setFilters} clearFilters={clearFilters} />
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
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" 
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
  clearFilters 
}: { 
  filters: SearchFilters
  setFilters: (filters: SearchFilters) => void
  clearFilters: () => void
}) {
  return (
    <div className="space-y-6">
      {/* 分类筛选 */}
      <div>
        <Label className="text-sm font-medium mb-3 block">商品分类</Label>
        <Select 
          value={filters.category} 
          onValueChange={(value: string) => setFilters({ ...filters, category: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="选择分类" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">全部分类</SelectItem>
            <SelectItem value="手机数码">手机数码</SelectItem>
            <SelectItem value="电脑办公">电脑办公</SelectItem>
            <SelectItem value="数码配件">数码配件</SelectItem>
            <SelectItem value="家用电器">家用电器</SelectItem>
            <SelectItem value="服装鞋帽">服装鞋帽</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 品牌筛选 */}
      <div>
        <Label className="text-sm font-medium mb-3 block">品牌</Label>
        <Select 
          value={filters.brand} 
          onValueChange={(value: string) => setFilters({ ...filters, brand: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="选择品牌" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">全部品牌</SelectItem>
            <SelectItem value="Apple">Apple</SelectItem>
            <SelectItem value="Samsung">Samsung</SelectItem>
            <SelectItem value="Huawei">Huawei</SelectItem>
            <SelectItem value="Xiaomi">Xiaomi</SelectItem>
            <SelectItem value="Nike">Nike</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 价格范围 */}
      <div>
        <Label className="text-sm font-medium mb-3 block">价格范围</Label>
        <div className="flex space-x-2">
          <Input
            type="number"
            placeholder="最低价"
            value={filters.priceMin}
            onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
          />
          <span className="self-center text-muted-foreground">-</span>
          <Input
            type="number"
            placeholder="最高价"
            value={filters.priceMax}
            onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
          />
        </div>
      </div>

      {/* 评分筛选 */}
      <div>
        <Label className="text-sm font-medium mb-3 block">用户评分</Label>
        <Select 
          value={filters.rating} 
          onValueChange={(value: string) => setFilters({ ...filters, rating: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="选择评分" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">全部评分</SelectItem>
            <SelectItem value="4.5">
              <div className="flex items-center">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                4.5分以上
              </div>
            </SelectItem>
            <SelectItem value="4.0">
              <div className="flex items-center">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                4.0分以上
              </div>
            </SelectItem>
            <SelectItem value="3.5">
              <div className="flex items-center">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                3.5分以上
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 库存状态 */}
      <div>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
            className="rounded border-gray-300"
          />
          <span className="text-sm">仅显示有库存商品</span>
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