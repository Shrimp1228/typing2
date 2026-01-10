import { base } from '$app/paths'

// 背景画像のリスト
const backgroundImages = [
  '/jpg/ジャングルの神殿　忘れられた古代文明の探検.jpg',
  '/jpg/ジャングルの秘境と古代文明の扉.jpg',
  '/jpg/崩壊した都市の中の静寂な戦車.jpg',
  '/jpg/時が止まった工場跡地に降り注ぐ雨と秋の情景.jpg',
  '/jpg/時間が刻んだ錆びついた線路と工場の遺構.jpg',
  '/jpg/海底から見上げる海底遺跡.jpg',
  '/jpg/濡れた床にネオンの光が反射する薄暗い廊下.jpg',
  '/jpg/荒野に残された昔日の面影を残す廃屋.jpg',
  '/jpg/雨上がりの静寂に包まれた都会の通路.jpg',
  '/jpg/霧に消えゆく古城の面影.jpg',
  '/jpg/霧の中に浮かび上がる廃墟の階段.jpg'
]

// 背景画像をランダム取得
export function getRandomBackgroundImage(): string {
  const randomIndex = Math.floor(Math.random() * backgroundImages.length)
  return base + backgroundImages[randomIndex]
}
