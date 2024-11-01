<script lang="ts">
  // import { onMount } from "svelte";
  // import { goto } from "$app/navigation";

  import { fly } from "svelte/transition";

  import { email, jwt } from "$lib/local-storage";

  import ChartBars from "$lib/ChartBars.svelte";
  import ChartPies from "$lib/ChartPies.svelte";
  import LogOutForm from "$lib/LogOutForm.svelte";

  import type { ChartEntry, Card, Colors } from "$lib/interfaces";

  const rangeMin = 1;
  const rangeMax = 1000;
  const cardEmoji = "🎴";

  let rangeStart = 1;
  let rangeEnd = 10;
  let isLoading = false;

  let cardEmojis: string[] = [];
  let cardsData: Card[] = [];

  async function fetchCardRange(start: number, end: number) {
    isLoading = true;

    const response = await fetch(
      "/data?" +
        new URLSearchParams({
          start: start.toString(),
          end: end.toString(),
        }).toString(),
    );
    const json = await response.json();

    isLoading = false;

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${json.message}`);
    }

    cardsData = json;
  }

  async function fetchRandomRange() {
    rangeStart = Math.floor(Math.random() * rangeMax);
    rangeEnd = Math.floor(Math.random() * (rangeMax - rangeStart)) + rangeStart;

    await fetchCardRange(rangeStart, rangeEnd);
  }

  function makeEmojiArray(length: number) {
    let emojis = [];

    for (let step = 0; step < length; step++) {
      emojis.push(cardEmoji);
    }

    return emojis;
  }

  function makeBarChartData(cards: Card[]): ChartEntry[] {
    let cmcsTally: { cmc: number; tally: number }[] = [];
    let barChartData: ChartEntry[] = [];
    if (cards.length === 0) return barChartData;

    cards.forEach((card) => {
      const index = cmcsTally.findIndex(({ cmc }) => cmc === card.cmc);

      if (index === -1) {
        cmcsTally.push({ cmc: card.cmc, tally: 1 });
      } else {
        cmcsTally[index].tally++;
      }
    });

    cmcsTally.sort((a, b) => a.cmc - b.cmc);
    const lastIndexSlice = cmcsTally.slice(-1);
    const maxCmc = lastIndexSlice[0].cmc;

    // add in 0 tally for cmcs in range
    for (let cmc = 0; cmc <= maxCmc; cmc++) {
      const dataIndex = cmcsTally.findIndex((entry) => entry.cmc === cmc);

      if (dataIndex !== -1) {
        barChartData.push({ name: cmc.toString(), value: cmcsTally[dataIndex].tally });
      } else {
        barChartData.push({ name: cmc.toString(), value: 0 });
      }
    }

    barChartData.sort((a, b) => parseInt(a.name) - parseInt(b.name));

    return barChartData;
  }

  function makePieChartData(cards: Card[]): ChartEntry[] {
    let colorTally: { color: Colors; tally: number }[] = [];

    // process raw data
    cards.forEach((card) => {
      card.color_identity.forEach((colorIdentity) => {
        const index = colorTally.findIndex(({ color }) => color === colorIdentity);

        // if index does not exist create it and start tally, else add to existing tally
        if (index === -1) {
          colorTally.push({ color: colorIdentity, tally: 1 });
        } else {
          colorTally[index].tally++;
        }
      });
    });

    // sort colors alphabetically
    colorTally.sort((a, b) => {
      if (a.color < b.color) {
        return -1;
      }

      if (a.color > b.color) {
        return 1;
      }

      return 0;
    });

    // convert to ChartEntry format
    let pieChartData: ChartEntry[] = [];
    colorTally.forEach((entry) => {
      pieChartData.push({ name: entry.color.toString(), value: entry.tally });
    });

    return pieChartData;
  }

  $: range = rangeEnd - rangeStart + 1;
  $: cardEmojis = makeEmojiArray(range);
  $: barChartData = makeBarChartData(cardsData);
  $: pieChartData = makePieChartData(cardsData);

  // onMount(async () => {
  //   if ($jwt !== "loggedin") {
  //     alert("You are not logged in. Redirecting to home page.");
  //     await goto("/");
  //   }
  // });
</script>

<svelte:head>
  <title>Scryfall Data</title>
  <meta
    name="description"
    content="Examine some data from Scryfall"
  />
</svelte:head>

<h1 class="heading-style-1 mb-6">Scryfall Data</h1>

{#if $jwt !== "loggedin"}
  <div class="mx-auto w-full max-w-sm">
    <h2 class="heading-style-2 mb-1">Not Logged In</h2>

    <p>Go to the <a href="/">log in page</a>.</p>
  </div>
{:else}
  <div class="grid grid-cols-1 justify-center gap-6">
    <section
      id="account"
      class="mx-auto w-full max-w-sm"
    >
      <hgroup
        id="heading-fetch-cards"
        class="mb-1"
      >
        <h2 class="heading-style-2">Account</h2>
        <p class="text-minor">You are logged in as {$email}</p>
      </hgroup>

      <div class="mx-auto mb-1 mt-4 max-w-max">
        <LogOutForm disabled={isLoading} />
      </div>
    </section>

    <section
      id="fetch-cards"
      class="mx-auto w-full max-w-prose"
    >
      <hgroup
        id="heading-fetch-cards"
        class="mb-1"
      >
        <h2 class="heading-style-2">Fetch Cards</h2>
        <p class="text-minor">Choose range from {rangeMin} to {rangeMax}</p>
      </hgroup>

      <section class="mx-auto w-full pt-2">
        <div class="w-full rounded border">
          <div class="flex h-6 flex-row justify-between pr-6">
            {#each cardEmojis as emoji, i}
              <span>
                <p
                  id="emoji-{i}"
                  class="absolute"
                  transition:fly={{ x: 20, y: 0 }}
                >
                  {emoji}
                </p>
              </span>
            {/each}
          </div>
        </div>

        <p class="text-minor text-center">
          {range}
          {#if range === 1}
            card selected
          {:else}
            cards selected
          {/if}
        </p>
      </section>

      <form
        id="form-fetch-range"
        aria-labelledby="heading-fetch-cards"
        on:submit|preventDefault={() => fetchCardRange(rangeStart, rangeEnd)}
      >
        <div class="flex flex-row justify-between">
          <div class="flex flex-col">
            <label for="range-start">Start</label>

            <input
              id="range-start"
              name="range-start"
              type="number"
              min={rangeMin}
              max={rangeEnd}
              step="1"
              bind:value={rangeStart}
              required
              class="w-18"
            />
          </div>

          <div class="flex flex-col">
            <label for="range-end">End</label>

            <input
              id="range-end"
              name="range-end"
              type="number"
              min={rangeStart}
              max={rangeMax}
              step="1"
              bind:value={rangeEnd}
              required
              class="w-18"
            />
          </div>
        </div>

        <div class="flex flex-row">
          <button
            disabled={isLoading}
            class="button-primary mx-auto mt-2">fetch chosen range</button
          >
        </div>
      </form>

      <form
        id="form-fetch-random"
        on:submit|preventDefault={() => fetchRandomRange()}
        class="mx-auto mb-2 max-w-max"
      >
        <button
          disabled={isLoading}
          class="button-secondary mt-2">fetch random range</button
        >
      </form>

      {#if isLoading}
        <p class="text-minor text-center">loading...</p>
      {/if}
    </section>

    {#if cardsData.length > 0}
      <section
        id="color-identity-chart"
        class="mx-auto w-full max-w-prose"
      >
        <hgroup class="mb-1">
          <h2 class="heading-style-2">Color Identity Tally</h2>
          <p class="text-minor">One card can have multiple colors</p>
        </hgroup>

        {#if pieChartData.length}
          <div class="mx-auto my-4 w-full max-w-max">
            <ChartPies data={pieChartData} />
          </div>
        {/if}
      </section>

      <section
        id="cmc-chart"
        class="mx-auto w-full max-w-prose"
      >
        <hgroup class="mb-1">
          <h2 class="heading-style-2">Converted Mana Cost Tally</h2>
          <p class="text-minor">One card has one converted mana cost</p>
        </hgroup>

        {#if barChartData.length}
          <ChartBars data={barChartData} />
        {/if}
      </section>

      <section
        id="cards-data"
        class="mx-auto w-full max-w-prose"
      >
        <hgroup class="mb-1">
          <h2 class="heading-style-2">Cards Data</h2>
          <p class="text-minor">View detailed card data</p>
        </hgroup>

        <details>
          <summary class="my-2">
            {cardsData.length}
            {#if cardsData.length === 1}
              card
            {:else}
              cards
            {/if}
          </summary>

          {#each cardsData as card, i}
            {@const hasRemainder = i % 2 ? true : false}

            <details>
              <summary class:bg-gray-100={hasRemainder}>
                {rangeStart + i}
                {card.name}
              </summary>

              <dl class="my-4">
                {#each Object.entries(card) as entry}
                  <dt class="mb-1 mt-4 font-bold">{entry[0]}</dt>
                  <dd><pre>{JSON.stringify(entry[1])}</pre></dd>
                {/each}
              </dl>
            </details>
          {/each}
        </details>
      </section>
    {/if}
  </div>
{/if}
