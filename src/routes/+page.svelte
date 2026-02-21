<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import { goto } from '$app/navigation';

  // キー操作イベント
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === ' ') {
      // 通常モード開始
      goto('/typing2')
      event.preventDefault()
    } else if (event.key === 'Escape') {
      // 制限時間モード開始
      goto('/typing2?mode=timed')
      event.preventDefault()
    }
  }
</script>

<div class="mt-40 text-center text-gray-300 text-outline-gray">
  Typing Practiceは日本語長文タイピング練習サイトです。<br>
  SPACEキーを押すと開始します。<br>
  ESCキーを押すと制限時間モード（90秒）で開始します。
</div>

<!-- README.mdリンク -->
<div class="fixed bottom-8 left-1/2 transform -translate-x-1/2">
  <a
    href="https://github.com/Shrimp1228/typing2/blob/main/README.md"
    target="_blank"
    rel="noopener noreferrer"
    class="text-gray-400 hover:text-gray-200 transition-colors text-sm underline"
  >
    📖 README
  </a>
</div>

<svelte:window onkeydown={handleKeyDown} />
