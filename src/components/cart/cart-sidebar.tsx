"use client"

import { Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { useCartStore } from '@/lib/store'
import { NoSSR } from '@/components/ui/no-ssr'

interface CartSidebarProps {
  children: React.ReactNode
}

export function CartSidebar({ children }: CartSidebarProps) {
  return (
    <NoSSR>
      <Sheet>
        <SheetTrigger asChild>
          {children}
        </SheetTrigger>
        <CartContent />
      </Sheet>
    </NoSSR>
  )
}

function CartContent() {
  const { 
    items, 
    total, 
    itemCount, 
    selectedTotal,
    selectedCount,
    updateQuantity, 
    removeItem, 
    clearCart,
    toggleSelectItem,
    toggleSelectAll,
    isAllSelected,
    hasSelectedItems
  } = useCartStore()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(price)
  }

  return (
    <SheetContent className="w-full sm:max-w-lg">
      <SheetHeader>
        <SheetTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          购物车
          {itemCount > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {itemCount} 件商品
            </Badge>
          )}
        </SheetTitle>
      </SheetHeader>

      <div className="flex flex-col h-full">
        {/* 购物车商品列表 */}
        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">购物车为空</h3>
              <p className="text-gray-500 mb-6">快去挑选您喜欢的商品吧！</p>
              <Button asChild>
                <Link href="/products">开始购物</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* 全选控制 */}
              <div className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50">
                <Checkbox
                  id="select-all"
                  checked={isAllSelected()}
                  onCheckedChange={toggleSelectAll}
                  className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
                  全选 ({items.length}件商品)
                </label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto text-red-500 hover:text-red-700"
                  onClick={clearCart}
                >
                  清空购物车
                </Button>
              </div>

              {/* 商品列表 */}
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 p-3 border rounded-lg">
                  {/* 商品选择框 */}
                  <div className="flex items-start pt-1">
                    <Checkbox
                      checked={item.selected}
                      onCheckedChange={() => toggleSelectItem(item.id)}
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                  </div>

                  {/* 商品图片 */}
                  <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>

                  {/* 商品信息 */}
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-medium text-sm leading-tight mb-1 line-clamp-2 ${
                      item.selected ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {item.name}
                    </h4>
                    
                    {/* 规格信息 */}
                    {item.variant && Object.keys(item.variant).length > 0 && (
                      <div className={`text-xs mb-2 ${
                        item.selected ? 'text-gray-500' : 'text-gray-300'
                      }`}>
                        {Object.entries(item.variant).map(([key, value]) => (
                          <span key={key} className="mr-2">
                            {key}: {value}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className={`font-medium ${
                        item.selected ? 'text-red-600' : 'text-gray-400'
                      }`}>
                        {formatPrice(item.price)}
                      </span>
                      
                      {/* 数量控制 */}
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={!item.selected}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className={`w-8 text-center text-sm ${
                          item.selected ? 'text-gray-900' : 'text-gray-400'
                        }`}>
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.maxStock || !item.selected}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 购物车底部 */}
        {items.length > 0 && (
          <div className="border-t pt-4 space-y-4">
            <Separator />

            {/* 统计信息 */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>商品总价:</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>已选商品 ({selectedCount}件):</span>
                <span className="text-red-600">{formatPrice(selectedTotal)}</span>
              </div>
            </div>

            {/* 结账按钮 */}
            <div className="space-y-2">
              <Button 
                size="lg" 
                className="w-full" 
                asChild
                disabled={!hasSelectedItems()}
              >
                <Link href="/checkout">
                  去结算 ({selectedCount})
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="w-full" asChild>
                <Link href="/products">
                  继续购物
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </SheetContent>
  )
} 