import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProductDetailView } from '@/components/product/product-detail-view'
import { type Product } from '@/types'

// 模拟产品数据 - 将来从API获取
const mockProducts: Product[] = [
  {
    id: 1,
    name: "精美时尚手表",
    description: "这款精美时尚手表采用瑞士机芯，316L不锈钢表壳，蓝宝石水晶镜面，50米防水。设计简约大方，适合商务和休闲场合佩戴。表带采用真皮材质，佩戴舒适。",
    price: 299,
    originalPrice: 399,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&h=600&fit=crop"
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
      { name: "表带宽度", value: "20mm" },
      { name: "机芯", value: "瑞士石英" },
      { name: "防水等级", value: "50米" },
      { name: "表壳材质", value: "316L不锈钢" },
      { name: "表带材质", value: "真皮", options: ["真皮", "不锈钢", "尼龙"] }
    ],
    features: [
      "瑞士进口机芯，精准计时",
      "蓝宝石水晶镜面，抗刮耐磨",
      "50米生活防水，安心使用",
      "真皮表带，佩戴舒适",
      "316L不锈钢表壳，耐腐蚀",
      "简约设计，商务休闲皆宜"
    ],
    tags: ["手表", "时尚", "商务", "礼品"],
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-01-20T10:30:00Z"
  },
  {
    id: 2,
    name: "无线蓝牙耳机",
    description: "高品质无线蓝牙耳机，采用最新蓝牙5.3技术，连接稳定，音质清晰。支持主动降噪，通话清晰，续航长达30小时。人体工学设计，佩戴舒适，适合运动、通勤、办公等多种场景。",
    price: 199,
    originalPrice: 299,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop"
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
      { name: "续航时间", value: "30小时" },
      { name: "充电时间", value: "2小时" },
      { name: "防水等级", value: "IPX5" },
      { name: "驱动单元", value: "13mm动圈" },
      { name: "颜色", value: "黑色", options: ["黑色", "白色", "蓝色"] }
    ],
    features: [
      "蓝牙5.3技术，连接稳定",
      "主动降噪，沉浸音质",
      "30小时超长续航",
      "IPX5防水，运动无忧",
      "人体工学设计，佩戴舒适",
      "一键控制，操作便捷"
    ],
    tags: ["耳机", "蓝牙", "降噪", "运动"],
    createdAt: "2024-01-20T09:00:00Z",
    updatedAt: "2024-01-22T14:15:00Z"
  }
]

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const productId = parseInt(id)
  const product = mockProducts.find(p => p.id === productId)
  
  if (!product) {
    return {
      title: '产品未找到 - EStore',
      description: '抱歉，您访问的产品不存在。'
    }
  }

  return {
    title: `${product.name} - EStore`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [
        {
          url: product.images[0],
          width: 600,
          height: 600,
          alt: product.name
        }
      ]
    }
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params
  const productId = parseInt(id)
  const product = mockProducts.find(p => p.id === productId)

  if (!product) {
    notFound()
  }

  return <ProductDetailView product={product} />
}

// 生成静态页面
export async function generateStaticParams() {
  return mockProducts.map((product) => ({
    id: product.id.toString(),
  }))
} 