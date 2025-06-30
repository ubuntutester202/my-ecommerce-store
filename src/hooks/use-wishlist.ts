"use client"

import { useState, useEffect } from 'react'
import { type Product } from '@/types'

interface WishlistItem {
  id: number
  product: Product
  addedAt: string
}

export function useWishlist() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 从localStorage加载收藏数据
  useEffect(() => {
    const loadWishlist = () => {
      try {
        const saved = localStorage.getItem('estore-wishlist')
        if (saved) {
          setWishlist(JSON.parse(saved))
        }
      } catch (error) {
        console.error('加载收藏列表失败:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadWishlist()
  }, [])

  // 保存到localStorage
  const saveToStorage = (newWishlist: WishlistItem[]) => {
    try {
      localStorage.setItem('estore-wishlist', JSON.stringify(newWishlist))
    } catch (error) {
      console.error('保存收藏列表失败:', error)
    }
  }

  // 添加到收藏
  const addToWishlist = (product: Product) => {
    const newItem: WishlistItem = {
      id: Date.now(),
      product,
      addedAt: new Date().toISOString()
    }
    
    const newWishlist = [...wishlist, newItem]
    setWishlist(newWishlist)
    saveToStorage(newWishlist)
  }

  // 从收藏中移除
  const removeFromWishlist = (productId: number) => {
    const newWishlist = wishlist.filter(item => item.product.id !== productId)
    setWishlist(newWishlist)
    saveToStorage(newWishlist)
  }

  // 切换收藏状态
  const toggleWishlist = (product: Product) => {
    const isInWishlist = wishlist.some(item => item.product.id === product.id)
    
    if (isInWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  // 检查是否已收藏
  const isInWishlist = (productId: number) => {
    return wishlist.some(item => item.product.id === productId)
  }

  // 清空收藏列表
  const clearWishlist = () => {
    setWishlist([])
    saveToStorage([])
  }

  return {
    wishlist,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
    itemCount: wishlist.length
  }
} 