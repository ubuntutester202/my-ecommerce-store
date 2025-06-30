"use client"

import { useState } from 'react'
import { Minus, Plus, Heart, Share2, Star, ShoppingCart, Shield, Truck, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ProductImageGallery } from './product-image-gallery'
import { type Product } from '@/types'
import { useCartStore } from '@/lib/store'
import { useWishlist } from '@/hooks/use-wishlist'
import { cn } from '@/lib/utils'

interface ProductDetailViewProps {
  product: Product
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedSpecs, setSelectedSpecs] = useState<Record<string, string>>({})
  
  const { addItem, isInCart } = useCartStore()
  const { toggleWishlist, isInWishlist } = useWishlist()
  
  const isFavorited = isInWishlist(product.id)
  const isInShoppingCart = isInCart(product.id)

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, Math.min(product.stock, prev + delta)))
  }

  const handleSpecChange = (specName: string, value: string) => {
    setSelectedSpecs(prev => ({
      ...prev,
      [specName]: value
    }))
  }

  const addToCart = () => {
    addItem(product, quantity, selectedSpecs)
    // 重置数量为1
    setQuantity(1)
  }

  const toggleFavorite = () => {
    toggleWishlist(product)
  }

  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      }).catch(console.error)
    } else {
      // 复制链接到剪贴板
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('链接已复制到剪贴板'))
        .catch(() => alert('分享功能暂不可用'))
    }
  }

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* 左侧：产品图片 */}
        <div className="w-full">
          <ProductImageGallery 
            images={product.images} 
            productName={product.name}
          />
        </div>

        {/* 右侧：产品信息 */}
        <div className="space-y-6">
          {/* 产品标题和徽章 */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              {product.badge && (
                <Badge variant="secondary">{product.badge}</Badge>
              )}
              <span className="text-sm text-gray-500">{product.brand}</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-4">{product.name}</h1>
            
            {/* 评分和评论 */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{product.rating}</span>
                <span className="text-gray-500">({product.reviews} 评论)</span>
              </div>
              <div className="text-sm text-gray-500">
                销量: {product.sales}
              </div>
            </div>
          </div>

          {/* 价格 */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-red-600">¥{product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-gray-500 line-through">¥{product.originalPrice}</span>
                  <Badge variant="destructive" className="text-xs">
                    省¥{product.originalPrice - product.price}
                  </Badge>
                </>
              )}
            </div>
            {discountPercentage > 0 && (
              <div className="text-sm text-green-600">
                限时优惠 {discountPercentage}% OFF
              </div>
            )}
          </div>

          <Separator />

          {/* 规格选择 */}
          {product.specifications.some(spec => spec.options) && (
            <div className="space-y-4">
              <h3 className="font-semibold">选择规格</h3>
              {product.specifications
                .filter(spec => spec.options && spec.options.length > 0)
                .map((spec) => (
                  <div key={spec.name} className="space-y-2">
                    <label className="text-sm font-medium">{spec.name}</label>
                    <div className="flex flex-wrap gap-2">
                      {spec.options!.map((option) => (
                        <button
                          key={option}
                          className={cn(
                            "px-3 py-2 text-sm border rounded-md transition-colors",
                            selectedSpecs[spec.name] === option
                              ? "bg-blue-500 text-white border-blue-500"
                              : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                          )}
                          onClick={() => handleSpecChange(spec.name, option)}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* 数量选择 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">数量</label>
            <div className="flex items-center gap-3">
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-sm text-gray-500">
                库存: {product.stock} 件
              </span>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="space-y-3">
            <div className="flex gap-3">
              <Button 
                size="lg" 
                className="flex-1"
                onClick={addToCart}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {product.stock === 0 ? '已售罄' : isInShoppingCart ? '再次添加' : '加入购物车'}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={toggleFavorite}
                className={cn(
                  "transition-colors",
                  isFavorited && "text-red-500 border-red-500 bg-red-50"
                )}
              >
                <Heart className={cn("h-5 w-5", isFavorited && "fill-current")} />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={shareProduct}
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
            
            <Button variant="outline" size="lg" className="w-full">
              立即购买
            </Button>
          </div>

          {/* 服务保障 */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-3">服务保障</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>品质保证</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-blue-500" />
                  <span>免费配送</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 text-orange-500" />
                  <span>30天退换</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 产品详情 */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 产品描述 */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">产品描述</h3>
            <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>
            
            <h4 className="font-semibold mb-3">产品特色</h4>
            <ul className="space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* 规格参数 */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">规格参数</h3>
            <div className="space-y-3">
              {product.specifications.map((spec, index) => (
                <div key={index} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <span className="text-gray-600">{spec.name}</span>
                  <span className="font-medium">{spec.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 