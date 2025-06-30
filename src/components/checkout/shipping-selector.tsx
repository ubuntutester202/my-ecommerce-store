"use client"

import { Truck, Zap, Clock, Plane } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { ShippingMethod } from '@/types'

interface ShippingSelectorProps {
  selectedShipping: ShippingMethod | null
  onShippingChange: (shipping: ShippingMethod) => void
}

// 模拟配送方式数据
const shippingMethods: ShippingMethod[] = [
  {
    id: 'standard',
    name: '标准快递',
    description: '由圆通、申通、中通等快递公司配送',
    price: 0,
    estimatedDays: '3-5个工作日',
    icon: 'truck'
  },
  {
    id: 'express',
    name: '极速配送',
    description: '顺丰快递，更快更安全',
    price: 15,
    estimatedDays: '1-2个工作日',
    icon: 'zap'
  },
  {
    id: 'same-day',
    name: '当日达',
    description: '当日送达，仅限部分城市',
    price: 25,
    estimatedDays: '当日送达',
    icon: 'clock'
  },
  {
    id: 'next-day',
    name: '次日达',
    description: '次日上午送达，仅限部分城市',
    price: 20,
    estimatedDays: '次日送达',
    icon: 'plane'
  }
]

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'truck':
      return <Truck className="h-5 w-5" />
    case 'zap':
      return <Zap className="h-5 w-5" />
    case 'clock':
      return <Clock className="h-5 w-5" />
    case 'plane':
      return <Plane className="h-5 w-5" />
    default:
      return <Truck className="h-5 w-5" />
  }
}

export function ShippingSelector({ selectedShipping, onShippingChange }: ShippingSelectorProps) {
  const formatPrice = (price: number) => {
    if (price === 0) return '免费'
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(price)
  }

  return (
    <div className="space-y-3">
      {shippingMethods.map((method) => (
        <Card
          key={method.id}
          className={`cursor-pointer transition-all ${
            selectedShipping?.id === method.id
              ? 'ring-2 ring-blue-500 border-blue-500'
              : 'hover:border-gray-300'
          }`}
          onClick={() => onShippingChange(method)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  selectedShipping?.id === method.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {getIcon(method.icon || 'truck')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{method.name}</h4>
                    {method.price === 0 && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        免邮
                      </Badge>
                    )}
                    {method.id === 'same-day' && (
                      <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                        热门
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                  <p className="text-sm text-gray-500 mt-1">预计 {method.estimatedDays}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className={`font-semibold ${
                    method.price === 0 ? 'text-green-600' : 'text-gray-900'
                  }`}>
                    {formatPrice(method.price)}
                  </div>
                </div>
                {selectedShipping?.id === method.id && (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {/* 配送说明 */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <h5 className="text-sm font-medium text-blue-900 mb-2">配送说明</h5>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• 配送时间为工作日，节假日可能延后</li>
          <li>• 当日达和次日达服务仅限部分一二线城市</li>
          <li>• 偏远地区可能产生额外运费</li>
          <li>• 大件商品采用专业物流配送</li>
        </ul>
      </div>
    </div>
  )
} 