<script lang="ts">
  import './layout.css'
  import { getRandomBackgroundImage } from '$lib/utils/backgroundImages'
  import { setupAutoStartBGM, stopBGM, getCurrentTrackName } from '$lib/utils/bgmManager'
  import { createEventManager } from '$lib/utils/eventUtils'
  import { onMount, onDestroy } from 'svelte'
  import { page } from '$app/stores'

  let { children } = $props()
  let backgroundImage = $state('')
  let currentTrack = $state('')
  let showTrackName = $state(false)

  // ページが変わるたびに背景画像を更新
  $effect(() => { if ($page.route.id === '/') backgroundImage = getRandomBackgroundImage() })

  onMount(() => {
    // 初回背景画像取得
    backgroundImage = getRandomBackgroundImage()

    // イベント管理
    const eventManager = createEventManager()

    // ユーザー操作後にBGM開始
    const cleanupBGM = setupAutoStartBGM(
      (trackName) => { currentTrack = trackName },
      (show) => { showTrackName = show }
    )

    // 曲が変わったときの曲名更新
    const updateTrackName = () => currentTrack = getCurrentTrackName()

    // 背景画像更新イベントを監視
    const updateBackgroundImage = () => {
      backgroundImage = getRandomBackgroundImage()
    }

    // グローバルイベントで曲の変更を監視
    eventManager.addEventListener(window, 'bgmChanged', updateTrackName)
    eventManager.addEventListener(window, 'backgroundChange', updateBackgroundImage)

    return () => {
      cleanupBGM()
      eventManager.removeAllEventListeners()
    }
  })

  onDestroy(() => stopBGM())
</script>

<!-- 背景画像 -->
<div
  class="min-h-screen text-white relative overflow-hidden"
  style="background-color: #1a1a1a; background-image: url('{backgroundImage}'); background-size: cover; background-position: center; background-attachment: fixed;"
>

  <!-- コンテンツ -->
  <div class="relative z-10 grid place-items-center m-6">
    <div class="text-4xl text-gray-300 text-outline-gray">Typing Practice</div>
    {@render children()}
  </div>

  <!-- 曲名表示 -->
  {#if currentTrack}
    <div class="fixed bottom-4 right-4 z-50 bg-black bg-opacity-70 px-4 py-2 rounded-lg backdrop-blur-sm">
      <div class="text-xs text-gray-300 text-center">Now Playing BGM</div>
      <div class="text-sm font-medium text-center">～ {currentTrack} ～</div>
    </div>
  {/if}
</div>
