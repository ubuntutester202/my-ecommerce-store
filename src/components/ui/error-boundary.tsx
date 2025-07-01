"use client"

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  showErrorDetails?: boolean
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })

    // 调用外部错误处理函数
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // 发送错误报告到监控服务
    this.logErrorToService(error, errorInfo)
  }

  logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // 这里可以集成错误监控服务，如 Sentry
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown'
    }

    // 模拟发送到错误监控服务
    console.log('Error Report:', errorReport)
    
    // 实际项目中可以这样发送：
    // fetch('/api/errors', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(errorReport)
    // }).catch(console.error)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                出错了
              </CardTitle>
              <CardDescription>
                页面遇到了一个错误，我们正在努力修复这个问题。
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {this.props.showErrorDetails && this.state.error && (
                <div className="bg-gray-100 p-3 rounded-lg text-sm">
                  <div className="flex items-center mb-2">
                    <Bug className="w-4 h-4 text-gray-600 mr-2" />
                    <span className="font-medium text-gray-700">错误详情</span>
                  </div>
                  <div className="text-gray-600 font-mono text-xs">
                    {this.state.error.message}
                  </div>
                </div>
              )}
              
              <div className="text-sm text-gray-600">
                <p>您可以尝试以下操作：</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>刷新当前页面</li>
                  <li>返回首页重新开始</li>
                  <li>如果问题持续存在，请联系客服</li>
                </ul>
              </div>
            </CardContent>
            
            <CardFooter className="flex space-x-3">
              <Button 
                onClick={this.handleRetry}
                className="flex-1"
                variant="outline"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                重试
              </Button>
              <Button 
                onClick={this.handleGoHome}
                className="flex-1"
              >
                <Home className="w-4 h-4 mr-2" />
                返回首页
              </Button>
            </CardFooter>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// 简化的错误边界组件
export function SimpleErrorBoundary({ 
  children, 
  fallback 
}: { 
  children: ReactNode
  fallback?: ReactNode 
}) {
  return (
    <ErrorBoundary 
      fallback={fallback || <DefaultErrorFallback />}
      showErrorDetails={process.env.NODE_ENV === 'development'}
    >
      {children}
    </ErrorBoundary>
  )
}

// 默认错误回退组件
export function DefaultErrorFallback() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        出现了一个错误
      </h3>
      <p className="text-gray-600 mb-4">
        抱歉，页面加载时出现了问题
      </p>
      <Button onClick={() => window.location.reload()}>
        <RefreshCw className="w-4 h-4 mr-2" />
        重新加载
      </Button>
    </div>
  )
}

// 特定功能的错误边界
export function ShoppingErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-lg">
          <AlertTriangle className="w-10 h-10 text-orange-500 mb-3" />
          <h4 className="text-base font-medium text-gray-900 mb-2">
            购物功能暂时不可用
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            我们正在修复这个问题，请稍后再试
          </p>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            重新加载
          </Button>
        </div>
      }
      onError={(error, errorInfo) => {
        console.error('Shopping feature error:', error, errorInfo)
      }}
    >
      {children}
    </ErrorBoundary>
  )
}

// 页面级错误边界
export function PageErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      showErrorDetails={process.env.NODE_ENV === 'development'}
      onError={(error, errorInfo) => {
        // 页面级错误的特殊处理
        console.error('Page error:', error, errorInfo)
      }}
    >
      {children}
    </ErrorBoundary>
  )
}

// Hook 形式的错误边界
export function useErrorBoundary() {
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  const resetError = React.useCallback(() => {
    setError(null)
  }, [])

  const captureError = React.useCallback((error: Error) => {
    setError(error)
  }, [])

  return { captureError, resetError }
} 