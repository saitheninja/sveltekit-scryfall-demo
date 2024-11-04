<script lang="ts">
  import { page } from "$app/stores";
  import { email, jwt, isLoading } from "$lib/local-storage";

  import LogOutForm from "$lib/LogOutForm.svelte";

  let dialog: HTMLDialogElement;
</script>

<header
  class="sticky top-0 z-10 mb-4 flex h-16 w-full flex-row border-b border-b-gray-300 bg-gray-100 px-2"
>
  <a
    class="skip-to-main-content"
    href="#main">skip to main content</a
  >

  <a
    class="my-auto text-xl font-extrabold"
    href="/">Scryfall Data Demo</a
  >

  <nav class="hidden flex-row gap-6 md:flex">
    <ul class="flex h-full flex-row items-center">
      <li aria-current={$page.url.pathname.startsWith("/scryfall") ? "page" : undefined}>
        <a href="/scryfall">Scryfall</a>
      </li>

      {#if !$email || !$jwt}
        <li
          class="ml-auto"
          aria-current={$page.url.pathname.startsWith("/log-in") ? "page" : undefined}
        >
          <a href="/log-in">Log In</a>
        </li>
      {/if}
    </ul>
  </nav>

  {#if $jwt}
    <div
      id="log-out"
      class="ml-auto hidden h-full flex-row items-center gap-6 pr-2 md:flex"
    >
      {#if $email}
        <span class="text-minor">Logged in as {$email}</span>
      {/if}

      <LogOutForm disabled={$isLoading ? true : false} />
    </div>
  {/if}

  <form
    on:submit={() => {
      dialog?.showModal();
    }}
    class="my-auto ml-auto rounded-lg md:hidden"
  >
    <button class="my-auto p-1">
      <svg
        class="h-6 w-6 fill-current"
        viewBox="0 0 24 24"
      >
        {#if !dialog?.open}
          <path
            fill-rule="evenodd"
            stroke-linecap="round"
            d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
          />
        {/if}
      </svg>
    </button>
  </form>
</header>

<dialog
  bind:this={dialog}
  id="mobile-nav-dialog"
  class="min-w-48 rounded-lg border border-gray-400 bg-gray-100 px-2 py-4"
>
  <div class="flex flex-row items-center justify-between">
    <a
      class="mb-2 text-xl font-extrabold"
      href="/">Scryfall Data Demo</a
    >

    <form
      method="dialog"
      class="mr-4 max-h-max max-w-max rounded-lg"
    >
      <!-- svelte-ignore a11y-autofocus -->
      <button autofocus>
        <svg
          class="h-6 w-6 fill-current"
          viewBox="0 0 24 24"
        >
          <path
            fill-rule="evenodd"
            stroke-linecap="round"
            d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
          />
        </svg>
      </button>
    </form>
  </div>

  <hr class="mx-2 mb-4" />

  <nav class="mt-4">
    <ul class="mb-4 flex h-full flex-col gap-4">
      <li aria-current={$page.url.pathname === "/" ? "page" : undefined}>
        <a href="/">Home</a>
      </li>

      <li aria-current={$page.url.pathname.startsWith("/scryfall") ? "page" : undefined}>
        <a href="/scryfall">Scryfall</a>
      </li>

      {#if !$jwt}
        <li aria-current={$page.url.pathname.startsWith("/log-in") ? "page" : undefined}>
          <a href="/log-in">Log In</a>
        </li>
      {/if}
    </ul>
  </nav>

  {#if $jwt}
    <hr class="mx-2 my-4" />

    <div
      id="mobile-log-out"
      class="px-6"
    >
      {#if $email}
        <div class="mb-2 text-center">
          <p class="text-minor">Logged in as</p>
          <p class="text-minor">{$email}</p>
        </div>
      {/if}

      <LogOutForm disabled={$isLoading ? true : false} />
    </div>
  {/if}
</dialog>

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
    @apply translate-y-[-200%] focus-visible:translate-y-2;
    /* force duration 0 for no motion sickness, fast navigation */
    @apply duration-0;
  }

  dialog::backdrop {
    @apply backdrop-blur;
  }
</style>
