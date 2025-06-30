"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Clock, TrendingUp, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"


interface SearchBarProps {
  placeholder?: string
  className?: string
  showSuggestions?: boolean
  onSearch?: (query: string) => void
}

interface SearchSuggestion {
  id: string
  text: string
  type: 'product' | 'category' | 'brand'
  count?: number
}

const POPULAR_SEARCHES = [
  "iPhone", "笔记本电脑", "运动鞋", "无线耳机", "连衣裙", 
  "护肤品", "咖啡", "背包", "手表", "游戏手柄"
]

export function SearchBar({ 
  placeholder = "搜索商品...", 
  className = "",
  showSuggestions = true,
  onSearch 
}: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // 加载搜索历史
  useEffect(() => {
    const history = localStorage.getItem('searchHistory')
    if (history) {
      setSearchHistory(JSON.parse(history))
    }
  }, [])

  // 点击外部关闭建议框
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // 实时搜索建议
  useEffect(() => {
    if (!query.trim() || !showSuggestions) {
      setSuggestions([])
      return
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true)
      try {
        // 模拟API调用获取搜索建议
        const mockSuggestions: SearchSuggestion[] = [
          { id: '1', text: `${query} 手机`, type: 'product' as const, count: 128 },
          { id: '2', text: `${query} 配件`, type: 'category' as const, count: 85 },
          { id: '3', text: `${query} 品牌`, type: 'brand' as const, count: 42 },
        ].filter(s => s.text.toLowerCase().includes(query.toLowerCase()))
        
        setSuggestions(mockSuggestions)
      } catch (error) {
        console.error('获取搜索建议失败:', error)
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, showSuggestions])

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return

    // 保存到搜索历史
    const newHistory = [searchQuery, ...searchHistory.filter(h => h !== searchQuery)].slice(0, 10)
    setSearchHistory(newHistory)
    localStorage.setItem('searchHistory', JSON.stringify(newHistory))

    setIsOpen(false)
    setQuery(searchQuery)

    if (onSearch) {
      onSearch(searchQuery)
    } else {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    if (value.trim() && showSuggestions) {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch(query)
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  const clearHistory = () => {
    setSearchHistory([])
    localStorage.removeItem('searchHistory')
  }

  const removeHistoryItem = (item: string) => {
    const newHistory = searchHistory.filter(h => h !== item)
    setSearchHistory(newHistory)
    localStorage.setItem('searchHistory', JSON.stringify(newHistory))
  }

  return (
    <div ref={searchRef} className={`relative w-full ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => showSuggestions && setIsOpen(true)}
          className="pl-9 pr-10"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2"
            onClick={() => {
              setQuery("")
              setIsOpen(false)
              inputRef.current?.focus()
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* 搜索建议下拉框 */}
      {isOpen && showSuggestions && (
        <div className="absolute top-full mt-1 w-full rounded-md border bg-popover shadow-lg z-50">
          <div className="max-h-96 overflow-y-auto p-2">
            {/* 搜索建议 */}
            {query.trim() && (
              <div className="mb-4">
                <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                  搜索建议
                </div>
                {isLoading ? (
                  <div className="px-2 py-2 text-sm text-muted-foreground">
                    搜索中...
                  </div>
                ) : suggestions.length > 0 ? (
                  <div className="space-y-1">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        className="w-full px-2 py-2 text-left text-sm hover:bg-accent rounded-sm flex items-center justify-between"
                        onClick={() => handleSearch(suggestion.text)}
                      >
                        <div className="flex items-center space-x-2">
                          <Search className="h-3 w-3 text-muted-foreground" />
                          <span>{suggestion.text}</span>
                          {suggestion.type === 'product' && (
                            <Badge variant="secondary" className="text-xs">商品</Badge>
                          )}
                          {suggestion.type === 'category' && (
                            <Badge variant="outline" className="text-xs">分类</Badge>
                          )}
                          {suggestion.type === 'brand' && (
                            <Badge variant="default" className="text-xs">品牌</Badge>
                          )}
                        </div>
                        {suggestion.count && (
                          <span className="text-xs text-muted-foreground">
                            {suggestion.count} 个结果
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                ) : query.trim() && (
                  <button
                    className="w-full px-2 py-2 text-left text-sm hover:bg-accent rounded-sm flex items-center space-x-2"
                    onClick={() => handleSearch(query)}
                  >
                    <Search className="h-3 w-3 text-muted-foreground" />
                    <span>搜索 &quot;{query}&quot;</span>
                  </button>
                )}
              </div>
            )}

            {/* 搜索历史 */}
            {searchHistory.length > 0 && !query.trim() && (
              <div className="mb-4">
                <div className="flex items-center justify-between px-2 py-1">
                  <div className="text-xs font-medium text-muted-foreground flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    搜索历史
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                    onClick={clearHistory}
                  >
                    清空
                  </Button>
                </div>
                <div className="space-y-1">
                  {searchHistory.slice(0, 8).map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between group rounded-sm hover:bg-accent"
                    >
                      <button
                        className="flex-1 px-2 py-2 text-left text-sm"
                        onClick={() => handleSearch(item)}
                      >
                        <div className="flex items-center space-x-2">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span>{item}</span>
                        </div>
                      </button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 mr-1"
                        onClick={() => removeHistoryItem(item)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 热门搜索 */}
            {!query.trim() && (
              <div>
                <div className="px-2 py-1 text-xs font-medium text-muted-foreground flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  热门搜索
                </div>
                <div className="flex flex-wrap gap-1 p-2">
                  {POPULAR_SEARCHES.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-accent text-xs"
                      onClick={() => handleSearch(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 