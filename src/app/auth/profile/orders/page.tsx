"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Package, Truck, CheckCircle, Clock, Eye, RefreshCw } from "lucide-react"

// 模拟订单数据
const mockOrders = [
  {
    id: "ORD-2024-001",
    date: "2024-01-15",
    status: "delivered",
    total: 299.99,
    items: [
      {
        id: 1,
        name: "无线蓝牙耳机",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100",
        price: 199.99,
        quantity: 1
      }
    ]
  }
]

const statusConfig = {
  processing: { label: "处理中", color: "bg-yellow-500", icon: Clock },
  shipping: { label: "配送中", color: "bg-blue-500", icon: Truck },
  delivered: { label: "已送达", color: "bg-green-500", icon: CheckCircle },
  cancelled: { label: "已取消", color: "bg-gray-500", icon: RefreshCw }
}

export default function OrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === "loading") {
    return <div className="container mx-auto px-4 py-8">加载中...</div>
  }

  if (!session) {
    router.push("/auth/signin")
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">我的订单</h1>
      
      {mockOrders.map((order) => {
        const statusInfo = statusConfig[order.status as keyof typeof statusConfig]
        
        return (
          <Card key={order.id} className="mb-4">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>订单 {order.id}</CardTitle>
                  <CardDescription>下单时间: {order.date}</CardDescription>
                </div>
                <Badge className={`${statusInfo.color} text-white`}>
                  {statusInfo.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 mb-4">
                  <img src={item.image} alt={item.name} className="h-16 w-16 rounded" />
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-600">¥{item.price} × {item.quantity}</p>
                  </div>
                </div>
              ))}
              <Separator className="my-4" />
              <div className="flex justify-between items-center">
                <p className="font-semibold">总计: ¥{order.total}</p>
                <Button variant="outline" size="sm">查看详情</Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
} 