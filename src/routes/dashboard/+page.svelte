<script lang="ts">
  const rangeMin = 1;
  const rangeMax = 1000;
  const cardEmoji = "🎴";

  let rangeStart = 1;
  let rangeEnd = 1000;

  let cardEmojis: string[] = [];
  let cardsData: Card[] = [];

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

  async function fetchCardRange(start: number, end: number) {
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

    return json;
  }

  async function fetchRandomRange() {
    const randomNo = Math.floor(Math.random() * 1000);
    rangeStart = randomNo;
    rangeEnd = randomNo;

    const response = await fetchCardRange(randomNo, randomNo);
    return response;
  }

  function makeEmojiArray(length: number) {
    let emojis = [];

    for (let step = 0; step < length; step++) {
      emojis.push(cardEmoji);
    }

    return emojis;
  }

  $: range = rangeEnd - rangeStart + 1;
  $: cardEmojis = makeEmojiArray(range);
</script>

<h1>Scryfall Data</h1>

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
  <hgroup
    id="heading-fetch-cards"
    class="mb-2"
  >
    <h2 class="heading-size-2">Fetch Cards</h2>

    <p class="text-minor">
      <span>Choose range from 1 to 1000.</span>
    </p>
  </hgroup>

  <section class="mx-auto w-full">
    <p class="text-minor">
      {rangeEnd - rangeStart + 1} cards selected
    </p>

    <div class="flex h-6 flex-row pr-4">
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
  </section>

  <form
    id="form-fetch-range"
    aria-labelledby="heading-fetch-cards"
    on:submit|preventDefault={() => fetchCardRange(rangeStart, rangeEnd)}
  >
    <div class="flex flex-row justify-between">
      <div class="flex flex-col">
        <label for="range-start">
          <span> Range Start </span>
          <span class="text-red-500"> * </span>
        </label>

        <input
          id="range-start"
          name="range-start"
          type="number"
          min={rangeMin}
          max={rangeEnd}
          step="1"
          bind:value={rangeStart}
          required
          class="w-18 rounded border pl-2"
        />
      </div>

      <div class="flex flex-col">
        <label for="range-end">
          <span> Range End </span>
          <span class="text-red-500"> * </span>
        </label>

        <input
          id="range-end"
          name="range-end"
          type="number"
          min={rangeStart}
          max={rangeMax}
          step="1"
          bind:value={rangeEnd}
          required
          class="w-18 rounded border pl-2"
        />
      </div>
    </div>

    <button class="button-primary mt-2">fetch chosen range</button>
  </form>

  <form
    id="form-fetch-random"
    on:submit|preventDefault={() => fetchRandomRange()}
  >
    <button class="button-secondary mt-2">fetch random range</button>
  </form>
</section>

<section class="section-style mx-auto mt-8 w-full max-w-prose">
  <hgroup class="mb-2">
    <h2 class="heading-size-2">Cards Data</h2>

    <p class="text-minor">
      {#if !cardsData.length}
        Load cards to view data.
      {:else}
        View detailed card data.
      {/if}
    </p>
  </hgroup>

  {#if cardsData.length}
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
  {/if}
</section>
