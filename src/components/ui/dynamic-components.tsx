import dynamic from 'next/dynamic'
import { LoadingSpinner } from './loading'

// 动态导入购物车组件
export const DynamicCartSidebar = dynamic(
  () => import('@/components/cart/cart-sidebar').then(mod => ({ default: mod.CartSidebar })),
  {
    loading: () => <LoadingSpinner className="h-96" />,
    ssr: false
  }
)

// 动态导入产品图片库组件
export const DynamicProductImageGallery = dynamic(
  () => import('@/components/product/product-image-gallery').then(mod => ({ default: mod.ProductImageGallery })),
  {
    loading: () => (
      <div className="w-full aspect-square bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
        <LoadingSpinner />
      </div>
    ),
    ssr: true
  }
)

// 动态导入搜索栏组件
export const DynamicSearchBar = dynamic(
  () => import('@/components/search/search-bar').then(mod => ({ default: mod.SearchBar })),
  {
    loading: () => (
      <div className="w-full h-10 bg-gray-200 rounded-md animate-pulse"></div>
    ),
    ssr: false
  }
)

// 动态导入结账组件
export const DynamicCheckoutComponents = {
  AddressSelector: dynamic(
    () => import('@/components/checkout/address-selector').then(mod => ({ default: mod.AddressSelector })),
    {
      loading: () => <div className="h-32 bg-gray-200 rounded animate-pulse"></div>,
      ssr: false
    }
  ),
  
  ShippingSelector: dynamic(
    () => import('@/components/checkout/shipping-selector').then(mod => ({ default: mod.ShippingSelector })),
    {
      loading: () => <div className="h-24 bg-gray-200 rounded animate-pulse"></div>,
      ssr: false
    }
  ),
  
  CouponSection: dynamic(
    () => import('@/components/checkout/coupon-section').then(mod => ({ default: mod.CouponSection })),
    {
      loading: () => <div className="h-20 bg-gray-200 rounded animate-pulse"></div>,
      ssr: false
    }
  ),
  
  OrderSummary: dynamic(
    () => import('@/components/checkout/order-summary').then(mod => ({ default: mod.OrderSummary })),
    {
      loading: () => <div className="h-40 bg-gray-200 rounded animate-pulse"></div>,
      ssr: false
    }
  )
}

// 动态导入产品相关组件
export const DynamicProductComponents = {
  ProductDetailView: dynamic(
    () => import('@/components/product/product-detail-view').then(mod => ({ default: mod.ProductDetailView })),
    {
      loading: () => <div className="h-96 bg-gray-200 rounded animate-pulse"></div>,
      ssr: true
    }
  ),
  
  ProductGrid: dynamic(
    () => import('@/components/product/product-grid').then(mod => ({ default: mod.ProductGrid })),
    {
      loading: () => <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-64 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>,
      ssr: true
    }
  )
}

// 条件动态导入函数 - 用于未来扩展
export const conditionalImports = {
  // 管理员组件（预留）
  async loadAdminComponents() {
    if (typeof window !== 'undefined') {
      try {
        // 这些组件可以在未来添加
        console.log('管理员组件将在后续版本中添加')
        return null
      } catch {
        return null
      }
    }
    return null
  },

  // 第三方库导入（预留）
  async loadChartLibrary() {
    if (typeof window !== 'undefined') {
      try {
        // 可以在需要时安装和导入图表库
        console.log('图表库将在需要时添加')
        return null
      } catch {
        return null
      }
    }
    return null
  }
}

// 轻量级工具函数 - 用于代码分割优化
export const lazyUtils = {
  // 延迟加载工具函数（实际存在的）
  cn: () => import('@/lib/utils').then(mod => mod.cn),
  
  // 价格格式化函数（自定义）
  formatPrice: (price: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(price)
  },
  
  // 防抖函数（自定义）
  debounce: <T extends (...args: any[]) => any>(func: T, wait: number) => {
    let timeout: NodeJS.Timeout
    return (...args: Parameters<T>) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func.apply(undefined, args), wait)
    }
  }
}

// 导出类型用于类型安全
export type DynamicComponentsType = {
  DynamicCartSidebar: typeof DynamicCartSidebar
  DynamicProductImageGallery: typeof DynamicProductImageGallery
  DynamicSearchBar: typeof DynamicSearchBar
  DynamicCheckoutComponents: typeof DynamicCheckoutComponents
  DynamicProductComponents: typeof DynamicProductComponents
} 