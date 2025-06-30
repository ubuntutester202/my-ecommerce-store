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
}

export function ProductCard({ product, className = "", style }: ProductCardProps) {
  // 使用第一张图片作为主图，如果没有图片则使用占位符
  const mainImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop"

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