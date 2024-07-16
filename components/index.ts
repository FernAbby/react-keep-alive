import KeepAlive from './KeepAlive/KeepAlive'
import type { IKeepAliveProps } from './KeepAlive/KeepAlive'
import KeepProvider from './KeepAlive/KeepProvider'
import type { IKeepProviderProps } from './KeepAlive/KeepProvider'
export * from './KeepAlive/useLifeCycle.ts'
export * from './KeepAlive/interface'
import './KeepAlive/index.scss'

export type { IKeepAliveProps, IKeepProviderProps }

export { KeepProvider, KeepAlive }

export default KeepAlive
