"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { MapPin, Truck, Tag, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useCartStore } from '@/lib/store'
import { AddressSelector } from '@/components/checkout/address-selector'
import { ShippingSelector } from '@/components/checkout/shipping-selector'
import { OrderSummary } from '@/components/checkout/order-summary'
import { CouponSection } from '@/components/checkout/coupon-section'
import type { Address, ShippingMethod, Coupon } from '@/types'

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { getSelectedItems, selectedTotal, selectedCount } = useCartStore()
  
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const [selectedShipping, setSelectedShipping] = useState<ShippingMethod | null>(null)
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedItems = getSelectedItems()

  // 如果用户未登录，跳转到登录页
  if (!session) {
    router.push('/auth/signin?callbackUrl=/checkout')
    return null
  }

  // 如果没有选中商品，跳转到购物车
  if (selectedItems.length === 0) {
    router.push('/')
    return null
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(price)
  }

  // 计算费用
  const subtotal = selectedTotal
  const shippingCost = selectedShipping?.price || 0
  const discount = appliedCoupon ? calculateDiscount(subtotal, appliedCoupon) : 0
  const total = subtotal + shippingCost - discount

  function calculateDiscount(amount: number, coupon: Coupon): number {
    if (amount < coupon.minOrder) return 0
    
    if (coupon.type === 'percentage') {
      const discount = amount * (coupon.value / 100)
      return coupon.maxDiscount ? Math.min(discount, coupon.maxDiscount) : discount
    } else {
      return Math.min(coupon.value, amount)
    }
  }

  const handleSubmitOrder = async () => {
    if (!selectedAddress || !selectedShipping) {
      alert('请选择收货地址和配送方式')
      return
    }

    setIsSubmitting(true)
    try {
      // 这里会调用支付API
      console.log('提交订单:', {
        items: selectedItems,
        address: selectedAddress,
        shipping: selectedShipping,
        coupon: appliedCoupon,
        total
      })
      
      // 模拟提交延迟
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // 跳转到支付页面或成功页面
      router.push('/checkout/success')
    } catch (error) {
      console.error('订单提交失败:', error)
      alert('订单提交失败，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">确认订单</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：结账信息 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 选中的商品 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  商品清单 ({selectedCount}件)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedItems.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                    <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm mb-1">{item.name}</h4>
                      {item.variant && Object.keys(item.variant).length > 0 && (
                        <div className="text-xs text-gray-500 mb-2">
                          {Object.entries(item.variant).map(([key, value]) => (
                            <span key={key} className="mr-2">
                              {key}: {value}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">x{item.quantity}</span>
                        <span className="font-medium text-red-600">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 收货地址 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  收货地址
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AddressSelector
                  selectedAddress={selectedAddress}
                  onAddressChange={setSelectedAddress}
                />
              </CardContent>
            </Card>

            {/* 配送方式 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  配送方式
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ShippingSelector
                  selectedShipping={selectedShipping}
                  onShippingChange={setSelectedShipping}
                />
              </CardContent>
            </Card>

            {/* 优惠券 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  优惠券
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CouponSection
                  subtotal={subtotal}
                  appliedCoupon={appliedCoupon}
                  onCouponChange={setAppliedCoupon}
                />
              </CardContent>
            </Card>
          </div>

          {/* 右侧：订单摘要 */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <OrderSummary
                subtotal={subtotal}
                shippingCost={shippingCost}
                discount={discount}
                total={total}
                appliedCoupon={appliedCoupon}
                selectedShipping={selectedShipping}
                onSubmit={handleSubmitOrder}
                isSubmitting={isSubmitting}
                disabled={!selectedAddress || !selectedShipping}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 