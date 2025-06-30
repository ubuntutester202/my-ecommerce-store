"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Search, ShoppingCart, User, Menu, Heart, LogOut, Settings, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { NoSSR } from "@/components/ui/no-ssr"
import { CartSidebar } from "@/components/cart/cart-sidebar"
import { useCartStore } from "@/lib/store"
import { useWishlist } from "@/hooks/use-wishlist"

export function Navbar() {
  const { data: session, status } = useSession()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">E</span>
            </div>
            <span className="hidden font-bold sm:inline-block text-xl">
              EStore
            </span>
          </Link>

          {/* 桌面端导航菜单 */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              首页
            </Link>
            <Link
              href="/products"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              所有商品
            </Link>
            <Link
              href="/categories"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              分类
            </Link>
            <Link
              href="/deals"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              特价
            </Link>
            <Link
              href="/about"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              关于我们
            </Link>
          </nav>

          {/* 搜索框 */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜索商品..."
                className="pl-8"
              />
            </div>
          </div>

          {/* 右侧工具栏 */}
          <div className="flex items-center space-x-2">
            {/* 移动端搜索 */}
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Search className="h-5 w-5" />
              <span className="sr-only">搜索</span>
            </Button>

            {/* 收藏夹 */}
            <WishlistButton />

            {/* 购物车 */}
            <CartButton />

            {/* 用户认证区域 */}
            {status === "loading" ? (
              <div className="w-8 h-8 animate-pulse bg-gray-200 rounded-full" />
            ) : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user.image || ""} alt={session.user.name || "用户"} />
                      <AvatarFallback>
                        {session.user.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{session.user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/auth/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      个人资料
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/auth/profile/orders" className="flex items-center">
                      <Package className="mr-2 h-4 w-4" />
                      我的订单
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/auth/profile/addresses" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      收货地址
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wishlist" className="flex items-center">
                      <Heart className="mr-2 h-4 w-4" />
                      收藏夹
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    退出登录
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth/signin">登录</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/auth/signup">注册</Link>
                </Button>
              </div>
            )}

            {/* 移动端菜单 */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">菜单</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="grid gap-6 py-6">
                  <Link
                    href="/"
                    className="flex items-center space-x-2"
                  >
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                      <span className="text-primary-foreground font-bold text-lg">E</span>
                    </div>
                    <span className="font-bold text-xl">EStore</span>
                  </Link>
                  
                  <div className="grid gap-3">
                    <Link href="/" className="text-lg font-medium">
                      首页
                    </Link>
                    <Link href="/products" className="text-lg font-medium">
                      所有商品
                    </Link>
                    <Link href="/categories" className="text-lg font-medium">
                      分类
                    </Link>
                    <Link href="/deals" className="text-lg font-medium">
                      特价
                    </Link>
                    <Link href="/about" className="text-lg font-medium">
                      关于我们
                    </Link>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="搜索商品..."
                      className="pl-8"
                    />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

// 收藏夹按钮组件
function WishlistButton() {
  const { itemCount } = useWishlist()

  return (
    <Button variant="ghost" size="icon" asChild>
      <Link href="/wishlist">
        <Heart className="h-5 w-5" />
        <NoSSR>
          {itemCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {itemCount}
            </Badge>
          )}
        </NoSSR>
        <span className="sr-only">收藏夹</span>
      </Link>
    </Button>
  )
}

// 购物车按钮组件
function CartButton() {
  const itemCount = useCartStore(state => state.itemCount)

  return (
    <CartSidebar>
      <Button variant="ghost" size="icon" className="relative">
        <ShoppingCart className="h-5 w-5" />
        <NoSSR>
          {itemCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {itemCount}
            </Badge>
          )}
        </NoSSR>
        <span className="sr-only">购物车</span>
      </Button>
    </CartSidebar>
  )
} 