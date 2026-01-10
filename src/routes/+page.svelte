<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';

  // キー操作イベント
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key !== ' ') return
    // ゲーム開始
    goto(`${base}/typing`)
    event.preventDefault()
  }
</script>

<div class="mt-20 text-center text-gray-300 text-outline-gray">
  Typing Practiceは日本語長文タイピング練習サイトです。<br>
  SPACEキーを押すと開始します。
</div>
<div class="mt-40">
  <Button href="/typing">START</Button>
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
