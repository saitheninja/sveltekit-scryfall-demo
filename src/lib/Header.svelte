<script lang="ts">
  import { page } from "$app/stores";
  import { email, jwt, isLoading } from "$lib/local-storage";

</script>

<header class="flex h-16 flex-row justify-between border-b border-b-gray-200 px-2">
  <a
    class="skip-to-main-content"
    href="#main">skip to main content</a
  >

  <a
    class="my-auto text-xl font-extrabold"
    href="/">Scryfall Data Demo</a
  >

  <nav class="my-auto">
    <ul class="flex w-full flex-row items-center">
      <li aria-current={$page.url.pathname === "/" ? "page" : undefined}>
        <a
          class="text-xl font-extrabold"
          href="/">Scryfall Data Demo</a
    {#if $jwt}
      <div
        id="account"
        class="mx-6 flex h-full flex-row items-center gap-6"
      >
        {#if $email}
          <span class="text-minor">Logged in as {$email}</span>
        {/if}

        <form
          id="form-log-out"
          on:submit|preventDefault={() => {
            $isLoading = "true";
            localStorage.clear();

            $isLoading = "";
            location.reload();
          }}
        >
      </li>
          <button
            disabled={$isLoading ? true : false}
            class="button-secondary text-base">Log Out</button
          >
        </form>
      </div>
    {/if}

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

  .skip-to-main-content {
    @apply absolute z-10;
    @apply translate-y-[-200%] focus-visible:translate-y-0;
    /* force duration 0 for no motion sickness, fast navigation */
    @apply duration-0;
  }
</style>
