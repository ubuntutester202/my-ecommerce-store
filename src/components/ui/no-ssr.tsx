"use client"

import { useEffect, useState } from "react"

interface NoSSRProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * NoSSR组件用于防止hydration不匹配错误
 * 只在客户端渲染内容，避免服务器端渲染和客户端渲染不一致的问题
 */
export function NoSSR({ children, fallback = null }: NoSSRProps) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return <>{fallback}</>
  }

  return <>{children}</>
} 