import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type CartItem, type Product } from '@/types'

interface CartStore {
  items: CartItem[]
  isLoading: boolean
  
  // 计算属性
  itemCount: number
  total: number
  
  // 购物车操作
  addItem: (product: Product, quantity?: number, variant?: Record<string, string>) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  
  // 辅助方法
  getItem: (productId: number) => CartItem | undefined
  isInCart: (productId: number) => boolean
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      
      // 计算属性
      get itemCount() {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
      
      get total() {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0)
      },
      
      // 添加商品到购物车
      addItem: (product: Product, quantity = 1, variant = {}) => {
        const items = get().items
        const existingItemIndex = items.findIndex(
          item => item.productId === product.id && 
          JSON.stringify(item.variant) === JSON.stringify(variant)
        )
        
        if (existingItemIndex >= 0) {
          // 如果商品已存在，增加数量
          const updatedItems = [...items]
          const newQuantity = updatedItems[existingItemIndex].quantity + quantity
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: Math.min(newQuantity, product.stock) // 限制最大数量
          }
          set({ items: updatedItems })
        } else {
          // 添加新商品
          const newItem: CartItem = {
            id: Date.now(),
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: Math.min(quantity, product.stock),
            image: product.images[0] || '',
            variant,
            maxStock: product.stock
          }
          set({ items: [...items, newItem] })
        }
      },
      
      // 从购物车移除商品
      removeItem: (id: number) => {
        set({ items: get().items.filter(item => item.id !== id) })
      },
      
      // 更新商品数量
      updateQuantity: (id: number, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        
        const items = get().items
        const updatedItems = items.map(item => {
          if (item.id === id) {
            return {
              ...item,
              quantity: Math.min(quantity, item.maxStock)
            }
          }
          return item
        })
        set({ items: updatedItems })
      },
      
      // 清空购物车
      clearCart: () => {
        set({ items: [] })
      },
      
      // 获取购物车中的商品
      getItem: (productId: number) => {
        return get().items.find(item => item.productId === productId)
      },
      
      // 检查商品是否在购物车中
      isInCart: (productId: number) => {
        return get().items.some(item => item.productId === productId)
      }
    }),
    {
      name: 'estore-cart', // localStorage key
      partialize: (state) => ({ items: state.items }) // 只持久化items
    }
  )
) 