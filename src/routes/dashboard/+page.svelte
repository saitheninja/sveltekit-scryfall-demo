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

    // try {
    //   const response = await fetch(url);
    //   if (!response.ok) {
    //     throw new Error(`Response status: ${response.status}`);
    //   }
    //
    //   const json = await response.json();
    //   console.log(json);
    //   return json;
    // } catch (error) {
    //   console.error(error);
    // }
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

<section class="mx-auto w-full">
  <div class="flex flex-row">
    {#each cardEmojis as emoji}
      <span class="w-full">
        <span class="absolute">{emoji}</span>
      </span>
    {/each}
  </div>
</section>

<section class="mx-auto w-full max-w-prose overflow-x-auto">
  <!-- <section> -->
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
  <!-- </section> -->

  <section class="mx-auto max-w-max rounded border border-black bg-white px-4 py-2">
    <h2
      id="heading-fetch-cards"
      class="mb-2 text-2xl"
    >
      Fetch Cards
    </h2>

    <form
      id="fetch-by-index"
      aria-labelledby="fetch-by-index"
      on:submit={() => fetchCardIndex(cardIndex)}
    >
      <div>
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

      <button class="button">fetch card</button>
    </form>

    <button
      class="button"
      on:click={() => fetchCardRandom()}>random card</button
    >
  </section>

  <section>
    {#if !cardData}
      <p class="text-center text-sm italic">Load a card to view it's data.</p>
    {:else}
      <pre>{JSON.stringify(cardData)}</pre>
      {#each Object.entries(cardData) as entry}
        {entry}
        <pre class="font-bold">{entry[0]}</pre>
        <pre>{JSON.stringify(entry[1])}</pre>
      {/each}
    {/if}
  </section>
</section>

<style lang="postcss">
  .button {
    @apply bg-blue-900 hover:bg-blue-700 focus:bg-blue-700;
    @apply text-white;
    @apply max-w-max rounded px-2 py-1;
  }
</style>
