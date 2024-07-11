import React, { createContext } from 'react'

export interface IKeepContext {
  push: (key: string, children: React.ReactNode) => Promise<HTMLDivElement | null>
  hasCached: (key: string) => boolean
  getCache: (key: string) => HTMLDivElement | null
  remove: (key: string) => void
}

const KeepContext = createContext<IKeepContext>({
  push() {
    return Promise.resolve(null)
  },
  remove: () => {
    return false
  },
  hasCached() {
    return false
  },
  getCache: (_key) => {
    return null
  },
})

export default KeepContext