"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Plus, Edit, Trash2, Phone, User } from "lucide-react"

// 模拟地址数据
const mockAddresses = [
  {
    id: 1,
    name: "张三",
    phone: "13800138000",
    province: "北京市",
    city: "北京市",
    district: "朝阳区",
    detail: "朝阳路100号",
    isDefault: true
  },
  {
    id: 2,
    name: "李四",
    phone: "13900139000",
    province: "上海市", 
    city: "上海市",
    district: "浦东新区",
    detail: "陆家嘴金融中心",
    isDefault: false
  }
]

export default function AddressesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [addresses, setAddresses] = useState(mockAddresses)
  const [isEditing, setIsEditing] = useState(false)
  const [editingAddress, setEditingAddress] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    province: "",
    city: "",
    district: "",
    detail: "",
    isDefault: false
  })

  if (status === "loading") {
    return <div className="container mx-auto px-4 py-8">加载中...</div>
  }

  if (!session) {
    router.push("/auth/signin")
    return null
  }

  const handleAdd = () => {
    setIsEditing(true)
    setEditingAddress(null)
    setFormData({
      name: "",
      phone: "",
      province: "",
      city: "",
      district: "",
      detail: "",
      isDefault: false
    })
  }

  const handleEdit = (address: any) => {
    setIsEditing(true)
    setEditingAddress(address)
    setFormData(address)
  }

  const handleSave = () => {
    if (editingAddress) {
      // 更新地址
      setAddresses(addresses.map(addr => 
        addr.id === editingAddress.id ? { ...formData, id: addr.id } : addr
      ))
    } else {
      // 添加新地址
      const newAddress = {
        ...formData,
        id: Date.now()
      }
      setAddresses([...addresses, newAddress])
    }
    setIsEditing(false)
  }

  const handleDelete = (id: number) => {
    if (confirm('确定要删除这个地址吗？')) {
      setAddresses(addresses.filter(addr => addr.id !== id))
    }
  }

  const handleSetDefault = (id: number) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })))
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">收货地址</h1>
            <p className="text-muted-foreground">管理您的收货地址</p>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            添加地址
          </Button>
        </div>

        {isEditing && (
          <Card>
            <CardHeader>
              <CardTitle>{editingAddress ? "编辑地址" : "添加地址"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="name">姓名</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="请输入收货人姓名"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">手机号</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="请输入手机号"
                  />
                </div>
                <div>
                  <Label htmlFor="province">省份</Label>
                  <Input
                    id="province"
                    value={formData.province}
                    onChange={(e) => setFormData({...formData, province: e.target.value})}
                    placeholder="请输入省份"
                  />
                </div>
                <div>
                  <Label htmlFor="city">城市</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    placeholder="请输入城市"
                  />
                </div>
                <div>
                  <Label htmlFor="district">区县</Label>
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) => setFormData({...formData, district: e.target.value})}
                    placeholder="请输入区县"
                  />
                </div>
                <div>
                  <Label htmlFor="detail">详细地址</Label>
                  <Input
                    id="detail"
                    value={formData.detail}
                    onChange={(e) => setFormData({...formData, detail: e.target.value})}
                    placeholder="请输入详细地址"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleSave}>保存</Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  取消
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {addresses.map((address) => (
            <Card key={address.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="font-medium">{address.name}</span>
                      {address.isDefault && (
                        <Badge variant="default">默认地址</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{address.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {address.province} {address.city} {address.district} {address.detail}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!address.isDefault && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSetDefault(address.id)}
                      >
                        设为默认
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(address)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(address.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
} 