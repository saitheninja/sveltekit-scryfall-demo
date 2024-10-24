<script lang="ts">
  import { onMount } from "svelte";

  import { goto } from "$app/navigation";

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

    // console.log(response);
    // console.log(json);

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${json.message}`);
    }

    cardsData = json;
    isLoading = false;
  }

  async function fetchRandomRange() {
    isLoading = true;

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

  function makeBarChartData(cards: Card[]) {
    let cmcsTally: { cmc: number; tally: number }[] = [];

    cards.forEach((card) => {
      const index = cmcsTally.findIndex(({ cmc }) => cmc === card.cmc);

      if (index === -1) {
        cmcsTally.push({ cmc: card.cmc, tally: 1 });
      } else {
        cmcsTally[index].tally++;
      }
    });

    cmcsTally.sort((a, b) => a.cmc - b.cmc);

    let barChartData: ChartEntry[] = [];
    cmcsTally.forEach((entry) => {
      barChartData.push({ name: entry.cmc.toString(), value: entry.tally });
    });

    return barChartData;
  }

  function makePieChartData(cards: Card[]) {
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

  onMount(async () => {
    if ($jwt !== "loggedin") {
      // alert("You are not logged in. Redirecting to home page.");
      await goto("/");
    }
  });
</script>

<svelte:head>
  <title>Scryfall</title>
  <meta
    name="description"
    content="Examine some data from Scryfall"
  />
</svelte:head>

<h1 class="heading-style-1 mb-4 text-center">Scryfall Data</h1>

{#if $jwt !== "loggedin"}
  <section class="section-style mx-auto max-w-prose text-center">
    <p>You are not logged in!</p>
    <p>Redirecting to home page.</p>
  </section>
{:else}
  <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
    <div class="space-y-4">
      <section
        id="account"
        class="section-style mx-auto w-full max-w-prose"
      >
        <hgroup
          id="heading-fetch-cards"
          class="mb-2"
        >
          <h2 class="heading-style-2">Account</h2>
          <p class="text-minor">You are logged in as {$email}</p>
        </hgroup>

        <div class="mx-auto mt-4 max-w-max">
          <LogOutForm />
        </div>
      </section>

      <section
        id="fetch-cards"
        class="section-style mx-auto w-full max-w-prose"
      >
        <hgroup
          id="heading-fetch-cards"
          class="mb-2"
        >
          <h2 class="heading-style-2">Fetch Cards</h2>
          <p class="text-minor">Choose range from 1 to 1000</p>
        </hgroup>

        <section class="mx-auto w-full">
          <div class="w-full rounded border">
            <div class="flex h-6 flex-row pr-6">
              {#each cardEmojis as emoji, i}
                <span class="w-full">
                  <p
                    id="emoji-{i}"
                    class="absolute"
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
    </div>

    <div class="space-y-4">
      <section
        id="cmc-chart"
        class="section-style mx-auto w-full max-w-prose"
      >
        <hgroup class="mb-1">
          <h2 class="heading-style-2">Converted Mana Cost Tally</h2>
          <p class="text-minor">A card has one converted mana cost</p>
        </hgroup>

        {#if barChartData.length}
          <ChartBars data={barChartData} />
        {/if}
      </section>

      <section
        id="color-identity-chart"
        class="section-style mx-auto w-full max-w-prose"
      >
        <hgroup class="mb-1">
          <h2 class="heading-style-2">Color Identity Tally</h2>
          <p class="text-minor">A card can have more than one color in its color identity</p>
        </hgroup>

        {#if pieChartData.length}
          <div class="mx-auto my-4 max-w-max">
            <ChartPies data={pieChartData} />
          </div>
        {/if}
      </section>

      <section
        id="cards-data"
        class="section-style mx-auto w-full max-w-prose"
      >
        <hgroup class="mb-1">
          <h2 class="heading-style-2">Cards Data</h2>
          <p class="text-minor">View detailed card data</p>
        </hgroup>

        {#if cardsData.length}
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
              <details class="space-y-2">
                <summary>
                  {rangeStart + i}
                  {card.name}
                </summary>

                <dl class="space-y-1">
                  {#each Object.entries(card) as entry}
                    <dt class="font-bold">{entry[0]}</dt>
                    <dd><pre>{JSON.stringify(entry[1])}</pre></dd>
                  {/each}
                </dl>
              </details>
            {/each}
          </details>
        {/if}
      </section>
    </div>
  </div>
{/if}
