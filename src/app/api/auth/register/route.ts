import { NextRequest, NextResponse } from "next/server"
import { registerUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name } = body

    // 验证输入
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "请填写所有必填字段" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "密码至少需要6个字符" },
        { status: 400 }
      )
    }

    // 创建用户
    const user = await registerUser(email, password, name)

    return NextResponse.json(
      { message: "注册成功", user: { id: user.id, email: user.email, name: user.name } },
      { status: 201 }
    )
  } catch (error) {
    console.error("注册错误:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "注册失败" },
      { status: 500 }
    )
  }
} 