import React from 'react'

// 缓存页面ReactNode
export interface IReactNodeCache {
  [key: string]: React.ReactNode | null
}

// 缓存页面Dom节点
export interface IHtmlElementCache {
  [key: string]: HTMLDivElement | null
}
