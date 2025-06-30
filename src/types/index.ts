// 产品相关类型
export interface Product {
  id: number
  name: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  categoryId: number
  brand: string
  rating: number
  reviews: number
  stock: number
  sales: number
  badge?: string
  specifications: ProductSpecification[]
  features: string[]
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface ProductSpecification {
  name: string
  value: string
  options?: string[]
}

export interface ProductVariant {
  id: number
  productId: number
  name: string
  value: string
  price?: number
  stock?: number
  image?: string
}

// 购物车相关类型
export interface CartItem {
  id: number
  productId: number
  name: string
  price: number
  quantity: number
  image: string
  variant?: {
    size?: string
    color?: string
    [key: string]: string | undefined
  }
  maxStock: number
}

export interface Cart {
  items: CartItem[]
  total: number
  itemCount: number
}

// 用户相关类型
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  phone?: string
  addresses: Address[]
  createdAt: string
}

export interface Address {
  id: string
  userId: string
  name: string
  phone: string
  province: string
  city: string
  district: string
  street: string
  zipCode: string
  isDefault: boolean
}

// 订单相关类型
export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  shippingAddress: Address
  paymentMethod: string
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  orderId: string
  productId: number
  name: string
  price: number
  quantity: number
  image: string
  variant?: {
    size?: string
    color?: string
    [key: string]: string | undefined
  }
}

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'

// 收藏夹类型
export interface WishlistItem {
  id: string
  userId: string
  productId: number
  product: Product
  createdAt: string
}

// 分类类型
export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: number
  children?: Category[]
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// 分页类型
export interface PaginationParams {
  page: number
  limit: number
  total?: number
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
} 