# react-keep-alive
基于react18模拟vue的keep-alive组件，实现页面/组件的状态保存

## 安装
```bash
pnpm add @rc-essential/keep-alive
```

## 使用
### 基于react-router-dom路由页面缓存
```tsx
import '@rc-essential/keep-alive/dist/style.css'
import { KeepProvider, KeepAlive } from '@rc-essential/keep-alive'
import { useLocation, useOutlet } from 'react-router-dom'

const BasicLayoutWidthCache = () => {
  const outlet = useOutlet()
  const location = useLocation()
  
  /**
   * 用于区分不同页面以进行缓存
   */
  const cacheKey = useMemo(() => {
    return location.pathname + location.search
  }, [location])

  return (
    <div>
      <KeepAlive activeName={cacheKey}>{outlet}</KeepAlive>
    </div>
  )
}
```
### useActivated/useDeactivated
useActivated: 用于监听被KeepAlive包装的组件的激活状态。
useDeactivated: 用于监听被KeepAlive包装的组件的失活状态。

```tsx
  import { useActivated } from '@rc-essential/keep-alive'

  const ListPage = () => {
    /**
     * 用于区分不同页面以进行缓存
     */
    const cacheKey = useMemo(() => {
      return location.pathname + location.search;
    }, [location])

    useActivated(cacheKey, () => {
      console.log('useActivated', cacheKey);
    })
    
    return (
      <div>列表页</div>
    )
  }
```