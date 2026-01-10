import topicsData from '$lib/data/data.json';

export interface Topic {
  title: string
  description: string
}

export function getTopics(): Topic[] {
  return topicsData as Topic[]
}

export function getRandomTopic(): Topic {
  const topics = getTopics()
  const randomIndex = Math.floor(Math.random() * topics.length)
  return topics[randomIndex]
}

export function getTopicByTitle(title: string): Topic | undefined {
  return getTopics().find(topic => topic.title === title)
}