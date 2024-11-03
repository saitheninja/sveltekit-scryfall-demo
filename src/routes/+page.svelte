<script lang="ts">
  import { email, jwt } from "$lib/local-storage";

  import LogInForm from "$lib/LogInForm.svelte";

  export let form;
</script>

<svelte:head>
  <title>Home</title>
  <meta
    name="description"
    content="Svelte demo app"
  />
</svelte:head>

<h1 class="heading-style-1">Welcome</h1>

<section class="mx-auto my-auto h-full w-full max-w-xs">
  {#if $jwt !== "loggedin"}
    <LogInForm {form} />
  {:else}
    <hgroup class="mb-4 text-center">
      <h2 class="heading-style-2">Logged In</h2>
      <p class="text-minor">as {$email}</p>
    </hgroup>

    <p class="mb-4">
      You can now access the <a href="/scryfall">Scryfall data page</a>.
    </p>
  {/if}
</section>
