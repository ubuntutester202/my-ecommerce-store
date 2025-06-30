import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

// 模拟用户数据存储（生产环境中应使用真实数据库）
const users = [
  {
    id: "1",
    email: "admin@example.com",
    name: "管理员",
    password: "$2b$12$1eSkTs1Ni997Cj.981W.4.SQT6X/NX579ISYQyvKFG5GmKUvu7KNu", // "password123"
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    role: "admin"
  },
  {
    id: "2",
    email: "user@example.com",
    name: "普通用户",
    password: "$2b$12$1eSkTs1Ni997Cj.981W.4.SQT6X/NX579ISYQyvKFG5GmKUvu7KNu", // "password123"
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b098?w=400",
    role: "user"
  }
]

export const authOptions: NextAuthOptions = {
  providers: [
    // 邮箱密码登录提供商
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "邮箱", type: "email" },
        password: { label: "密码", type: "password" }
      },
      async authorize(credentials) {
        console.log("🔐 认证开始", { email: credentials?.email })
        
        if (!credentials?.email || !credentials?.password) {
          console.log("❌ 缺少邮箱或密码")
          return null
        }

        // 查找用户
        const user = users.find(u => u.email === credentials.email)
        if (!user) {
          console.log("❌ 用户不存在", credentials.email)
          return null
        }

        console.log("👤 找到用户", { email: user.email, name: user.name })

        // 验证密码
        const isValid = await bcrypt.compare(credentials.password, user.password)
        console.log("🔑 密码验证结果", { isValid, inputPassword: credentials.password, hashedPassword: user.password })
        
        if (!isValid) {
          console.log("❌ 密码不正确")
          return null
        }

        console.log("✅ 认证成功")
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key",
}

// 注册用户函数
export async function registerUser(email: string, password: string, name: string) {
  // 检查用户是否已存在
  const existingUser = users.find(u => u.email === email)
  if (existingUser) {
    throw new Error("用户已存在")
  }

  // 加密密码
  const hashedPassword = await bcrypt.hash(password, 12)

  // 创建新用户
  const newUser = {
    id: (users.length + 1).toString(),
    email,
    name,
    password: hashedPassword,
    image: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0ea5e9&color=fff`,
    role: "user"
  }

  users.push(newUser)
  
  return {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    image: newUser.image,
    role: newUser.role
  }
} 