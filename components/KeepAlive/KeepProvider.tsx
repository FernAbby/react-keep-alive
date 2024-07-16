import React, { memo, useMemo, useState, useRef } from 'react'
import type { FC, PropsWithChildren, CSSProperties } from 'react'
import KeepContext from './KeepContext'
import useMemoizedFn from '../hooks/useMemoizedFn'
import Keeper from './Keeper'
import { moveToLast, hasCachedPathname } from './utils'
import { IReactNodeCache, IHtmlElementCache } from './interface'

export interface IKeepProviderProps {
  maxStack?: number
}

const keepContainerStyle = {
  visibility: 'hidden',
} as CSSProperties

const KeepProvider: FC<PropsWithChildren<IKeepProviderProps>> = ({ children, maxStack = 100 }) => {
  // 缓存页面栈 记录入栈顺序，用于超出最大限制，把最先入栈数据删除
  const [pageStack, setPageStack] = useState<string[]>([])
  // 用于存储keepAlive组件的key值及children
  const reactNodesCache = useRef<IReactNodeCache>({})
  // ref只创建一次，用于储存子组件渲染后的实例
  const htmlElementCache = useRef<IHtmlElementCache>({})

  // 添加缓存
  const pushCache = useMemoizedFn(
    (key: string, children: React.ReactNode): Promise<HTMLDivElement | null> => {
      return new Promise((resolve) => {
        // 超过最大缓存数，清除最前面缓存数据
        if (pageStack.length >= maxStack) {
          removeCache(pageStack[0])
        }
        // 完全缓存：当前页面已在已经缓存, 路径 + 参数都一致
        if (hasCached(key)) {
          setPageStack((prevState) => moveToLast(prevState, key))
        } else {
          // 半缓存：只有路径一致，搜索参数不一致，替换原有缓存路径
          const index = hasCachedPathname(pageStack, key)
          if (index > -1) {
            Reflect.deleteProperty(reactNodesCache.current, pageStack[index])
            Reflect.deleteProperty(htmlElementCache.current, pageStack[index])
            setPageStack((prevState) => {
              prevState.splice(index, 1)
              prevState.push(key)
              return prevState.concat([])
            })
            reactNodesCache.current[key] = children
          } else {
            // 完全新增
            setPageStack((prevState) => prevState.concat([key]))
            reactNodesCache.current[key] = children
          }
        }
        setTimeout(() => {
          // 需要等待setState渲染完拿到实例返回给子组件
          const pageContent = htmlElementCache.current[key]?.lastChild || null
          resolve(pageContent as HTMLDivElement | null)
        }, 100)
      })
    }
  )

  // 移除缓存
  const removeCache = useMemoizedFn((key: string) => {
    const index = pageStack.findIndex((item) => item === key)
    if (index > -1) {
      pageStack.splice(index, 1)
      setPageStack(pageStack)
      Reflect.deleteProperty(reactNodesCache.current, key)
      Reflect.deleteProperty(htmlElementCache.current, key)
    }
  })

  // 是否已存在缓存
  const hasCached = useMemoizedFn((key: string) => {
    return Boolean(reactNodesCache.current[key])
  })

  // 获取缓存
  const getCache = useMemoizedFn((key: string) => {
    return htmlElementCache.current[key]
  })

  const providerValue = useMemo(() => {
    return {
      push: pushCache,
      remove: removeCache,
      hasCached,
      getCache,
    }
  }, [])

  // eslint-disable-next-line no-console
  // console.log('pageStack----->', pageStack)
  // console.log('reactNodesCache----> ', Object.keys(reactNodesCache.current))
  // console.log('htmlElementCache----->', JSON.stringify(Object.keys(htmlElementCache.current)))

  return (
    <KeepContext.Provider value={providerValue}>
      <div className="keeper-provider">
        {children}
        <div id="keepers-container" style={keepContainerStyle}>
          {pageStack.map((key) => (
            <Keeper
              key={key}
              cacheKey={key}
              reactNodesCache={reactNodesCache}
              htmlElementCache={htmlElementCache}
            />
          ))}
        </div>
      </div>
    </KeepContext.Provider>
  )
}

export default memo(KeepProvider)
