<script lang="ts">
  import { page } from "$app/stores";
</script>

<header class="flex flex-row justify-between border-b border-b-gray-200 py-4">
  <a
    class="skip-link"
    href="#main"
  >
    skip to main content
  </a>

  <nav class="my-auto">
    <ul class="flex w-full flex-row items-center">
      <li aria-current={$page.url.pathname === "/" ? "page" : undefined}>
        <a
          class="text-xl font-extrabold"
          href="/">Scryfall Data Demo</a
        >
      </li>

      <li aria-current={$page.url.pathname.startsWith("/scryfall") ? "page" : undefined}>
        <a href="/scryfall">Scryfall</a>
      </li>
    </ul>
  </nav>
</header>

<style lang="postcss">
  li[aria-current="page"] {
    @apply underline;
    @apply underline-offset-8;
    @apply decoration-double;
    @apply decoration-green-600;
  }

  a {
    @apply rounded-full px-6 py-2;
    @apply no-underline;
  }
  a:focus-visible,
  a:hover {
    @apply text-green-600;
    @apply bg-gray-200;
  }

  .skip-link {
    @apply absolute z-10 translate-x-2;
    @apply translate-y-[-200%] duration-0 focus-visible:translate-y-2;
    @apply rounded-full px-6 py-2;
  }
</style>
