<script lang="ts">
  // https://svelte.dev/repl/8eea62cd40ae4c7380196601b9f54990?version=3.56.0
  import type { ChartEntry } from "$lib/interfaces";

  import * as d3 from "d3";

  export let data: ChartEntry[] = [];

  const margin = {
    top: 40,
    right: 0,
    left: 40,
    bottom: 40,
  };

  const height = 500;
  let width = 500;

  $: xScale = d3
    .scaleBand()
    .domain(data.map((d) => d.name))
    .range([margin.left, width - margin.right]);

  $: yScale = d3
    .scaleLinear()
    .domain([
      0,
      Math.max.apply(
        null,
        data.map((d) => d.value),
      ),
    ])
    .range([height - margin.bottom, margin.top]);

  $: colorScale = d3
    .scaleOrdinal(d3.quantize((t) => d3.interpolateBlues(t * 0.4 + 0.3), data.length))
    .domain(data.map((d) => d.name));

  let xAxis: SVGGElement;
  let yAxis: SVGGElement;

  $: {
    d3.select(xAxis).call(d3.axisBottom(xScale));
    d3.select(yAxis).call(d3.axisLeft(yScale).tickArguments([10]));
  }
</script>

<div
  class="wrapper"
  bind:clientWidth={width}
>
  <svg
    {width}
    {height}
  >
    <g
      id="grid-lines"
      class="stroke-gray-200"
    >
      {#each yScale.ticks() as tick, i}
        {@const yOffset = yScale(tick)}

        <line
          id="grid-y-tick-{i.toString()}-{tick}"
          x1={margin.left}
          x2={width - margin.right}
          y1={yOffset}
          y2={yOffset}
        ></line>
      {/each}
    </g>

    <g
      id="x-axis"
      bind:this={xAxis}
      transform="translate(0,{height - margin.bottom})"
    />
    <text
      x={width - margin.right}
      y={height - margin.bottom / 8}
      text-anchor="end"
      class="fill-gray-600 text-xs">Converted Mana Cost (number) →</text
    >

    <g
      id="y-axis"
      bind:this={yAxis}
      transform="translate({margin.left},0)"
    />
    <text
      x={0}
      y={margin.top / 2}
      text-anchor="start"
      class="fill-gray-600 text-xs">↑ Total Cards (number)</text
    >

    {#each data as { name, value }}
      <rect
        x={(xScale(name) ?? 0) + xScale.bandwidth() / 8}
        y={yScale(value)}
        width={xScale.bandwidth() - xScale.bandwidth() / 4}
        height={yScale(0) - yScale(value)}
        fill={colorScale(name)}
        stroke="#000"
        stroke-width={1}
        class="mx-auto"
      />

      <text
        text-anchor="start"
        x={xScale(name)}
        dx={10}
        y={yScale(value)}
        dy={-4}
        class="text-xs">{value}</text
      >
    {/each}
  </svg>
</div>
