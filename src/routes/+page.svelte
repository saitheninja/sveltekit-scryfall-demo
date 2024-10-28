<script lang="ts">
  import { email, jwt } from "$lib/local-storage";

  import LogInForm from "$lib/LogInForm.svelte";
  import LogOutForm from "$lib/LogOutForm.svelte";

  export let form;
</script>

<svelte:head>
  <title>Home</title>
  <meta
    name="description"
    content="Svelte demo app"
  />
</svelte:head>

<h1 class="heading-style-1 mb-6 text-center">Welcome!</h1>

<section class="section-style mx-auto w-full max-w-sm">
  {#if $jwt !== "loggedin"}
    <LogInForm {form} />
  {:else}
    <hgroup class="mb-2">
      <h2 class="heading-style-2">Logged In</h2>
      <p class="text-minor">as {$email}</p>
    </hgroup>

    <p class="mb-4">
      You can now access the <a href="/scryfall">Scryfall data page</a
      >.
    </p>

    <div class="pb-2">
      <LogOutForm />
    </div>
  {/if}
</section>
