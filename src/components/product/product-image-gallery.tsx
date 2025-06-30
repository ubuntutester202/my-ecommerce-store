"use client"

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ProductImageGalleryProps {
  images: string[]
  productName: string
  className?: string
}

export function ProductImageGallery({ 
  images, 
  productName, 
  className 
}: ProductImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const selectImage = (index: number) => {
    setCurrentIndex(index)
  }

  const toggleZoom = () => {
    setIsZoomed(!isZoomed)
  }

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-400">暂无图片</span>
      </div>
    )
  }

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* 主图区域 */}
      <div className="relative group">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={images[currentIndex]}
            alt={`${productName} - 图片 ${currentIndex + 1}`}
            fill
            className={cn(
              "object-cover transition-transform duration-300",
              isZoomed ? "scale-150 cursor-zoom-out" : "scale-100 cursor-zoom-in"
            )}
            onClick={toggleZoom}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          
          {/* 左右导航按钮 */}
          {images.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={prevImage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={nextImage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* 放大镜按钮 */}
          <Button
            variant="outline"
            size="icon"
            className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={toggleZoom}
          >
            <Expand className="h-4 w-4" />
          </Button>

          {/* 图片指示器 */}
          {images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    index === currentIndex ? "bg-white" : "bg-white/50"
                  )}
                  onClick={() => selectImage(index)}
                  aria-label={`查看第 ${index + 1} 张图片`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 缩略图区域 */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              className={cn(
                "relative aspect-square overflow-hidden rounded-md border-2 transition-colors",
                index === currentIndex 
                  ? "border-blue-500" 
                  : "border-gray-200 hover:border-gray-300"
              )}
              onClick={() => selectImage(index)}
            >
              <Image
                src={image}
                alt={`${productName} - 缩略图 ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, 12vw"
              />
            </button>
          ))}
        </div>
      )}

      {/* 图片计数 */}
      <div className="text-center text-sm text-gray-500">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  )
} 