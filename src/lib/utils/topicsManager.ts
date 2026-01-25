import topicsData from '$lib/data/data.json';

export interface Topic {
  title: string
  description: string
}

const STORAGE_KEY = 'usedTopicIndices'

export function getTopics(): Topic[] {
  return topicsData as Topic[]
}

// 出題済みインデックスを取得
function getUsedIndices(): number[] {
  if (typeof window === 'undefined') return []
  const stored = sessionStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

// 出題済みインデックスを保存
function saveUsedIndices(indices: number[]): void {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(indices))
}

// 出題履歴をリセット
function resetUsedIndices(): void {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(STORAGE_KEY)
}

export function getRandomTopic(): Topic {
  const topics = getTopics()
  let usedIndices = getUsedIndices()

  // 全件出題済みの場合はリセット
  if (usedIndices.length >= topics.length) {
    resetUsedIndices()
    usedIndices = []
  }

  // 未出題のインデックスを取得
  const availableIndices = topics
    .map((_, index) => index)
    .filter(index => !usedIndices.includes(index))

  // 未出題からランダムに選択
  const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)]

  // 出題済みに追加
  usedIndices.push(randomIndex)
  saveUsedIndices(usedIndices)

  return topics[randomIndex]
}

export function getTopicByTitle(title: string): Topic | undefined {
  return getTopics().find(topic => topic.title === title)
}
