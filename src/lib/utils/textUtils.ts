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