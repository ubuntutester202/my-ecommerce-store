"use client"

import { useState, useEffect, useRef } from "react"
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
  blurDataURL
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isInView, setIsInView] = useState(priority)
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (priority) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [priority])

  const handleLoadComplete = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setHasError(true)
    setIsLoading(false)
  }

  // 生成简单的占位符
  const generatePlaceholder = (w: number, h: number) => {
    return `data:image/svg+xml;base64,${Buffer.from(
      `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="Arial, sans-serif" font-size="14">
          加载中...
        </text>
      </svg>`
    ).toString('base64')}`
  }

  if (hasError) {
    return (
      <div 
        ref={imgRef}
        className={`bg-gray-100 flex items-center justify-center ${className}`}
        style={fill ? undefined : { width, height }}
      >
        <div className="text-gray-400 text-sm">图片加载失败</div>
      </div>
    )
  }

  return (
    <div ref={imgRef} className={className}>
      {isInView && (
        <>
          {isLoading && (
            <div 
              className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center"
            >
              <div className="text-gray-400 text-xs">加载中...</div>
            </div>
          )}
          <Image
            src={src}
            alt={alt}
            width={fill ? undefined : width}
            height={fill ? undefined : height}
            fill={fill}
            sizes={sizes}
            priority={priority}
            placeholder={placeholder}
            blurDataURL={blurDataURL || (width && height ? generatePlaceholder(width, height) : undefined)}
            onLoad={handleLoadComplete}
            onError={handleError}
            className={`transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            } ${fill ? 'object-cover' : ''}`}
          />
        </>
      )}
    </div>
  )
} 