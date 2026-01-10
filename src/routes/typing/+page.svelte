<script lang="ts">
  import { onMount } from 'svelte'
  import { getRandomTopic, type Topic } from '$lib/utils/topicsManager'
  import { normalizeChar, calculateCorrectLength } from '$lib/utils/textUtils'
  import { triggerBackgroundChange } from '$lib/utils/eventUtils'
  import { TypingStatsManager, type TypingStats } from '$lib/utils/typingStats'
  import { TypeSoundManager } from '$lib/utils/typeSoundManager'

  let currentTopic: Topic | null = null
  let userInput = ''
  let statsManager = new TypingStatsManager()
  let typeSoundManager = new TypeSoundManager()
  let showResults = false
  let finalStats: TypingStats | null = null
  let isComposing = false // IME変換中フラグ

  // お題を選出
  onMount(() => currentTopic = getRandomTopic())

  // 一致判定
  $: normalizedInput = currentTopic
      ? normalizeChar(userInput, currentTopic.description)
      : userInput
  $: correctLength = currentTopic
      ? calculateCorrectLength(normalizedInput, currentTopic.description)
      : 0

  // 完全一致判定（IME変換中でない場合のみ）
  $: if (currentTopic && !isComposing && normalizedInput.length > 0
      && correctLength === currentTopic.description.length && !showResults) {
    // タイピング完了
    statsManager.finish()
    finalStats = statsManager.getStats(currentTopic.description.length)
    showResults = true
  }

  // キー操作イベント
  const handleKeyDown = (event: KeyboardEvent) => {
    // Escapeキーの処理
    if (event.key === 'Escape') {
      resetTyping()
      event.preventDefault()
      return
    }

    // タイピング開始（制御キー以外）
    if (!statsManager.started &&
        !['Control', 'Shift', 'Alt', 'Meta', 'Tab', 'CapsLock',
          'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12']
        .includes(event.key)) statsManager.start()

    // キー押下を記録とタイプ音再生
    if (statsManager.started) {
      statsManager.recordKeyPress(event.key)
      
      // 文字入力キーのみタイプ音を再生
      if (!['Control', 'Shift', 'Alt', 'Meta', 'Tab', 'CapsLock', 'Escape',
            'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12',
            'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown']
          .includes(event.key)) {
        typeSoundManager.playRandomSound()
      }
    }
  }

  // 入力イベント
  const handleInput = (e: Event) => {
    const textarea = e.target as HTMLTextAreaElement
    userInput = textarea.value
  }

  // タイピングリセット
  const resetTyping = () => {
    showResults = false
    statsManager.reset()
    currentTopic = getRandomTopic()
    userInput = ''
    finalStats = null
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement
    if (textarea) textarea.value = ''
    triggerBackgroundChange()
  }

  // IME変換開始
  const handleCompositionStart = () => isComposing = true
  // IME変換終了
  const handleCompositionEnd = () => isComposing = false

  // 時間をフォーマット
  function formatTime(ms: number): string {
    const seconds = (ms / 1000).toFixed(3)
    return `${seconds}s`
  }
</script>

<div class="mt-10 text-center bg-black/60 w-128 p-1 rounded-sm">
  <div class="text-sm text-gray-500">
    ESCキーを押すと新しいお題に変更されます。
  </div>
  <div class="mt-5">
    {#if currentTopic}
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-300 mb-4">{currentTopic.title}</h2>
        <div class="text-lg text-gray-400 text-left leading-relaxed px-3">
          {#each Array.from(currentTopic.description) as char, index}
            <span class:bg-green-800={index < correctLength}>
              {char}
            </span>
          {/each}
        </div>
      </div>
    {:else}
      <div class="text-gray-400">読み込み中...</div>
    {/if}
  </div>

  {#if showResults && finalStats}
    <!-- 結果表示 -->
    <div class="bg-gray-800 p-6 rounded-lg mx-auto max-w-md">
      <h3 class="text-2xl font-bold text-green-400 text-center mb-4">結果</h3>

      <div class="space-y-3">
        <!-- KPM -->
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-2">
            <span class="text-gray-300">KPM</span>
            <div class="relative group">
              <span class="border text-xs font-medium px-[7px] py-0.5 rounded-full">?</span>
              <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                Keys Per Minute: 1分間あたりにキーを押した数
              </div>
            </div>
            <span class="text-gray-300">:</span>
          </div>
          <span class="text-xl font-mono text-white">{finalStats.kpm}</span>
        </div>

        <!-- CPM -->
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-2">
            <span class="text-gray-300">CPM</span>
            <div class="relative group">
              <span class="border text-xs font-medium px-[7px] py-0.5 rounded-full">?</span>
              <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                Characters Per Minute: 1分間あたりに入力した変換後の文字数
              </div>
            </div>
            <span class="text-gray-300">:</span>
          </div>
          <span class="text-xl font-mono text-white">{finalStats.cpm}</span>
        </div>

        <!-- TIME -->
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-2">
            <span class="text-gray-300">TIME</span>
            <div class="relative group">
              <span class="border text-xs font-medium px-[7px] py-0.5 rounded-full">?</span>
              <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                最初に文字入力を開始してから入力完了するまでの時間
              </div>
            </div>
            <span class="text-gray-300">:</span>
          </div>
          <span class="text-xl font-mono text-white">{formatTime(finalStats.time)}</span>
        </div>

        <!-- DELETE COUNT -->
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-2">
            <span class="text-gray-300">BS/DEL</span>
            <div class="relative group">
              <span class="border text-xs font-medium px-[7px] py-0.5 rounded-full">?</span>
              <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                BackspaceキーやDeleteキーを押した回数
              </div>
            </div>
            <span class="text-gray-300">:</span>
          </div>
          <span class="text-xl font-mono text-white">{finalStats.deleteCount}回</span>
        </div>
      </div>

      <div class="mt-6 text-sm text-gray-400 text-center">
        ESCキーで次のお題へ
      </div>
    </div>
  {:else}
    <!-- 入力エリア -->
    <div class="mt-12">
      <!-- svelte-ignore a11y-autofocus -->
      <textarea
        class="bg-black text-gray-100 text-lg w-full rounded-sm resize-none overflow-hidden"
        rows="3"
        autofocus
        oninput={handleInput}
        oncompositionstart={handleCompositionStart}
        oncompositionend={handleCompositionEnd}
        inputmode="kana"
        style="ime-mode: active; -webkit-ime-mode: active; -moz-ime-mode: active;"
      ></textarea>
    </div>
  {/if}
</div>

<svelte:window onkeydown={handleKeyDown} />
