import { Loader2 } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

// 基础加载微调器
export function LoadingSpinner({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
    </div>
  )
}

// 页面加载组件
export function PageLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">正在加载...</p>
      </div>
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

// 通用Loading组件，兼容性导出
export const Loading = LoadingSpinner 