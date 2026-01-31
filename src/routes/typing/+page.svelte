<script lang="ts">
  import { onMount } from 'svelte'
  import { getRandomTopic, type Topic } from '$lib/utils/topicsManager'
  import { normalizeChar, calculateCorrectLength, toPlainText, parseRubySegments } from '$lib/utils/textUtils'
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

  // プレーンテキスト（入力判定用）と表示用セグメント
  $: plainDescription = currentTopic ? toPlainText(currentTopic.description) : ''
  $: displaySegments = currentTopic ? parseRubySegments(currentTopic.description) : []
  $: displayTitle = currentTopic ? parseRubySegments(currentTopic.title) : []

  // 一致判定
  $: normalizedInput = currentTopic
      ? normalizeChar(userInput, plainDescription)
      : userInput
  $: correctLength = currentTopic
      ? calculateCorrectLength(normalizedInput, plainDescription)
      : 0

  // 完全一致判定（IME変換中でない場合のみ）
  $: if (currentTopic && !isComposing && normalizedInput.length > 0
      && correctLength === plainDescription.length && !showResults) {
    // タイピング完了
    statsManager.finish()
    finalStats = statsManager.getStats(plainDescription.length)
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
      // キー押下回数を記録
      statsManager.recordKeyPress()

      // Delete/Backspace押下回数を記録
      if (event.code === 'Backspace' || event.code === 'Delete') statsManager.recordDelete()

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
    autoScroll()
  }

  // 自動スクロール処理
  const autoScroll = () => {
    // お題と一致した入力文字がない場合はskip
    if (correctLength < 1) return
    // 一致済み文字列を取得
    const correctInput = Array.from(normalizedInput).slice(0, correctLength).join('')
    // 一致済み文字列の「。(読点)」をカウント
    const count = (correctInput.match(/。/g) || []).length;
    // 自動スクロール
    const d = document.querySelector('#description') as HTMLDivElement
    if (count < 2) {
      // 一番上にスクロール
      d.scrollTop = 0
    } else {
      // 入力済みの最後から2番目の「。(読点)」の位置にスクロール
      const li = correctInput.lastIndexOf('。', correctInput.lastIndexOf('。') - 1)
      const c = document.querySelector('#correct-' + li) as HTMLDivElement
      d.scrollTo({
        top: c.offsetTop - d.offsetTop,
        behavior: "smooth"
      })
    }
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
    const d = document.querySelector('#description') as HTMLDivElement
    d.scrollTop = 0
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

<div class="mt-2 text-center bg-black/60 w-128 p-1 rounded-sm">
  <div class="text-sm text-gray-500">
    ESCキーを押すと新しいお題に変更されます。
  </div>
  <div>
    {#if currentTopic}
      <div class="mb-1">
        <h2 class="text-2xl font-bold text-gray-300 mb-1">
          {#each displayTitle as segment}
            {#if segment.ruby}
              <ruby>{segment.text}<rt>{segment.ruby}</rt></ruby>
            {:else}
              <span>{segment.text}</span>
            {/if}
          {/each}
        </h2>
        <div id="description" class="text-lg text-gray-400 text-left leading-relaxed px-3 h-[200px] overflow-y-auto">
          {#each displaySegments as segment}
            {#if segment.ruby}
              <ruby
                id={"correct-" + segment.startIndex}
                class={segment.endIndex <= correctLength ? 'bg-green-800' : segment.startIndex < correctLength ? 'bg-green-800/50' : ''}
              >
                {segment.text}<rt>{segment.ruby}</rt>
              </ruby>
            {:else}
              <span
                id={"correct-" + segment.startIndex}
                class:bg-green-800={segment.endIndex <= correctLength}
              >
                {segment.text}
              </span>
            {/if}
          {/each}
        </div>
      </div>
    {:else}
      <div class="text-gray-400">読み込み中...</div>
    {/if}
  </div>

  {#if showResults && finalStats}
    <!-- 結果表示 -->
    <div class="bg-gray-800 p-6 rounded-lg mx-auto max-w-md mb-2">
      <h3 class="text-2xl font-bold text-green-400 text-center mb-4">結果</h3>

      <div class="space-y-3">
        <!-- CHARS -->
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-2">
            <span class="text-gray-300">CHARS</span>
            <div class="relative group">
              <span class="border text-xs font-medium px-[7px] py-0.5 rounded-full">?</span>
              <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                お題の総文字数
              </div>
            </div>
            <span class="text-gray-300">:</span>
          </div>
          <span class="text-xl font-mono text-white">{plainDescription.length}文字</span>
        </div>
      </div>

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

      <div class="mt-6 text-sm text-gray-400 text-center">
        ESCキーで次のお題へ
      </div>
    </div>
  {:else}
    <!-- 入力エリア -->
    <div class="text-left pl-[3px]">
      <!-- svelte-ignore a11y-autofocus -->
      <textarea
        class="bg-black text-gray-100 text-lg w-full rounded-sm resize-none overflow-hidden pl-[12px] pr-[29px] w-[482px]"
        rows="3"
        autofocus
        oninput={handleInput}
        oncompositionstart={handleCompositionStart}
        oncompositionend={handleCompositionEnd}
      ></textarea>
    </div>

    <!-- プログレスバー -->
    <div class="mt-3 px-1">
      <div class="flex justify-between text-xs text-gray-400 mb-1">
        <span>Progress</span>
        <span>{correctLength} / {plainDescription.length}</span>
      </div>
      <div class="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          class="h-full bg-green-500 transition-all duration-150 ease-out"
          style="width: {plainDescription.length > 0 ? (correctLength / plainDescription.length) * 100 : 0}%"
        ></div>
      </div>
    </div>
  {/if}
</div>

<svelte:window onkeydown={handleKeyDown} />
