import Link from "next/link"
import { ArrowRight, ShoppingBag, Truck, Shield, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductGrid } from "@/components/product/product-grid"
import { type Product } from "@/types"

export default function HomePage() {
  // 模拟产品数据 - 简化版本用于首页展示
  const featuredProducts: Product[] = [
    {
      id: 1,
      name: "精美时尚手表",
      description: "这款精美时尚手表采用瑞士机芯，316L不锈钢表壳，蓝宝石水晶镜面，50米防水。",
      price: 299,
      originalPrice: 399,
      images: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop"
      ],
      category: "配饰",
      categoryId: 1,
      brand: "ELEGANCE",
      rating: 4.8,
      reviews: 124,
      stock: 58,
      sales: 1234,
      badge: "热销",
      specifications: [
        { name: "表盘直径", value: "42mm" },
        { name: "机芯", value: "瑞士石英" }
      ],
      features: ["瑞士进口机芯，精准计时", "蓝宝石水晶镜面，抗刮耐磨"],
      tags: ["手表", "时尚", "商务"],
      createdAt: "2024-01-15T08:00:00Z",
      updatedAt: "2024-01-20T10:30:00Z"
    },
    {
      id: 2,
      name: "无线蓝牙耳机",
      description: "高品质无线蓝牙耳机，采用最新蓝牙5.3技术，连接稳定，音质清晰。",
      price: 199,
      originalPrice: 299,
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop"
      ],
      category: "数码",
      categoryId: 2,
      brand: "SOUNDTECH",
      rating: 4.6,
      reviews: 89,
      stock: 42,
      sales: 856,
      badge: "新品",
      specifications: [
        { name: "蓝牙版本", value: "5.3" },
        { name: "续航时间", value: "30小时" }
      ],
      features: ["蓝牙5.3技术，连接稳定", "主动降噪，沉浸音质"],
      tags: ["耳机", "蓝牙", "降噪"],
      createdAt: "2024-01-20T09:00:00Z",
      updatedAt: "2024-01-22T14:15:00Z"
    },
    {
      id: 3,
      name: "智能运动手环",
      description: "多功能智能运动手环，支持心率监测、睡眠分析、运动记录等功能。",
      price: 159,
      originalPrice: 219,
      images: [
        "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=300&fit=crop"
      ],
      category: "智能穿戴",
      categoryId: 3,
      brand: "FITTECH",
      rating: 4.7,
      reviews: 156,
      stock: 36,
      sales: 698,
      badge: "特价",
      specifications: [
        { name: "屏幕尺寸", value: "1.4英寸" },
        { name: "续航时间", value: "7天" }
      ],
      features: ["心率监测", "睡眠分析", "防水设计"],
      tags: ["手环", "运动", "健康"],
      createdAt: "2024-01-18T10:00:00Z",
      updatedAt: "2024-01-21T16:30:00Z"
    },
    {
      id: 4,
      name: "高品质背包",
      description: "时尚商务背包，采用防水材质，多层收纳设计，适合通勤和旅行使用。",
      price: 179,
      originalPrice: 249,
      images: [
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop"
      ],
      category: "箱包",
      categoryId: 4,
      brand: "URBANBAG",
      rating: 4.5,
      reviews: 78,
      stock: 24,
      sales: 423,
      badge: "推荐",
      specifications: [
        { name: "容量", value: "25L" },
        { name: "材质", value: "防水尼龙" }
      ],
      features: ["防水材质", "多层收纳", "舒适背负"],
      tags: ["背包", "商务", "旅行"],
      createdAt: "2024-01-12T14:00:00Z",
      updatedAt: "2024-01-19T11:45:00Z"
    }
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
        {/* 背景装饰元素 */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        </div>
        
        <div className="container relative mx-auto px-4 py-24 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
              发现优质商品
              <br />
              享受购物乐趣
            </h1>
            <p className="text-lg lg:text-xl mb-8 text-blue-100 leading-relaxed">
              EStore为您精选全球优质商品，提供贴心服务和快速配送，
              让每一次购物都成为愉快的体验。
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 hover:scale-105 transition-transform shadow-lg">
                开始购物
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 hover:scale-105 transition-transform">
                了解更多
              </Button>
            </div>
          </div>
        </div>
        
        {/* 底部波浪装饰 */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-16 text-white" fill="currentColor" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">免费配送</h3>
              <p className="text-sm text-gray-600">订单满199元享受免费配送服务</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">品质保证</h3>
              <p className="text-sm text-gray-600">所有商品均经过严格质量检测</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">24/7客服</h3>
              <p className="text-sm text-gray-600">专业客服团队随时为您服务</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">轻松退换</h3>
              <p className="text-sm text-gray-600">30天无理由退换货保障</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">热门商品</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              精选最受欢迎的商品，为您带来超值的购物体验
            </p>
          </div>
          
          <ProductGrid products={featuredProducts} />

          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/products">
                查看更多商品
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            准备开始购物了吗？
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            注册成为会员，享受专属优惠和个性化推荐服务
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              立即注册
            </Button>
            <Button size="lg" variant="outline" className="border-gray-300 text-white hover:bg-white hover:text-gray-900">
              登录账户
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
