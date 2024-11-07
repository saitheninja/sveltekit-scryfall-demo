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

  <p>This is a demo project built with SvelteKit (like Next.js for Svelte).</p>

  <p>It has a demo log in that saves data to the browser's local storage.</p>

  <p>
    It uses data from <a href="https://scryfall.com/docs/api">the Scryfall API</a> to generate D3 charts
    and an HTML table.
  </p>

  {#if $jwt !== "loggedin"}
    <p><a href="/log-in">Log in to view the data.</a></p>
  {:else}
    <p class="mb-4">
      You can now access the <a href="/scryfall">Scryfall data page</a>.
    </p>
  {/if}

  <div class="mt-12 space-y-4">
    <h2 class="heading-style-2">Routes</h2>

    <div>
      <h3 class="heading-style-3 font-mono">/</h3>

      <p>Home page.</p>
    </div>

    <div>
      <h3 class="heading-style-3 font-mono">/log-in</h3>

      <p>Has LogInForm component that sends a request to a REST endpoint.</p>
      <p>Displays error message on failure.</p>
      <p>On success, saves log in details to browser's local storage.</p>
    </div>

    <div>
      <h3 class="heading-style-3 font-mono">/scryfall</h3>

      <p>UI to examine data.</p>
      <p>Select range of cards to fetch from endpoint.</p>

      <p>Generate bar chart of CMCs.</p>
      <p>Generate pie chart of color identities.</p>
      <p>Generate table of relevant data.</p>
    </div>

    <div>
      <h3 class="heading-style-3 font-mono">/data</h3>

      <p>
        Data from <a href="https://scryfall.com/docs/api/bulk-data">the Scryfall Bulk Data API</a>,
        hosted locally as a REST endpoint.
      </p>
    </div>
  </div>
</section>
