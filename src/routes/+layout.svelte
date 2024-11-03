<script lang="ts">
  import { onMount } from "svelte";

 import { email, jwt, isLoading } from "$lib/local-storage";

  import Header from "$lib/Header.svelte";

  import "../app.css";

  onMount(() => {
    // init stores
    email.useLocalStorage();
    jwt.useLocalStorage();
    isLoading.useLocalStorage();
  });
</script>

<div class="flex min-h-screen flex-col">
  <Header />

  <main class="flex h-full w-full flex-grow flex-col px-8 py-4">
    <slot />
  </main>

  <footer class="flex flex-col items-center p-2 text-sm italic">
    <p>
      This is a footer. <a
        href="#top"
        class="underline hover:text-gray-100">Go to top ↑</a
      >
    </p>
  </footer>
</div>
