# react-keep-alive
基于react18模拟vue的keep-alive组件，实现页面/组件的状态保存

## 安装
```bash
pnpm add @rc-essential/keep-alive
```

## 使用
**引入样式**
next项目在_app.page.tsx文件引入样式
create-react-app创建项目在App.tsx文件引入样式
```typescript
import '@rc-essential/keep-alive/dist/style.css'
```
### 页面缓存
#### 基于react-router-dom路由
```tsx
import { useMemo } from 'react'
import { KeepProvider, KeepAlive } from '@rc-essential/keep-alive'
import { useLocation } from 'react-router-dom'

const routes = [
  {
    path: '/',
    element: <Home />,
    meta: {
      title: '首页',
      is_cache: false,
    },
  },
  {
    path: '/about',
    element: <About />,
    meta: {
      title: '关于',
      is_cache: true,
    },
  },
  {
    path: '/contact',
    element: <Contact />,
    meta: {
      title: '联系我们',
      is_cache: true,
    },
  },
]

const BasicLayout = () => {
  const location = useLocation()
  const children = useRoutes(routes)
  
  /**
   * 用于区分不同页面以进行缓存
   */
  const { cacheKey, isCache } = useMemo(() => {
    return {
      cacheKey: location.pathname + location.search,
      isCache:  children?.props.match.route.meta.is_cache || false,
    }
  }, [location])

  return (
    <div>
      {isCache ? <KeepAlive cacheKey={cacheKey}>{children}</KeepAlive> : children}
    </div>
  )
}
```
#### next 文件系统路由
```tsx
import { useRouter } from 'next/router'
import { KeepProvider, KeepAlive } from '@rc-essential/keep-alive'
import { useMemo } from 'react'

const routes = [
  {
    path: '/',
    meta: {
      title: '首页',
      is_cache: false,
    },
  },
  {
    path: '/about',
    meta: {
      title: '关于',
      is_cache: true,
    },
  },
  {
    path: '/contact',
    meta: {
      title: '联系我们',
      is_cache: true,
    },
  },
]

const BasicLayout = ({ children }) => {
  const router = useRouter()

  const isCache = useMemo(() => {
    () => {
      const route = routes.find((item) => item.path === router.pathname)
      return route?.meta.is_cache || false
    }
  }, [router.pathname])

  return (
    <div>
      {isCache ? <KeepAlive cacheKey={router.asPath}>{children}</KeepAlive> : children}
    </div>
  )
}
```

### useActivated/useDeactivated 钩子
useActivated: 用于监听被KeepAlive包装的组件的激活状态。
useDeactivated: 用于监听被KeepAlive包装的组件的失活状态。

#### create-react-app 项目
```tsx
import { useLocation } from 'react-router-dom'
import { useActivated, useDeActivated } from '@rc-essential/keep-alive'

const ListPage = () => {
  const location = useLocation()
  const cacheKey = useMemo(() => {
    return location.pathname + location.search;
  }, [location])

  // 激活
  useActivated(cacheKey, () => {
    console.log('useActivated=====>', cacheKey);
  })
  
  // 失活
  useDeActivated(cacheKey, () => {
    console.log('useDeActivated=====>', cacheKey);
  })

  return (
    <div>列表页</div>
  )
}
```

#### next 项目
```tsx
import { useRouter } from 'next/router'
import { useActivated, useDeActivated } from '@rc-essential/keep-alive'

const ListPage = () => {
  const router = useRouter()

  // 激活
  useActivated(router.asPath, () => {
    console.log('useActivated=====>', cacheKey);
  })
  
  // 失活
  useDeActivated(router.asPath, () => {
    console.log('useDeActivated=====>', cacheKey);
  })

  return (
    <div>列表页</div>
  )
}
```