import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Clock } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* 公司信息 */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-xl font-bold">EStore</span>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              EStore致力于为用户提供优质的购物体验，我们精选全球好物，提供贴心服务，让购物变得简单快乐。
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-red-400 transition-colors">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* 快速链接 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">快速链接</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  首页
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-300 hover:text-white transition-colors">
                  所有商品
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-300 hover:text-white transition-colors">
                  商品分类
                </Link>
              </li>
              <li>
                <Link href="/deals" className="text-gray-300 hover:text-white transition-colors">
                  特价商品
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  关于我们
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">
                  购物指南
                </Link>
              </li>
            </ul>
          </div>

          {/* 客户服务 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">客户服务</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-gray-300 hover:text-white transition-colors">
                  帮助中心
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-300 hover:text-white transition-colors">
                  配送信息
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-300 hover:text-white transition-colors">
                  退换货政策
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="text-gray-300 hover:text-white transition-colors">
                  尺码指南
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="text-gray-300 hover:text-white transition-colors">
                  订单追踪
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  联系我们
                </Link>
              </li>
            </ul>
          </div>

          {/* 联系方式 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">联系方式</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-300">
                <MapPin className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span className="text-sm">
                  北京市朝阳区科技园区创新大厦A座8楼
                </span>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <Phone className="h-4 w-4 text-green-400 flex-shrink-0" />
                <span className="text-sm">400-888-0001</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <Mail className="h-4 w-4 text-red-400 flex-shrink-0" />
                <span className="text-sm">support@estore.com</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <Clock className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                <span className="text-sm">
                  周一至周五 9:00-18:00
                  <br />
                  周末及节假日 10:00-17:00
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* 分割线 */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400 text-center lg:text-left">
              <p>© 2025 EStore. 保留所有权利。</p>
            </div>
            <div className="flex flex-wrap justify-center lg:justify-end gap-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                隐私政策
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                服务条款
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                Cookie政策
              </Link>
              <Link href="/sitemap" className="text-gray-400 hover:text-white transition-colors">
                网站地图
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 