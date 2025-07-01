import { Metadata } from 'next'
import { Product } from '@/types'

// 网站基础信息
const SITE_CONFIG = {
  name: 'EStore',
  title: 'EStore - 专业的在线购物平台',
  description: 'EStore提供优质的商品和贴心的服务，让您享受愉快的购物体验。覆盖数码、时尚、家居等多个品类，正品保证，快速配送。',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://estore.example.com',
  locale: 'zh_CN',
  type: 'website',
}

// 生成基础metadata
export function generateBaseMetadata(customMeta: Partial<Metadata> = {}): Metadata {
  return {
    title: {
      default: SITE_CONFIG.title,
      template: `%s | ${SITE_CONFIG.name}`
    },
    description: SITE_CONFIG.description,
    keywords: [
      '在线购物', '电商平台', '网上商城', '购物网站',
      '数码产品', '时尚服装', '家居用品', '优质商品',
      '快速配送', '正品保证', '售后服务'
    ],
    authors: [{ name: 'EStore Team' }],
    creator: 'EStore',
    publisher: 'EStore',
    applicationName: SITE_CONFIG.name,
    generator: 'Next.js',
    referrer: 'origin-when-cross-origin',
    metadataBase: new URL(SITE_CONFIG.url),
    
    // Open Graph
    openGraph: {
      type: 'website',
      locale: SITE_CONFIG.locale,
      url: SITE_CONFIG.url,
      siteName: SITE_CONFIG.name,
      title: SITE_CONFIG.title,
      description: SITE_CONFIG.description,
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: SITE_CONFIG.name,
        }
      ],
    },

    // Twitter
    twitter: {
      card: 'summary_large_image',
      title: SITE_CONFIG.title,
      description: SITE_CONFIG.description,
      creator: '@estore',
      images: ['/twitter-image.jpg'],
    },

    // 机器人
    robots: {
      index: true,
      follow: true,
      noarchive: false,
      nosnippet: false,
      noimageindex: false,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // 验证
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      yahoo: process.env.YAHOO_VERIFICATION,
      other: {
        'baidu-site-verification': process.env.BAIDU_SITE_VERIFICATION || '',
      },
    },

    // 图标
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
      other: [
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          url: '/favicon-32x32.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          url: '/favicon-16x16.png',
        },
      ],
    },

    // 清单文件
    manifest: '/site.webmanifest',

    // 其他
    category: '电子商务',
    classification: '购物平台',
    
    ...customMeta,
  }
}

// 生成产品页面metadata
export function generateProductMetadata(product: Product): Metadata {
  const title = `${product.name} - ${SITE_CONFIG.name}`
  const description = `${product.description.slice(0, 150)}... 现价¥${product.price}，原价¥${product.originalPrice}。${product.brand}品牌，${product.category}分类，评分${product.rating}分。`
  
  return generateBaseMetadata({
    title,
    description,
    keywords: [...product.tags, product.brand, product.category, '购买', '价格', '评价'],
    
    openGraph: {
      type: 'website',
      title,
      description,
      images: [
        {
          url: product.images[0],
          width: 800,
          height: 800,
          alt: product.name,
        }
      ],
      locale: SITE_CONFIG.locale,
      siteName: SITE_CONFIG.name,
    },
    
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [product.images[0]],
    },

    other: {
      'product:price:amount': product.price.toString(),
      'product:price:currency': 'CNY',
      'product:availability': product.stock > 0 ? 'in stock' : 'out of stock',
      'product:condition': 'new',
      'product:brand': product.brand,
      'product:category': product.category,
    },
  })
}

// 生成搜索页面metadata
export function generateSearchMetadata(query?: string, totalResults?: number): Metadata {
  const title = query ? `搜索"${query}"的结果` : '商品搜索'
  const description = query 
    ? `在EStore搜索"${query}"，找到${totalResults || 0}个相关商品。优质商品，快速配送，售后保障。`
    : '在EStore搜索您需要的商品，涵盖数码、时尚、家居等多个品类。'

  return generateBaseMetadata({
    title,
    description,
    robots: {
      index: !query || Boolean(totalResults && totalResults > 0),
      follow: true,
    },
  })
}

// 生成分类页面metadata
export function generateCategoryMetadata(category: string, productCount?: number): Metadata {
  const title = `${category}商品`
  const description = `EStore ${category}分类，精选${productCount || '众多'}款优质商品。正品保证，快速配送，贴心服务。`

  return generateBaseMetadata({
    title,
    description,
    keywords: [category, '商品', '购买', '正品', '配送'],
  })
}

// 结构化数据生成器
export const StructuredData = {
  // 网站信息
  website: () => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    inLanguage: 'zh-CN',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_CONFIG.url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }),

  // 组织信息
  organization: () => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/logo.png`,
    description: SITE_CONFIG.description,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+86-400-123-4567',
      contactType: 'customer service',
      availableLanguage: 'Chinese',
    },
    sameAs: [
      'https://weibo.com/estore',
      'https://www.facebook.com/estore',
      'https://twitter.com/estore',
    ],
  }),

  // 产品信息
  product: (product: Product) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    category: product.category,
    sku: product.id.toString(),
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'CNY',
      availability: product.stock > 0 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      condition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: SITE_CONFIG.name,
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviews,
      bestRating: 5,
      worstRating: 1,
    },
  }),

  // 面包屑导航
  breadcrumbList: (items: Array<{ name: string; url: string }>) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_CONFIG.url}${item.url}`,
    })),
  }),
}

// JSON-LD组件
export function JsonLd({ data }: { data: Record<string, any> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
} 