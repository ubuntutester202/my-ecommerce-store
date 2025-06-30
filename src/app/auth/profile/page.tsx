"use client"

import { useState, useRef } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { User, Camera, Mail, Phone, MapPin, Calendar } from "lucide-react"

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
    address: "",
    birthday: ""
  })

  // 如果未登录，重定向到登录页面
  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!session) {
    router.push("/auth/signin")
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件')
      return
    }

    // 验证文件大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('图片大小不能超过5MB')
      return
    }

    // 这里可以实现真实的图片上传逻辑
    console.log('上传文件:', file)
    alert('头像上传功能暂未实现，请联系管理员')
  }

  const handleSave = async () => {
    setIsLoading(true)
    
    try {
      // 模拟保存操作
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsEditing(false)
      alert('个人信息保存成功！')
    } catch (error) {
      alert('保存失败，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      phone: "",
      address: "",
      birthday: ""
    })
    setIsEditing(false)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* 页面标题 */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">个人资料</h1>
          <p className="text-muted-foreground">
            管理您的个人信息和偏好设置
          </p>
        </div>

        {/* 个人信息卡片 */}
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
            <CardDescription>
              这些信息将用于您的订单和配送服务
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 头像区域 */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={session.user.image || ""} alt={session.user.name || "用户"} />
                  <AvatarFallback className="text-lg">
                    {session.user.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                  onClick={handleAvatarClick}
                >
                  <Camera className="h-4 w-4" />
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              <div className="space-y-1">
                <h3 className="font-medium">{session.user.name}</h3>
                <p className="text-sm text-muted-foreground">
                  点击相机图标更换头像
                </p>
              </div>
            </div>

            <Separator />

            {/* 表单区域 */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">姓名</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="pl-10"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">邮箱地址</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10"
                    disabled={true} // 邮箱通常不允许修改
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">手机号码</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="pl-10"
                    placeholder="请输入手机号码"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthday">生日</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="birthday"
                    name="birthday"
                    type="date"
                    value={formData.birthday}
                    onChange={handleInputChange}
                    className="pl-10"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">地址</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="pl-10"
                    placeholder="请输入详细地址"
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <Button 
                    onClick={handleSave}
                    disabled={isLoading}
                  >
                    {isLoading ? "保存中..." : "保存更改"}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleCancel}
                    disabled={isLoading}
                  >
                    取消
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  编辑资料
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 账户信息 */}
        <Card>
          <CardHeader>
            <CardTitle>账户信息</CardTitle>
            <CardDescription>
              您的账户安全和隐私设置
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-sm font-medium">用户ID</Label>
                <p className="text-sm text-muted-foreground">{session.user.id}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">账户类型</Label>
                <p className="text-sm text-muted-foreground">
                  {session.user.role === 'admin' ? '管理员' : '普通用户'}
                </p>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Button variant="outline">修改密码</Button>
              <p className="text-sm text-muted-foreground">
                定期修改密码有助于保护您的账户安全
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 