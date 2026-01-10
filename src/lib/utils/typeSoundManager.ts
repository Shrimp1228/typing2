import { base } from '$app/paths'

/**
 * タイプ音管理クラス
 */
export class TypeSoundManager {
  private sounds: HTMLAudioElement[] = []
  private volume = 0.6

  constructor() { this.loadSounds() }

  /**
   * タイプ音ファイルを読み込み
   */
  private loadSounds(): void {
    const soundFiles = [
      '/mp3/type/type1.mp3',
      '/mp3/type/type2.mp3',
      '/mp3/type/type3.mp3',
      '/mp3/type/type4.mp3',
      '/mp3/type/type5.mp3',
      '/mp3/type/type6.mp3',
      '/mp3/type/type7.mp3',
      '/mp3/type/type8.mp3',
      '/mp3/type/type9.mp3'
    ]

    this.sounds = soundFiles.map(file => {
      const audio = new Audio(base + file)
      audio.volume = this.volume
      audio.preload = 'auto'
      return audio
    })
  }

  /**
   * ランダムなタイプ音を再生
   */
  playRandomSound(): void {
    if (this.sounds.length === 0) return

    const randomIndex = Math.floor(Math.random() * this.sounds.length)
    const sound = this.sounds[randomIndex]

    // 音声を最初から再生（前回の再生位置をリセット）
    sound.currentTime = 0
    sound.play().catch(error => {
      // ユーザーがまだページと相互作用していない場合は無視
      if (error.name !== 'NotAllowedError') console.warn('タイプ音の再生に失敗:', error)
    })
  }
}
