"use client"

import { useState } from 'react'
import { Plus, MapPin, Phone, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Address } from '@/types'

interface AddressSelectorProps {
  selectedAddress: Address | null
  onAddressChange: (address: Address | null) => void
}

// 模拟地址数据
const mockAddresses: Address[] = [
  {
    id: '1',
    userId: 'user1',
    name: '张三',
    phone: '13800138000',
    province: '北京市',
    city: '北京市',
    district: '朝阳区',
    street: '建国路88号SOHO现代城A座1001',
    zipCode: '100020',
    isDefault: true
  },
  {
    id: '2',
    userId: 'user1',
    name: '李四',
    phone: '13900139000',
    province: '上海市',
    city: '上海市',
    district: '浦东新区',
    street: '陆家嘴环路1000号恒生银行大厦18楼',
    zipCode: '200120',
    isDefault: false
  }
]

export function AddressSelector({ selectedAddress, onAddressChange }: AddressSelectorProps) {
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    street: '',
    zipCode: ''
  })

  const handleSelectAddress = (address: Address) => {
    onAddressChange(address)
  }

  const handleAddAddress = () => {
    if (!newAddress.name || !newAddress.phone || !newAddress.province || 
        !newAddress.city || !newAddress.district || !newAddress.street) {
      alert('请填写完整的地址信息')
      return
    }

    const address: Address = {
      id: Date.now().toString(),
      userId: 'user1',
      name: newAddress.name!,
      phone: newAddress.phone!,
      province: newAddress.province!,
      city: newAddress.city!,
      district: newAddress.district!,
      street: newAddress.street!,
      zipCode: newAddress.zipCode || '',
      isDefault: addresses.length === 0
    }

    setAddresses([...addresses, address])
    setNewAddress({
      name: '',
      phone: '',
      province: '',
      city: '',
      district: '',
      street: '',
      zipCode: ''
    })
    setShowAddForm(false)
    onAddressChange(address)
  }

  return (
    <div className="space-y-4">
      {/* 现有地址列表 */}
      {addresses.map((address) => (
        <Card 
          key={address.id}
          className={`cursor-pointer transition-all ${
            selectedAddress?.id === address.id 
              ? 'ring-2 ring-blue-500 border-blue-500' 
              : 'hover:border-gray-300'
          }`}
          onClick={() => handleSelectAddress(address)}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{address.name}</span>
                  <Phone className="h-4 w-4 text-gray-500 ml-2" />
                  <span className="text-gray-600">{address.phone}</span>
                  {address.isDefault && (
                    <Badge variant="secondary" className="ml-2">默认</Badge>
                  )}
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <span>
                    {address.province} {address.city} {address.district} {address.street}
                  </span>
                </div>
                {address.zipCode && (
                  <div className="text-sm text-gray-500 ml-6 mt-1">
                    邮编: {address.zipCode}
                  </div>
                )}
              </div>
              {selectedAddress?.id === address.id && (
                <div className="ml-4">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* 添加新地址 */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogTrigger asChild>
          <Card className="cursor-pointer border-dashed border-2 hover:border-gray-400 transition-colors">
            <CardContent className="p-6 flex items-center justify-center">
              <div className="flex items-center gap-2 text-gray-500">
                <Plus className="h-5 w-5" />
                <span>添加新地址</span>
              </div>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>添加收货地址</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">收货人</Label>
                <Input
                  id="name"
                  value={newAddress.name || ''}
                  onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                  placeholder="请输入收货人姓名"
                />
              </div>
              <div>
                <Label htmlFor="phone">手机号码</Label>
                <Input
                  id="phone"
                  value={newAddress.phone || ''}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  placeholder="请输入手机号码"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="province">省份</Label>
                <Select
                  value={newAddress.province || ''}
                  onValueChange={(value) => setNewAddress({ ...newAddress, province: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="省份" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="北京市">北京市</SelectItem>
                    <SelectItem value="上海市">上海市</SelectItem>
                    <SelectItem value="广东省">广东省</SelectItem>
                    <SelectItem value="浙江省">浙江省</SelectItem>
                    <SelectItem value="江苏省">江苏省</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="city">城市</Label>
                <Select
                  value={newAddress.city || ''}
                  onValueChange={(value) => setNewAddress({ ...newAddress, city: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="城市" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="北京市">北京市</SelectItem>
                    <SelectItem value="上海市">上海市</SelectItem>
                    <SelectItem value="深圳市">深圳市</SelectItem>
                    <SelectItem value="杭州市">杭州市</SelectItem>
                    <SelectItem value="南京市">南京市</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="district">区县</Label>
                <Select
                  value={newAddress.district || ''}
                  onValueChange={(value) => setNewAddress({ ...newAddress, district: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="区县" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="朝阳区">朝阳区</SelectItem>
                    <SelectItem value="海淀区">海淀区</SelectItem>
                    <SelectItem value="浦东新区">浦东新区</SelectItem>
                    <SelectItem value="西湖区">西湖区</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="street">详细地址</Label>
              <Input
                id="street"
                value={newAddress.street || ''}
                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                placeholder="请输入详细地址"
              />
            </div>

            <div>
              <Label htmlFor="zipCode">邮政编码</Label>
              <Input
                id="zipCode"
                value={newAddress.zipCode || ''}
                onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                placeholder="请输入邮政编码（可选）"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleAddAddress} className="flex-1">
                保存地址
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)} className="flex-1">
                取消
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 