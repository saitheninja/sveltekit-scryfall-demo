<script lang="ts">
  const cardEmoji = "🎴";
  const noOfCards = 1000;

  let cardIndex = 1;
  let cardData: Card;

  // https://scryfall.com/docs/api/cards
  interface Card {
    // core card fields
    object: "card"; // always "card"
    id: string;
    scryfall_uri: URL;
    uri: URL;
    // gameplay fields
    color_identity: Colors[];
    legalities: "legal" | "not_legal" | "restricted" | "banned";
    name: string;
    type_line: string;
    // print fields
    // card face objects
    // related card objects
  }
  interface Colors {
    color:
      | "W" // white
      | "U" // blue
      | "B" // black
      | "R" // red
      | "G"; // green
  }

  async function fetchCardIndex(index: number) {
    const response = await fetch("/data?number=" + index);
    const json = await response.json();

    console.log(response);
    console.log(json);

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${json.message}`);
    }

    cardData = json;

    return json;
  }

  async function fetchCardRandom() {
    const randomNo = Math.floor(Math.random() * 999) + 1;
    cardIndex = randomNo;

    const response = await fetchCardIndex(randomNo);
    return response;
  }

  $: cardEmojis = cardEmoji.repeat(noOfCards);
</script>

<h1>Scryfall Data</h1>

<section class="mx-auto h-8 w-full">
  <div class="flex flex-row">
    {#each cardEmojis as emoji}
      <span class="w-full">
        <span class="absolute">{emoji}</span>
      </span>
    {/each}
  </div>
</section>

<section class="mx-auto w-full max-w-prose overflow-x-auto">
  <!--   <h3>By Index</h3> -->
  <!---->
  <!--   {#await fetchCardIndex(1)} -->
  <!--     <p>loading...</p> -->
  <!--   {:then card} -->
  <!--     <p>{card}</p> -->
  <!--     <pre>{JSON.stringify(card)}</pre> -->
  <!--   {:catch error} -->
  <!--     <p>error</p> -->
  <!--     <p>{error}</p> -->
  <!--   {/await} -->
</section>

<section class="section-style mx-auto w-full max-w-prose">
  <hgroup class="mb-2">
    <h2
      id="heading-fetch-cards"
      class="heading-size-2"
    >
      Fetch Cards
    </h2>

    <p class="text-minor">
      <span>Choose range from 1 to 1000.</span>
    </p>
  </hgroup>

  <form
    id="fetch-by-index"
    aria-labelledby="fetch-by-index"
    on:submit|preventDefault={() => fetchCardIndex(cardIndex)}
  >
    <div class="flex flex-col">
      <label for="card-index">
        <span> Card Index </span>
        <span class="text-red-500"> * </span>
      </label>

      <input
        id="card-index"
        name="card-index"
        type="number"
        min="1"
        max="1000"
        step="1"
        bind:value={cardIndex}
        required
        class="w-18 rounded border pl-2"
      />
    </div>

    <button class="button-primary mt-2">fetch card</button>
  </form>

  <form
    id="fetch-random"
    on:submit|preventDefault={() => fetchCardRandom()}
  >
    <button class="button-secondary mt-2">random card</button>
  </form>
</section>

<section class="section-style mx-auto mt-8 w-full max-w-prose">
  <hgroup class="mb-2">
    <h2 class="heading-size-2">Card Data</h2>

    <p class="text-minor">
      {#if !cardData}
        Load a card to view it's data.
      {:else}
        View detailed card data.
      {/if}
    </p>
  </hgroup>

  {#if cardData}
    <dl class="space-y-1">
      {#each Object.entries(cardData) as entry}
        <dt class="font-bold">{entry[0]}</dt>
        <dd><pre>{JSON.stringify(entry[1])}</pre></dd>
      {/each}
    </dl>
  {/if}
</section>

<style lang="postcss">
  .button-primary {
    @apply bg-blue-900 hover:bg-blue-700 focus:bg-blue-700;
    @apply text-white;
    @apply max-w-max rounded px-2 py-1;
  }

  .button-secondary {
    @apply bg-blue-100 hover:bg-blue-200 focus:bg-blue-200;
    @apply max-w-max rounded px-2 py-1;
  }

  .section-style {
    @apply rounded border border-black bg-gray-50 px-4 py-2;
  }

  .heading-size-2 {
    @apply text-2xl;
  }

  .text-minor {
    @apply text-sm italic text-gray-800;
  }
</style>
