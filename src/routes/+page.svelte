<script lang="ts">
  import { jwt } from "$lib/local-storage";

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

<section>
  <h1 class="heading-size-1">Log In</h1>

  {#if !checkJwtValid($jwt)}
    <LogInForm {form} />
  {:else}
    <form
      id="form-log-out"
      on:submit|preventDefault={() => {
        localStorage.clear();
        location.reload();
      }}
    >
      <button class="button-primary mx-auto max-w-max"> Log Out </button>
    </form>

    <slot />
  {/if}
</section>
