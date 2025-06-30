"use client"

import { useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle, Package, Truck, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCartStore } from '@/lib/store'

export default function CheckoutSuccessPage() {
  const { clearCart } = useCartStore()

  // 清空购物车（订单成功后）
  useEffect(() => {
    clearCart()
  }, [clearCart])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(price)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* 成功提示 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">支付成功！</h1>
          <p className="text-gray-600">您的订单已成功提交，我们将尽快为您安排发货</p>
        </div>

        {/* 订单信息 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              订单详情
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">订单号:</span>
              <span className="font-mono text-sm">ES20241201001</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">支付金额:</span>
              <span className="font-semibold text-lg text-red-600">{formatPrice(299.00)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">支付方式:</span>
              <span>微信支付</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">订单状态:</span>
              <Badge className="bg-green-600">已支付</Badge>
            </div>
          </CardContent>
        </Card>

        {/* 配送信息 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              配送信息
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">收货人:</span>
              <span>张三</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-gray-600">收货地址:</span>
              <span className="text-right max-w-xs">北京市朝阳区建国路88号SOHO现代城A座1001</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">配送方式:</span>
              <span>标准快递 (免费)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">预计送达:</span>
              <span>3-5个工作日</span>
            </div>
          </CardContent>
        </Card>

        {/* 后续步骤 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>接下来做什么？</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-blue-600">1</span>
              </div>
              <div>
                <h4 className="font-medium mb-1">等待发货</h4>
                <p className="text-sm text-gray-600">我们将在1-2个工作日内为您安排发货，请保持手机畅通</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-blue-600">2</span>
              </div>
              <div>
                <h4 className="font-medium mb-1">跟踪物流</h4>
                <p className="text-sm text-gray-600">发货后我们会短信通知您快递单号，您可以实时跟踪物流状态</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-blue-600">3</span>
              </div>
              <div>
                <h4 className="font-medium mb-1">确认收货</h4>
                <p className="text-sm text-gray-600">收到商品后请及时确认收货并给予评价，如有问题联系客服</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 操作按钮 */}
        <div className="space-y-3">
          <Button asChild size="lg" className="w-full">
            <Link href="/auth/profile/orders">
              查看订单详情
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" asChild>
              <Link href="/products">继续购物</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">返回首页</Link>
            </Button>
          </div>
        </div>

        {/* 客服联系 */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg text-center">
          <h5 className="font-medium mb-2">需要帮助？</h5>
          <p className="text-sm text-gray-600 mb-3">如果您对订单有任何疑问，请联系我们的客服团队</p>
          <div className="flex justify-center gap-4 text-sm">
            <span className="text-blue-600">客服电话: 400-123-4567</span>
            <span className="text-blue-600">在线客服: 9:00-21:00</span>
          </div>
        </div>
      </div>
    </div>
  )
} 