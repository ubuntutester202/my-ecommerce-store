"use client"

import { useState, useEffect } from "react"
import { ProductCard, type Product } from "./product-card"
import { ProductGridSkeleton } from "@/components/ui/loading"

interface ProductGridProps {
  products?: Product[]
  isLoading?: boolean
  columns?: {
    mobile: number
    tablet: number
    desktop: number
  }
  className?: string
}

export function ProductGrid({ 
  products = [], 
  isLoading = false,
  columns = { mobile: 1, tablet: 2, desktop: 4 },
  className = ""
}: ProductGridProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <ProductGridSkeleton count={8} />
  }

  if (isLoading) {
    return <ProductGridSkeleton count={8} />
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">暂无商品</div>
        <p className="text-gray-400 text-sm">请稍后再试或浏览其他分类</p>
      </div>
    )
  }

  const gridCols = `grid-cols-${columns.mobile} sm:grid-cols-${columns.tablet} lg:grid-cols-${columns.desktop}`

  return (
    <div className={`grid ${gridCols} gap-6 ${className}`}>
      {products.map((product, index) => (
        <ProductCard 
          key={product.id} 
          product={product}
          className={`animate-in fade-in duration-500`}
          style={{ animationDelay: `${index * 100}ms` }}
        />
      ))}
    </div>
  )
} 