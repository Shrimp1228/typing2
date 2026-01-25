/**
 * ルビ記法を除去してプレーンテキストに変換する（入力判定用）
 * 例: {漢字|かんじ} → 漢字
 */
export function toPlainText(text: string): string {
  return text.replace(/\{([^|]+)\|([^}]+)\}/g, '$1')
}

/**
 * 表示用セグメント
 */
export interface DisplaySegment {
  text: string       // 表示テキスト（漢字部分）
  ruby?: string      // ルビ（ある場合）
  startIndex: number // プレーンテキスト上の開始位置
  endIndex: number   // プレーンテキスト上の終了位置
}

/**
 * ルビ記法を解析して表示用セグメント配列を生成する
 */
export function parseRubySegments(text: string): DisplaySegment[] {
  const segments: DisplaySegment[] = []
  const regex = /\{([^|]+)\|([^}]+)\}/g
  let lastIndex = 0
  let plainIndex = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    // ルビ記法の前の通常テキスト
    if (match.index > lastIndex) {
      const normalText = text.slice(lastIndex, match.index)
      for (const char of normalText) {
        segments.push({
          text: char,
          startIndex: plainIndex,
          endIndex: plainIndex + 1
        })
        plainIndex++
      }
    }

    // ルビ付きテキスト（まとめて1セグメント）
    const rubyText = match[1]
    const ruby = match[2]
    segments.push({
      text: rubyText,
      ruby: ruby,
      startIndex: plainIndex,
      endIndex: plainIndex + rubyText.length
    })
    plainIndex += rubyText.length
    lastIndex = regex.lastIndex
  }

  // 残りの通常テキスト
  if (lastIndex < text.length) {
    const normalText = text.slice(lastIndex)
    for (const char of normalText) {
      segments.push({
        text: char,
        startIndex: plainIndex,
        endIndex: plainIndex + 1
      })
      plainIndex++
    }
  }

  return segments
}

/**
 * 入力文字をお題に合わせて全角・半角変換する
 * @param input 入力文字列
 * @param target 目標文字列（お題）
 * @returns 正規化された入力文字列
 */
export function normalizeChar(input: string, target: string): string {
  if (!target) return input
  let normalized = input

  // 各文字について、対象文字と比較して正規化
  for (let i = 0; i < Math.min(input.length, target.length); i++) {
    const inputChar = input[i]
    const targetChar = target[i]

    // 全角→半角変換
    const toHankaku = inputChar.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (match) =>
      String.fromCharCode(match.charCodeAt(0) - 0xFEE0)
    )

    // 半角→全角変換
    const toZenkaku = inputChar.replace(/[A-Za-z0-9]/g, (match) =>
      String.fromCharCode(match.charCodeAt(0) + 0xFEE0)
    )

    // 対象文字と一致する方を採用
    if (targetChar === toHankaku) {
      normalized = normalized.substring(0, i) + toHankaku + normalized.substring(i + 1)
    } else if (targetChar === toZenkaku) {
      normalized = normalized.substring(0, i) + toZenkaku + normalized.substring(i + 1)
    }
  }

  return normalized
}

/**
 * 入力文字と目標文字の一致している文字数を計算する
 * @param input 入力文字列
 * @param target 目標文字列
 * @returns 一致している文字数
 */
export function calculateCorrectLength(input: string, target: string): number {
  if (!target) return 0
  let count = 0

  for (let i = 0; i < Math.min(input.length, target.length); i++) {
    if (input[i] !== target[i]) break // 最初の不一致で停止
    count++
  }

  return count
}