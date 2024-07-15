import type { FC, PropsWithChildren } from 'react'
import { useEffect, useRef, useContext, memo } from 'react'
import KeepContext from './KeepContext'
import useMemoizedFn from '../hooks/useMemoizedFn'
import { execActivated, execDeactivated } from './useLifeCycle'

interface IKeepAliveProps {
  // 缓存键值
  cacheKey: string
}

const prevRefs: {
  [key: string]: HTMLDivElement | null
} = {}

const KeepAlive: FC<PropsWithChildren<IKeepAliveProps>> = (props) => {
  const keepAliveRef = useRef<HTMLDivElement | null>(null)
  const { push, getCache } = useContext(KeepContext)

  // 激活状态: 页面放入keep-alive中展示
  const activated = useMemoizedFn(async () => {
    // 通过push函数将KeepAlive中的信息传递给父组件KeepProvide处理
    // KeepProvider帮助渲染children,并将渲染后的实例dom pageContent返回
    const pageContent = await push(props.cacheKey, props.children)
    // console.log('pageContent=====>', pageContent)
    // 将渲染后的realContent移动到KeepAlive中展示
    if (keepAliveRef.current && pageContent) {
      if (keepAliveRef.current.hasChildNodes()) {
        // console.log('replaceChild=====>')
        keepAliveRef.current.replaceChild(pageContent, keepAliveRef.current?.lastChild as ChildNode)
      } else {
        // console.log('appendChild=====>')
        keepAliveRef.current?.appendChild(pageContent)
      }
      execActivated(props.cacheKey)
      prevRefs[props.cacheKey] = keepAliveRef.current
    }
  })

  // 缓存状态: 页面重新缓存入Keeper内
  const deactivated = useMemoizedFn((_cacheKey: string, keepContainerElement: HTMLDivElement) => {
    // 页面重新缓存入Keeper内
    const keeper = getCache(_cacheKey)
    // console.log('<============================= Start Of ==========================> ')
    // console.log('Enter =====> cacheKey:', props.cacheKey)
    // console.log('Leave =====> cacheKey:', _cacheKey)
    // console.log('ref.current ====>', ref.current)
    // console.log('prevRef ====>', prevRefs[_cacheKey])
    // console.log('Keeper ====>', keeper)
    const keepAliveElement = keepContainerElement || prevRefs[_cacheKey]
    if (keepAliveElement?.lastChild && keeper) {
      execDeactivated(_cacheKey)
      keeper?.appendChild(keepAliveElement.lastChild)
    }
  })

  useEffect(() => {
    activated()
    return () => {
      deactivated(props.cacheKey, keepAliveRef.current)
    }
  }, [props.cacheKey])

  return (
    <div className="keep-alive-container" ref={keepAliveRef} data-key={props.cacheKey}>
      <div className="keeper-wrap">加载中...</div>
    </div>
  )
}

export default memo(KeepAlive)
