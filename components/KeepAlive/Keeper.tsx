import type { MutableRefObject } from 'react'
import { memo } from 'react'

import type { IReactNodeCache, IHtmlElementCache } from './interface'

interface IKeeperProps {
  cacheKey: string
  htmlElementCache: MutableRefObject<IHtmlElementCache>
  reactNodesCache: MutableRefObject<IReactNodeCache>
}

const Keeper = ({ cacheKey, htmlElementCache, reactNodesCache }: IKeeperProps) => {
  return (
    <div
      className="keeper-wrap"
      data-key={cacheKey}
      ref={(node) => {
        htmlElementCache.current[cacheKey] = node
      }}
    >
      {reactNodesCache.current[cacheKey] || null}
    </div>
  )
}

export default memo(Keeper)
