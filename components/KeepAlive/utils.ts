/**
 * @description 移动某一个元素到数组最后
 */
export function moveToLast(arr: string[], key: string) {
  const index = arr.findIndex((item) => item === key)
  if (index !== -1) {
    const newArr = arr.concat([])
    newArr.splice(index, 1)
    newArr.push(key)
    return newArr
  }
  return arr
}

// historyTab设计，同一个路径下面，搜索参数不一致时，只保存最新一个路径
export function hasCachedPathname(pageStack: string[], cacheKey: string): number {
  return pageStack.findIndex((key) => key.split('?')[0] === cacheKey.split('?')[0])
}