<script lang="ts">
  import { email, jwt } from "$lib/local-storage";

  import LogInForm from "$lib/LogInForm.svelte";

  export let form;
</script>

<svelte:head>
  <title>Log In</title>
  <meta
    name="description"
    content="Log in to app"
  />
</svelte:head>

<h1 class="heading-style-1">Log In</h1>

<section class="mx-auto my-auto w-full max-w-xs pb-20">
  {#if $jwt !== "loggedin"}
    <LogInForm {form} />
  {:else}
    <hgroup class="mb-4 text-center">
      <h2 class="heading-style-2">Logged In</h2>
      <p class="text-minor">as {$email}</p>
    </hgroup>

    <p class="mb-4 text-center">
      You can now access the <a href="/scryfall">Scryfall data page</a>.
    </p>
  {/if}
</section>
