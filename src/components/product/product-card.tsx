import Link from "next/link"
import Image from "next/image"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { type Product } from "@/types"

interface ProductCardProps {
  product: Product
  className?: string
  style?: React.CSSProperties
  layout?: "grid" | "list"
}

export function ProductCard({ product, className = "", style, layout = "grid" }: ProductCardProps) {
  // 使用第一张图片作为主图，如果没有图片则使用占位符
  const mainImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop"

  if (layout === "list") {
    return (
      <Card className={`group hover:shadow-lg transition-shadow ${className}`} style={style}>
        <div className="flex">
          <div className="relative w-48 h-48 flex-shrink-0 overflow-hidden rounded-l-lg">
            <Link href={`/products/${product.id}`}>
              <Image
                src={mainImage}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                sizes="192px"
              />
            </Link>
            {product.badge && (
              <Badge className="absolute top-2 left-2">
                {product.badge}
              </Badge>
            )}
          </div>
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <Link href={`/products/${product.id}`}>
                <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer">
                  {product.name}
                </h3>
              </Link>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center gap-1 mb-3">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{product.rating}</span>
                <span className="text-sm text-gray-500">({product.reviews}条评价)</span>
                <span className="text-sm text-gray-500 ml-4">销量: {product.sales}</span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl font-bold text-red-600">¥{product.price}</span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-500 line-through">¥{product.originalPrice}</span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                库存: {product.stock > 0 ? `${product.stock}件` : "缺货"}
              </div>
              <Button variant="outline" asChild>
                <Link href={`/products/${product.id}`}>
                  查看详情
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className={`group hover:shadow-lg transition-shadow ${className}`} style={style}>
      <CardHeader className="p-0">
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          <Link href={`/products/${product.id}`}>
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          </Link>
          {product.badge && (
            <Badge className="absolute top-2 left-2">
              {product.badge}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold mb-2 line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 mb-2">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{product.rating}</span>
          <span className="text-sm text-gray-500">({product.reviews})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-red-600">¥{product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">¥{product.originalPrice}</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" variant="outline" asChild>
          <Link href={`/products/${product.id}`}>
            查看详情
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

// 导出类型以保持向后兼容
export type { Product } 