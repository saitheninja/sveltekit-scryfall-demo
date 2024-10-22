<script lang="ts">
  import { email, jwt } from "$lib/local-storage";

  import LogInForm from "$lib/LogInForm.svelte";
  import LogOutForm from "$lib/LogOutForm.svelte";

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
    <p>You are logged in as {$email}.</p>
    <p class="mb-4">
      You can now access the <a
        class="underline"
        href="/scryfall">Scryfall data page</a
      >.
    </p>

    <LogOutForm />
  {/if}
</section>
