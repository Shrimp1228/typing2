import { base } from '$app/paths'

// BGM音声ファイルのリスト
const bgmTracks = [
  '/mp3/bgm/すこしの安息と.mp3',
  '/mp3/bgm/みやびごころ.mp3',
  '/mp3/bgm/ソメイヨシノ.mp3',
  '/mp3/bgm/別れの時.mp3',
  '/mp3/bgm/千年の孤独.mp3',
  '/mp3/bgm/屍を越えて.mp3',
  '/mp3/bgm/憂愁.mp3',
  '/mp3/bgm/日曜のおわりに.mp3',
  '/mp3/bgm/母なる海へ.mp3',
  '/mp3/bgm/淡々と流れていく時間.mp3'
]

let lastPlayedTrack = ''
let currentAudio: HTMLAudioElement | null = null
let currentTrackName = ''

// ファイルパスから曲名を抽出
function extractTrackName(trackPath: string): string {
  const filename = trackPath.split('/').pop() || ''
  return filename.replace('.mp3', '')
}

// 前回と異なるランダムBGMを取得
export function getRandomBGM(): string {
  const availableTracks = bgmTracks.filter(track => track !== lastPlayedTrack)
  const randomIndex = Math.floor(Math.random() * availableTracks.length)
  const selectedTrack = availableTracks[randomIndex]
  lastPlayedTrack = selectedTrack
  currentTrackName = extractTrackName(selectedTrack)
  return base + selectedTrack
}

// 現在の曲名を取得
export function getCurrentTrackName(): string {
  return currentTrackName
}

// BGMを再生
export function playBGM(): void {
  // 既存のオーディオを停止
  if (currentAudio) {
    currentAudio.pause()
    currentAudio.currentTime = 0
  }

  const bgmSrc = getRandomBGM()
  currentAudio = new Audio(bgmSrc)
  currentAudio.loop = false // ループしない
  currentAudio.volume = 0.3 // 音量を30%に設定

  // 曲が終了したら次の曲を再生
  currentAudio.addEventListener('ended', () => {
    playBGM()
    // 曲が変わったことをイベントで通知
    window.dispatchEvent(new CustomEvent('bgmChanged'))
  })

  // 再生開始
  currentAudio.play().catch(error => {
    console.log('BGM自動再生がブロックされました:', error)
  })
}

// BGMを停止
export function stopBGM(): void {
  if (currentAudio) {
    currentAudio.pause()
    currentAudio.currentTime = 0
    currentAudio = null
  }
}

// BGMの音量を変更
export function setBGMVolume(volume: number): void {
  if (currentAudio) currentAudio.volume = Math.max(0, Math.min(1, volume))
}

/**
 * ユーザー操作後にBGMを開始する（自動再生ポリシー対策）
 * @param updateTrackCallback 曲名更新時に呼ばれるコールバック
 * @param showTrackCallback トラック表示状態を更新するコールバック
 * @returns クリーンアップ関数
 */
export function setupAutoStartBGM(
  updateTrackCallback: (trackName: string) => void,
  showTrackCallback: (show: boolean) => void
): () => void {
  const startBGM = () => {
    playBGM()
    updateTrackCallback(getCurrentTrackName())
    showTrackCallback(true)
    document.removeEventListener('click', startBGM)
    document.removeEventListener('keydown', startBGM)
  }

  document.addEventListener('click', startBGM)
  document.addEventListener('keydown', startBGM)

  // クリーンアップ関数を返す
  return () => {
    document.removeEventListener('click', startBGM)
    document.removeEventListener('keydown', startBGM)
  }
}