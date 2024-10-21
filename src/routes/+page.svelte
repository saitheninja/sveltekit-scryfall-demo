<script lang="ts">
  import { email, jwt } from "$lib/local-storage";

  import LogInForm from "$lib/LogInForm.svelte";

  export let form;

  const checkJwtValid = (jwt: string) => {
    if (!jwt) return false;
    if (jwt.length === 0) return false;
    if (jwt !== "loggedin") return false;

    return true;
  };
</script>

<svelte:head>
  <title>Home</title>
  <meta
    name="description"
    content="Svelte demo app"
  />
</svelte:head>

<h1 class="heading-style-1 mb-4 text-center">Welcome!</h1>

<section class="section-style mx-auto max-w-max">
  {#if !checkJwtValid($jwt)}
    <LogInForm {form} />
  {:else}
    <p class="mb-2">You are logged in as {$email}.</p>

    <p class="mb-2">You can now access the <a href="/scryfall">Scryfall data page</a>.</p>

    <form
      id="form-log-out"
      class="mx-auto max-w-max"
      on:submit|preventDefault={() => {
        localStorage.clear();
        location.reload();
      }}
    >
      <button class="button-primary mx-auto max-w-max"> Log Out </button>
    </form>
  {/if}
</section>
