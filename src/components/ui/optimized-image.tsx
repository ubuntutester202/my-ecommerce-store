"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fill?: boolean
  sizes?: string
  priority?: boolean
  placeholder?: "blur" | "empty"
  blurDataURL?: string
  quality?: number
  preload?: boolean
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = "",
  fill = false,
  sizes,
  priority = false,
  placeholder = "empty",
  blurDataURL,
  quality = 75,
  preload = false
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isInView, setIsInView] = useState(priority)
  const [retryCount, setRetryCount] = useState(0)
  const imgRef = useRef<HTMLDivElement>(null)
  const maxRetries = 3

  // 使用Intersection Observer进行懒加载
  useEffect(() => {
    if (priority || isInView) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px' // 提前50px开始加载
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [priority, isInView])

  // 预加载逻辑
  useEffect(() => {
    if (preload && typeof window !== 'undefined') {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      document.head.appendChild(link)
      
      return () => {
        if (link.parentNode) {
          link.parentNode.removeChild(link)
        }
      }
    }
  }, [src, preload])

  const handleLoadComplete = useCallback(() => {
    setIsLoading(false)
    setHasError(false)
  }, [])

  const handleError = useCallback(() => {
    if (retryCount < maxRetries) {
      // 延迟重试
      setTimeout(() => {
        setRetryCount(prev => prev + 1)
      }, 1000 * (retryCount + 1))
    } else {
      setHasError(true)
      setIsLoading(false)
    }
  }, [retryCount, maxRetries])

  // 生成优化的占位符
  const generatePlaceholder = useCallback((w: number, h: number) => {
    return `data:image/svg+xml;base64,${Buffer.from(
      `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f8fafc"/>
        <circle cx="50%" cy="50%" r="20" fill="#e2e8f0"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#64748b" font-family="system-ui, sans-serif" font-size="12">
          ${isLoading ? '加载中...' : '图片'}
        </text>
      </svg>`
    ).toString('base64')}`
  }, [isLoading])

  // 生成WebP支持的源URL
  const getOptimizedSrc = useCallback((originalSrc: string) => {
    if (originalSrc.includes('unsplash.com')) {
      return `${originalSrc}&auto=format&fit=crop&w=${width || 800}&q=${quality}`
    }
    return originalSrc
  }, [width, quality])

  if (hasError) {
    return (
      <div 
        ref={imgRef}
        className={`bg-slate-100 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 ${className}`}
        style={fill ? undefined : { width, height }}
        role="img"
        aria-label={`图片加载失败: ${alt}`}
      >
        <svg className="w-8 h-8 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <div className="text-slate-500 text-sm text-center">
          <div>图片加载失败</div>
          <div className="text-xs mt-1 opacity-70">请刷新页面重试</div>
        </div>
      </div>
    )
  }

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {isInView && (
        <>
          {isLoading && (
            <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center z-10">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                <div className="text-slate-600 text-xs">加载中...</div>
              </div>
            </div>
          )}
          <Image
            src={getOptimizedSrc(src)}
            alt={alt}
            width={fill ? undefined : width}
            height={fill ? undefined : height}
            fill={fill}
            sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
            priority={priority}
            placeholder={placeholder}
            blurDataURL={blurDataURL || (width && height ? generatePlaceholder(width, height) : undefined)}
            quality={quality}
            onLoad={handleLoadComplete}
            onError={handleError}
            className={`transition-all duration-500 ease-out ${
              isLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
            } ${fill ? 'object-cover' : ''}`}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
          />
        </>
      )}
    </div>
  )
} 