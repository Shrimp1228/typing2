/**
 * 背景画像更新イベントを発火する
 */
export function triggerBackgroundChange(): void {
  window.dispatchEvent(new Event('backgroundChange'))
}

/**
 * イベントリスナーを一括登録・削除する関数群
 */
export function createEventManager() {
  const listeners: Array<{ element: EventTarget; event: string; handler: EventListener }> = []

  return {
    // イベントリスナーを登録
    addEventListener(element: EventTarget, event: string, handler: EventListener) {
      element.addEventListener(event, handler)
      listeners.push({ element, event, handler })
    },

    // 登録されたすべてのイベントリスナーを削除
    removeAllEventListeners() {
      listeners.forEach(({ element, event, handler }) => element.removeEventListener(event, handler))
      listeners.length = 0
    }
  }
}