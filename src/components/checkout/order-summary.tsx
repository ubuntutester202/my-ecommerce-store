"use client"

import { CreditCard, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import type { ShippingMethod, Coupon } from '@/types'

interface OrderSummaryProps {
  subtotal: number
  shippingCost: number
  discount: number
  total: number
  appliedCoupon: Coupon | null
  selectedShipping: ShippingMethod | null
  onSubmit: () => void
  isSubmitting: boolean
  disabled: boolean
}

export function OrderSummary({
  subtotal,
  shippingCost,
  discount,
  total,
  appliedCoupon,
  selectedShipping,
  onSubmit,
  isSubmitting,
  disabled
}: OrderSummaryProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(price)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          订单摘要
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 价格明细 */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">商品小计:</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">配送费用:</span>
            <span className={shippingCost === 0 ? 'text-green-600' : ''}>
              {shippingCost === 0 ? '免费' : formatPrice(shippingCost)}
            </span>
          </div>
          
          {selectedShipping && (
            <div className="text-xs text-gray-500 ml-4">
              {selectedShipping.name} - {selectedShipping.estimatedDays}
            </div>
          )}
          
          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">优惠券折扣:</span>
              <span className="text-green-600">-{formatPrice(discount)}</span>
            </div>
          )}
          
          {appliedCoupon && (
            <div className="text-xs text-gray-500 ml-4">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                {appliedCoupon.code}
              </Badge>
            </div>
          )}
        </div>

        <Separator />

        {/* 总价 */}
        <div className="flex justify-between items-center text-lg font-semibold">
          <span>应付总额:</span>
          <span className="text-red-600">{formatPrice(total)}</span>
        </div>

        {/* 优惠信息 */}
        {discount > 0 && (
          <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
            已优惠 {formatPrice(discount)}
          </div>
        )}

        <Separator />

        {/* 提交按钮 */}
        <div className="space-y-3">
          <Button
            size="lg"
            className="w-full"
            onClick={onSubmit}
            disabled={disabled || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                提交中...
              </>
            ) : (
              `立即支付 ${formatPrice(total)}`
            )}
          </Button>
          
          {disabled && (
            <p className="text-xs text-gray-500 text-center">
              请选择收货地址和配送方式
            </p>
          )}
        </div>

        {/* 支付方式提示 */}
        <div className="text-xs text-gray-500 space-y-1">
          <p className="font-medium">支持以下支付方式:</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">微信支付</Badge>
            <Badge variant="outline" className="text-xs">支付宝</Badge>
            <Badge variant="outline" className="text-xs">银行卡</Badge>
            <Badge variant="outline" className="text-xs">花呗分期</Badge>
          </div>
        </div>

        {/* 服务保障 */}
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          <h6 className="font-medium mb-2">服务保障</h6>
          <ul className="space-y-1">
            <li>✓ 7天无理由退换货</li>
            <li>✓ 正品保证</li>
            <li>✓ 极速退款</li>
            <li>✓ 全国联保</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
} 