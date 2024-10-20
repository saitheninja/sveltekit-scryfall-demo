<script lang="ts">
  import { email, jwt } from "$lib/local-storage";

  import Counter from "$lib/Counter.svelte";

  import welcome from "$lib/images/svelte-welcome.webp";
  import welcome_fallback from "$lib/images/svelte-welcome.png";

  const checkJwtValid = (jwt: string) => {
    console.log(jwt);
    console.log("1");

    if (!jwt) return false;
    console.log("2");

    if (jwt.length === 0) return false;
    console.log("3");

    if (jwt !== "loggedin") return false;
    console.log("4");

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
  <h1>
    <span class="welcome">
      <picture>
        <source
          srcset={welcome}
          type="image/webp"
        />
        <img
          src={welcome_fallback}
          alt="Welcome"
        />
      </picture>
    </span>

    to your new<br />SvelteKit app
  </h1>

  <h2>
    try editing <strong>src/routes/+page.svelte</strong>
  </h2>

  <Counter />
</section>

<section>
  <p>{"jwt:"}{$jwt}</p>

  {#if !checkJwtValid($jwt)}
    <p>{"not logged in"}</p>
  {:else}
    <p>{"logged in"}</p>

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

<style>
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 0.6;
  }

  h1 {
    width: 100%;
  }

  .welcome {
    display: block;
    position: relative;
    width: 100%;
    height: 0;
    padding: 0 0 calc(100% * 495 / 2048) 0;
  }

  .welcome img {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    display: block;
  }
</style>
