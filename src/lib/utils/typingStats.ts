export interface TypingStats {
  kpm: number // Keys Per Minute
  cpm: number // Characters Per Minute
  time: number // Time in milliseconds
  deleteCount: number // Delete/Backspace count
}

export class TypingStatsManager {
  private startTime: number | null = null
  private endTime: number | null = null
  private keyPressCount = 0
  private deleteCount = 0
  private isStarted = false

  /**
   * タイピング開始
   */
  start(): void {
    // 既に開始済みの場合は何もしない
    if (this.isStarted) return
    this.startTime = Date.now()
    this.isStarted = true
    this.keyPressCount = 0
    this.deleteCount = 0
    this.endTime = null
  }

  /**
   * タイピング終了
   */
  finish(): void {
    // 未開始または既に終了済みの場合は何もしない
    if (!this.isStarted || this.endTime) return
    this.endTime = Date.now()
  }

  /**
   * キー押下を記録
   */
  recordKeyPress(key: string): void {
    if (!this.isStarted) return
    this.keyPressCount++
    // Delete/Backspaceの記録
    if (key === 'Delete' || key === 'Backspace') this.deleteCount++
  }

  /**
   * 結果を計算して取得
   */
  getStats(textLength: number): TypingStats {
    if (!this.startTime || !this.endTime) return { kpm: 0, cpm: 0, time: 0, deleteCount: 0 }
    const timeInMs = this.endTime - this.startTime
    const timeInMinutes = timeInMs / 60000 // ミリ秒を分に変換
    const kpm = timeInMinutes > 0 ? Math.round(this.keyPressCount / timeInMinutes) : 0
    const cpm = timeInMinutes > 0 ? Math.round(textLength / timeInMinutes) : 0
    return {
      kpm,
      cpm,
      time: timeInMs,
      deleteCount: this.deleteCount
    }
  }

  /**
   * リセット
   */
  reset(): void {
    this.startTime = null
    this.endTime = null
    this.keyPressCount = 0
    this.deleteCount = 0
    this.isStarted = false
  }

  /**
   * 開始済みかどうか
   */
  get started(): boolean { return this.isStarted }
}
