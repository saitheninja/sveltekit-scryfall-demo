<script>
<script lang="ts">
  import Header from "$lib/Header.svelte";

  import { email, jwt } from "$lib/local-storage";

  import { onMount } from "svelte";

  import "../app.css";

  onMount(() => {
    // init stores
    email.useLocalStorage();
    jwt.useLocalStorage();
  });
</script>

<div class="flex min-h-screen flex-col">
  <Header />

  <main class="m-auto flex h-full w-full max-w-5xl flex-grow flex-col p-4">
    <slot />
  </main>

  <footer class="flex flex-col items-center justify-center p-2 text-sm italic">
    <p>This is a footer.</p>
  </footer>
</div>
