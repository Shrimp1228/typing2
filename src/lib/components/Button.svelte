<script lang="ts">
  import { base } from '$app/paths';
  export let href: string;
</script>

<a
  href={base + href}
  class="group relative inline-flex items-center justify-center
         p-0.5 overflow-hidden w-40 h-16 rounded-md
         bg-gradient-to-br from-green-400 to-blue-600
         hover:text-white focus:ring-4 focus:outline-none"
>
  <span
    class="relative px-4 py-2.5 transition-all duration-75
           bg-white dark:bg-neutral-900 rounded-md
           inline-flex items-center justify-center
           w-[150px] h-[54px] text-[28px]
           group-hover:bg-transparent"
  >
    <slot />
  </span>
</a>
