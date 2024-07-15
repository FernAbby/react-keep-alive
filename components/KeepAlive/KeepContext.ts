import { createContext } from 'react'
import type { ReactNode } from 'react'

export interface IKeepContext {
  push: (key: string, children: ReactNode) => Promise<HTMLDivElement | null>
  remove: (key: string) => void
  hasCached: (key: string) => boolean
  getCache: (key: string) => HTMLDivElement | null
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
  getCache: () => {
    return null
  },
})

export default KeepContext
