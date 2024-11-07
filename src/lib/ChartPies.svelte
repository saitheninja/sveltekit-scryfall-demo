<script lang="ts">
  import * as d3 from "d3";

  import ChartPiesSlice from "$lib/ChartPiesSlice.svelte";

  import type { ChartEntry } from "$lib/interfaces";

  export let data: ChartEntry[] = [];

  // chart dimensions
  const width = 450;
  const height = Math.min(width, 450);
  const radius = Math.min(width, height) / 2;
  const innerRadius = radius * 0.5;
  const outerRadius = radius - 1;

  // sampled colours
  const colorGenerator = (name: string) => {
    if (name === "W") return "#FCFAD4"; // white
    if (name === "U") return "#A9DFF9"; // blue
    if (name === "B") return "#CCC3C1"; // black
    if (name === "R") return "#F8AA8F"; // red
    if (name === "G") return "#9CD4AF"; // green
    if (name === "C") return "#D1DEDE"; // colorless
  };

  const pieGenerator = d3
    .pie<ChartEntry>()
    .sort(null)
    .value((d) => d.value)
    .padAngle((1 / radius) * 8);

  $: pieData = pieGenerator(data);
</script>

<svg
  {width}
  {height}
  viewBox="{-width / 2}, {-height / 2}, {width}, {height}"
  style:max-width="100%"
  style:height="auto"
>
  {#each pieData as slice}
    <ChartPiesSlice
      {slice}
      fill={colorGenerator(slice.data.name)}
      {innerRadius}
      {outerRadius}
    />
  {/each}
</svg>
