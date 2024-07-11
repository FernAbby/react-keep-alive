// 激活事件收集
const activatedEvents: {
  [key: string]: () => void
} = {}

// 失活事件收集
const deactivatedEvents: {
  [key: string]: () => void
} = {}

// 执行激活事件
export function execActivated(cacheKey: string) {
  if (activatedEvents[cacheKey]) {
    activatedEvents[cacheKey]()
  }
}

// 执行激活事件
export function execDeactivated(cacheKey: string) {
  if (deactivatedEvents[cacheKey]) {
    deactivatedEvents[cacheKey]()
  }
}

// 缓存页面激活事件
export const useActivated = (cacheKey: string, callback: () => void) => {
  activatedEvents[cacheKey] = callback
}

// 缓存页面缓存事件
export const useDeactivatedEvents = (cacheKey: string, callback: () => void) => {
  deactivatedEvents[cacheKey] = callback
}
