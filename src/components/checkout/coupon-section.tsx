"use client"

import { useState } from 'react'
import { Tag, Plus, X, Percent, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { Coupon } from '@/types'

interface CouponSectionProps {
  subtotal: number
  appliedCoupon: Coupon | null
  onCouponChange: (coupon: Coupon | null) => void
}

// 模拟优惠券数据
const availableCoupons: Coupon[] = [
  {
    id: 'NEW10',
    code: 'NEW10',
    name: '新用户专享',
    description: '新用户首单立减10元',
    type: 'fixed',
    value: 10,
    minOrder: 50,
    expiresAt: '2024-12-31',
    isActive: true
  },
  {
    id: 'SAVE20',
    code: 'SAVE20',
    name: '满200减20',
    description: '单笔订单满200元立减20元',
    type: 'fixed',
    value: 20,
    minOrder: 200,
    expiresAt: '2024-12-31',
    isActive: true
  },
  {
    id: 'PERCENT15',
    code: 'PERCENT15',
    name: '全场8.5折',
    description: '全场商品享受8.5折优惠',
    type: 'percentage',
    value: 15,
    minOrder: 100,
    maxDiscount: 50,
    expiresAt: '2024-12-31',
    isActive: true
  },
  {
    id: 'VIP30',
    code: 'VIP30',
    name: 'VIP专享',
    description: 'VIP会员专享满300减30',
    type: 'fixed',
    value: 30,
    minOrder: 300,
    expiresAt: '2024-12-31',
    isActive: true
  }
]

export function CouponSection({ subtotal, appliedCoupon, onCouponChange }: CouponSectionProps) {
  const [couponCode, setCouponCode] = useState('')
  const [showAvailable, setShowAvailable] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(price)
  }

  const formatExpiryDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN')
  }

  const calculateDiscount = (coupon: Coupon): number => {
    if (subtotal < coupon.minOrder) return 0
    
    if (coupon.type === 'percentage') {
      const discount = subtotal * (coupon.value / 100)
      return coupon.maxDiscount ? Math.min(discount, coupon.maxDiscount) : discount
    } else {
      return Math.min(coupon.value, subtotal)
    }
  }

  const isEligible = (coupon: Coupon): boolean => {
    return subtotal >= coupon.minOrder
  }

  const handleApplyCoupon = () => {
    const coupon = availableCoupons.find(c => c.code.toLowerCase() === couponCode.toLowerCase())
    if (!coupon) {
      alert('优惠券不存在或已过期')
      return
    }
    
    if (!isEligible(coupon)) {
      alert(`订单金额需满${formatPrice(coupon.minOrder)}才能使用此优惠券`)
      return
    }

    onCouponChange(coupon)
    setCouponCode('')
  }

  const handleRemoveCoupon = () => {
    onCouponChange(null)
  }

  const handleSelectCoupon = (coupon: Coupon) => {
    if (!isEligible(coupon)) {
      alert(`订单金额需满${formatPrice(coupon.minOrder)}才能使用此优惠券`)
      return
    }
    onCouponChange(coupon)
    setShowAvailable(false)
  }

  const eligibleCoupons = availableCoupons.filter(coupon => isEligible(coupon))
  const ineligibleCoupons = availableCoupons.filter(coupon => !isEligible(coupon))

  return (
    <div className="space-y-4">
      {/* 当前应用的优惠券 */}
      {appliedCoupon ? (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Tag className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-600">{appliedCoupon.code}</Badge>
                    <span className="font-medium text-green-800">{appliedCoupon.name}</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">
                    已优惠 {formatPrice(calculateDiscount(appliedCoupon))}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveCoupon}
                className="text-green-600 hover:text-green-700 hover:bg-green-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* 输入优惠券码 */}
          <div className="flex gap-2">
            <Input
              placeholder="请输入优惠券码"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
            />
            <Button 
              onClick={handleApplyCoupon}
              disabled={!couponCode.trim()}
            >
              使用
            </Button>
          </div>

          {/* 可用优惠券按钮 */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowAvailable(!showAvailable)}
          >
            <Tag className="h-4 w-4 mr-2" />
            查看可用优惠券 ({eligibleCoupons.length}张)
          </Button>
        </>
      )}

      {/* 可用优惠券列表 */}
      {showAvailable && !appliedCoupon && (
        <div className="space-y-3">
          <Separator />
          
          {/* 可用优惠券 */}
          {eligibleCoupons.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-gray-900 mb-3">可使用 ({eligibleCoupons.length}张)</h5>
              <div className="space-y-2">
                {eligibleCoupons.map((coupon) => (
                  <Card key={coupon.id} className="cursor-pointer hover:border-blue-300" onClick={() => handleSelectCoupon(coupon)}>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            {coupon.type === 'percentage' ? (
                              <Percent className="h-4 w-4 text-blue-600" />
                            ) : (
                              <DollarSign className="h-4 w-4 text-blue-600" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">{coupon.code}</Badge>
                              <span className="font-medium text-sm">{coupon.name}</span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">{coupon.description}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              有效期至: {formatExpiryDate(coupon.expiresAt)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-blue-600">
                            -{formatPrice(calculateDiscount(coupon))}
                          </div>
                          <Button size="sm" variant="outline" className="mt-1">
                            使用
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* 不可用优惠券 */}
          {ineligibleCoupons.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-gray-500 mb-3">不满足条件 ({ineligibleCoupons.length}张)</h5>
              <div className="space-y-2">
                {ineligibleCoupons.map((coupon) => (
                  <Card key={coupon.id} className="opacity-50">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            {coupon.type === 'percentage' ? (
                              <Percent className="h-4 w-4 text-gray-400" />
                            ) : (
                              <DollarSign className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="border-gray-300 text-gray-500">{coupon.code}</Badge>
                              <span className="font-medium text-sm text-gray-500">{coupon.name}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{coupon.description}</p>
                            <p className="text-xs text-red-500 mt-1">
                              需满{formatPrice(coupon.minOrder)}可用
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-400">
                            -
                            {coupon.type === 'percentage' 
                              ? `${coupon.value}%` 
                              : formatPrice(coupon.value)
                            }
                          </div>
                          <Button size="sm" variant="outline" disabled className="mt-1">
                            不可用
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 