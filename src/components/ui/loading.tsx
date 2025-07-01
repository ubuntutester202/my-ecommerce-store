import { Loader2, ShoppingCart, Package, CreditCard } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

// 基础加载微调器
export function LoadingSpinner({ className = "", size = "default" }: { className?: string, size?: "small" | "default" | "large" }) {
  const sizeClasses = {
    small: "h-4 w-4",
    default: "h-8 w-8", 
    large: "h-12 w-12"
  }
  
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600`} />
    </div>
  )
}

// 脉冲加载器
export function PulseLoader({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
      <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
    </div>
  )
}

// 渐进式加载器
export function ProgressLoader({ progress = 0, className = "" }: { progress?: number, className?: string }) {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>加载中...</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  )
}

// 页面加载组件
export function PageLoading({ message = "正在加载..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-100 rounded-full animate-pulse"></div>
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 absolute inset-2" />
        </div>
        <p className="text-gray-600 mt-4 text-lg">{message}</p>
        <div className="mt-2">
          <PulseLoader />
        </div>
      </div>
    </div>
  )
}

// 页面切换加载
export function PageTransitionLoading() {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 bg-white rounded-lg shadow-lg p-4">
          <LoadingSpinner size="small" />
          <span className="text-gray-700">页面跳转中...</span>
        </div>
      </div>
    </div>
  )
}

// 购物相关加载
export function ShoppingLoadingState({ type, message }: { type: 'cart' | 'checkout' | 'payment', message?: string }) {
  const icons = {
    cart: <ShoppingCart className="h-8 w-8 text-blue-600" />,
    checkout: <Package className="h-8 w-8 text-blue-600" />,
    payment: <CreditCard className="h-8 w-8 text-blue-600" />
  }
  
  const defaultMessages = {
    cart: '正在加载购物车...',
    checkout: '正在处理订单...',
    payment: '正在处理支付...'
  }
  
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative mb-4">
        {icons[type]}
        <div className="absolute -inset-2 border-2 border-blue-200 rounded-full animate-ping"></div>
      </div>
      <p className="text-gray-600">{message || defaultMessages[type]}</p>
    </div>
  )
}

// 产品卡片骨架屏
export function ProductCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader className="p-0">
        <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="flex items-center gap-2">
          <div className="h-5 bg-gray-200 rounded w-16"></div>
          <div className="h-3 bg-gray-200 rounded w-12"></div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="h-9 bg-gray-200 rounded w-full"></div>
      </CardFooter>
    </Card>
  )
}

// 产品网格骨架屏
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  )
}

// 文本行骨架屏
export function TextSkeleton({ lines = 3, className = "" }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div 
          key={index} 
          className={`h-4 bg-gray-200 rounded animate-pulse ${
            index === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        ></div>
      ))}
    </div>
  )
}

// 按钮加载状态
interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  isLoading?: boolean
  className?: string
}

export function LoadingButton({ 
  children, 
  isLoading = false, 
  className = "",
  ...props 
}: LoadingButtonProps) {
  return (
    <button 
      className={`inline-flex items-center justify-center gap-2 ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
}

// 搜索加载状态
export function SearchLoading() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="relative inline-block">
          <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-gray-600">搜索中...</p>
      </div>
    </div>
  )
}

// 数据表格骨架屏
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number, columns?: number }) {
  return (
    <div className="w-full">
      {/* 表头 */}
      <div className="grid gap-4 p-4 border-b" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, index) => (
          <div key={`header-${index}`} className="h-4 bg-gray-300 rounded animate-pulse"></div>
        ))}
      </div>
      
      {/* 表格行 */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="grid gap-4 p-4 border-b" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={`cell-${rowIndex}-${colIndex}`} className="h-4 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      ))}
    </div>
  )
}

// 用户信息骨架屏
export function UserProfileSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* 头像和基本信息 */}
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
      </div>
      
      {/* 表单字段 */}
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

// 订单列表骨架屏
export function OrderListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="animate-pulse">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="h-5 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// 导航栏骨架屏
export function NavbarSkeleton() {
  return (
    <div className="h-16 border-b bg-white animate-pulse">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-200 rounded"></div>
          <div className="w-20 h-6 bg-gray-200 rounded"></div>
        </div>
        <div className="hidden md:flex space-x-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="w-16 h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="flex items-center space-x-4">
          <div className="w-64 h-10 bg-gray-200 rounded"></div>
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}

// 通用Loading组件，兼容性导出
export const Loading = LoadingSpinner 