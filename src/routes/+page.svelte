<script lang="ts">
  import { jwt } from "$lib/local-storage";
</script>

<svelte:head>
  <title>Home</title>
  <meta
    name="description"
    content="Svelte demo app"
  />
</svelte:head>

<h1 class="heading-style-1">Welcome</h1>

<section class="mx-auto max-w-prose">
  <hgroup class="mb-4">
    <h2 class="heading-style-2">About</h2>
    <!-- <p class="text-minor"></p> -->
  </hgroup>

  {#if $jwt !== "loggedin"}
    <p><a href="/log-in">Log in to view the data.</a></p>
  {:else}
    <p class="mb-4">
      You can now access the <a href="/scryfall">Scryfall data page</a>.
    </p>
  {/if}
</section>
