<script lang="ts">
  import { fly } from "svelte/transition";
  import { quintIn, quintOut } from "svelte/easing";

  import { goto } from "$app/navigation";
  import { jwt, isLoading } from "$lib/local-storage";

  import ChartBars from "$lib/ChartBars.svelte";
  import ChartPies from "$lib/ChartPies.svelte";

  import { Colors } from "$lib/interfaces";

  import type { ChartEntry, Card, Legalities } from "$lib/interfaces";

  const rangeMin = 1;
  const rangeMax = 1000;
  const cardEmoji = "🎴";

  let rangeStart = 1;
  let rangeEnd = 10;
  let showDetailedData = false;

  let cardEmojis: string[] = [];
  let cardsData: Card[] = [];
  let tableData: {
    name: string;
    cmc: number;
    mana_cost: string;
    color_identity: Colors[];
    power: string;
    toughness: string;
    type_line: string;
    keywords: string[];
    oracle_text: string;
    produced_mana: Colors[];
    legalities: Legalities;
    scryfall_uri: URL;
  }[] = [];

  async function fetchCardRange(start: number, end: number) {
    $isLoading = "true";
    showDetailedData = false;

    const response = await fetch(
      "/data?" +
        new URLSearchParams({
          start: start.toString(),
          end: end.toString(),
        }).toString(),
    );
    const json = await response.json();

    $isLoading = "";

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${json.message}`);
    }

    cardsData = json;

    goto("#graphs"); // scroll to graphs
  }

  async function fetchRandomRange() {
    rangeStart = Math.floor(Math.random() * rangeMax);
    rangeEnd = Math.floor(Math.random() * (rangeMax - rangeStart)) + rangeStart;

    await fetchCardRange(rangeStart, rangeEnd);
  }

  function makeEmojiArray(length: number) {
    let emojis = [];

    // don't show more than rangeMax
    for (let step = 0; step < Math.min(length, rangeMax); step++) {
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
      if (card.color_identity.length === 0) {
        const index = colorTally.findIndex(({ color }) => color === Colors.Colorless);

        // if index does not exist create it and start tally, else add to existing tally
        if (index === -1) {
          colorTally.push({ color: Colors.Colorless, tally: 1 });
        } else {
          colorTally[index].tally++;
        }
      }

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
      pieChartData.push({ name: entry.color, value: entry.tally });
    });

    return pieChartData;
  }

  function makeTableData(cards: Card[]) {
    $isLoading = "true";

    tableData = [];

    cards.forEach(
      ({
        scryfall_uri,
        cmc,
        color_identity,
        keywords = [],
        legalities,
        mana_cost = "-",
        name,
        oracle_text = "-",
        power = "-",
        produced_mana = [],
        toughness = "-",
        type_line = "-",
      }) => {
        tableData.push({
          name,
          cmc,
          mana_cost,
          color_identity,
          power,
          toughness,
          type_line,
          keywords,
          oracle_text,
          produced_mana,
          legalities,
          scryfall_uri,
        });
      },
    );

    $isLoading = "";
  }

  $: range = rangeEnd - rangeStart + 1;
  $: cardEmojis = makeEmojiArray(range);
  $: barChartData = makeBarChartData(cardsData);
  $: pieChartData = makePieChartData(cardsData);
</script>

<svelte:head>
  <title>Scryfall Data</title>
  <meta
    name="description"
    content="Examine some data from Scryfall"
  />
</svelte:head>

<h1 class="heading-style-1">Scryfall Data</h1>

{#if $jwt !== "loggedin"}
  <div class="mx-auto w-full max-w-sm text-center">
    <h2 class="heading-style-2 mb-4">Not Logged In</h2>

    <p>Go to the <a href="/log-in">log in page</a>.</p>
  </div>
{:else}
  <div class="grid grid-cols-1 justify-center gap-12">
    <section
      id="fetch-cards"
      class="mx-auto w-full max-w-md"
    >
      <hgroup
        id="heading-fetch-cards"
        class="mb-4 text-center"
      >
        <h2 class="heading-style-2">Fetch Cards</h2>
        <p class="text-minor">Choose range from {rangeMin} to {rangeMax}</p>
      </hgroup>

      <div class="mx-auto mb-4 w-full">
        <div class="w-full rounded border">
          <div class="flex h-6 flex-row justify-between bg-white pb-8 pr-6">
            {#each cardEmojis as emoji, i}
              <span>
                <p
                  id="emoji-{i}"
                  class="absolute pt-1"
                  in:fly={{ x: 20, y: 0, easing: quintOut }}
                  out:fly={{ x: 0, y: 40, easing: quintIn }}
                >
                  {emoji}
                </p>
              </span>
            {/each}
          </div>
        </div>

        <p class="text-minor mt-1 text-center">
          {range}
          {#if range === 1}
            card selected
          {:else}
            cards selected
          {/if}
        </p>
      </div>

      <div class="mx-auto w-64">
        <form
          id="form-fetch-range"
          aria-labelledby="heading-fetch-cards"
          on:submit|preventDefault={() => fetchCardRange(rangeStart, rangeEnd)}
        >
          <div class="flex flex-row justify-between">
            <div class="flex flex-col">
              <label
                for="range-start"
                class="mx-auto">Start</label
              >

              <input
                id="range-start"
                name="range-start"
                type="number"
                min={rangeMin}
                max={rangeEnd}
                step="1"
                bind:value={rangeStart}
                required
                class="w-20"
              />
            </div>

            <div class="flex flex-col">
              <label
                for="range-end"
                class="mx-auto">End</label
              >

              <input
                id="range-end"
                name="range-end"
                type="number"
                min={rangeStart}
                max={rangeMax}
                step="1"
                bind:value={rangeEnd}
                required
                class="w-20"
              />
            </div>
          </div>

          <button
            disabled={$isLoading ? true : false}
            class="button-primary mt-3 w-full">fetch chosen range</button
          >
        </form>

        <form
          id="form-fetch-random"
          on:submit|preventDefault={() => fetchRandomRange()}
          class="mb-2 mt-3"
        >
          <button
            disabled={$isLoading ? true : false}
            class="button-secondary w-full">fetch random range</button
          >
        </form>
      </div>

      <!-- {#if $isLoading ? true : false} -->
      <!--   <p class="text-minor text-center">loading...</p> -->
      <!-- {/if} -->
    </section>

    {#if cardsData.length > 0}
      <div
        id="graphs"
        class="grid grid-cols-1 justify-center gap-12 md:grid-cols-2"
      >
        <section
          id="color-identity-chart"
          class="mx-auto h-full w-full max-w-prose"
        >
          <hgroup class="mb-4 text-center">
            <h2 class="heading-style-2">Color Identity Tally</h2>
            <p class="text-minor">One card can have multiple colors</p>
          </hgroup>

          <div class="mx-auto max-w-max pt-2 md:pt-4">
            <ChartPies data={pieChartData} />
          </div>
        </section>

        <section
          id="cmc-chart"
          class="mx-auto w-full max-w-prose"
        >
          <hgroup class="mb-4 text-center">
            <h2 class="heading-style-2">Converted Mana Cost Tally</h2>
            <p class="text-minor">One card has one converted mana cost</p>
          </hgroup>

          <div class="mx-auto mt-auto max-w-max">
            <ChartBars data={barChartData} />
          </div>
        </section>
      </div>

      <section
        id="detailed-data"
        class="mb-8"
      >
        <hgroup class="mb-4 text-center">
          <h2 class="heading-style-2">Detailed Card Data</h2>
          <p class="text-minor">
            {cardsData.length}
            {#if cardsData.length === 1}
              card
            {:else}
              cards
            {/if}
            loaded
          </p>
        </hgroup>

        {#if !showDetailedData}
          <form
            on:submit|preventDefault={() => {
              showDetailedData = true;
              makeTableData(cardsData);
              goto("#table-detailed-data");
            }}
            class="mx-auto max-w-max"
          >
            <button
              disabled={$isLoading ? true : false}
              class="button-secondary">Show Details</button
            >
          </form>
        {:else}
          <div class="mx-auto max-w-max overflow-x-auto border border-gray-200">
            <table id="table-detailed-data" class="whitespace-pre">
              <!-- <caption class="text-minor mb-1 text-left">Table 1: Detailed card data.</caption> -->

              <thead>
                <tr
                  id="table-headings-layer-1"
                  class="bg-gray-200 text-left"
                >
                  <th
                    rowspan="2"
                    scope="col"
                    class="px-2">no.</th
                  >

                  {#each Object.entries(tableData[0]) as entry}
                    {@const isObject = typeof entry[1] === "object" ? true : false}
                    {@const isArray = Array.isArray(entry[1])}
                    {@const hasLayer2 = isObject && !isArray ? true : false}
                    {@const entriesLayer2 = Object.entries(entry[1])}

                    <th
                      rowspan={hasLayer2 ? 1 : 2}
                      colspan={hasLayer2 ? entriesLayer2.length : 1}
                      scope={hasLayer2 ? "colgroup" : "col"}
                      class="px-2"
                    >
                      {entry[0]}
                    </th>
                  {/each}
                </tr>

                <tr
                  id="table-headings-layer-2"
                  class="bg-gray-200"
                >
                  {#each Object.entries(tableData[0]) as entry}
                    {@const isObject = typeof entry[1] === "object" ? true : false}
                    {@const isArray = Array.isArray(entry[1])}
                    {@const hasLayer2 = isObject && !isArray ? true : false}
                    {@const entriesLayer2 = Object.entries(entry[1])}

                    {#if hasLayer2}
                      {#each entriesLayer2 as entryLayer2}
                        <th
                          scope="col"
                          class="px-2">{entryLayer2[0]}</th
                        >
                      {/each}
                    {/if}
                  {/each}
                </tr>
              </thead>

              <tbody>
                {#each tableData as card, i}
                  {@const hasRemainder = i % 2 ? true : false}

                  <tr class:bg-gray-200={hasRemainder}>
                    <th
                      scope="row"
                      class="border">{rangeStart + i}</th
                    >

                    {#each Object.entries(tableData[0]) as entry}
                      {@const value = card[entry[0]]}

                      {#if Array.isArray(value)}
                        <td class="border px-2">
                          {#if value.length === 0}
                            {"-"}
                          {:else}
                            {#each value as text, i}
                              {text}{i >= 0 && i < value.length - 1 ? ", " : ""}
                            {/each}
                          {/if}
                        </td>
                      {:else if typeof entry[1] === "object"}
                        {#each Object.keys(entry[1]) as key}
                          <td class="border px-2">
                            {value?.[key] ?? "-"}
                          </td>
                        {/each}
                      {:else}
                        <td class="border px-2">
                          {value}
                        </td>
                      {/if}
                    {/each}
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {/if}
      </section>
    {/if}
  </div>
{/if}
