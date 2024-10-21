<script lang="ts">
  // https://svelte.dev/repl/8eea62cd40ae4c7380196601b9f54990?version=3.56.0
  import type { ChartEntry } from "$lib/interfaces";

  import * as d3 from "d3";

  export let data: ChartEntry[] = [];

  const margin = {
    top: 10,
    right: 0,
    left: 20,
    bottom: 20,
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
    .scaleOrdinal(d3.quantize((t) => d3.interpolatePlasma(t * 0.5 + 0.1), data.length))
    .domain(data.map((d) => d.name));

  let xAxis: SVGGElement;
  let yAxis: SVGGElement;

  $: {
    d3.select(xAxis).call(d3.axisBottom(xScale));
    d3.select(yAxis).call(
      d3
        .axisLeft(yScale)
        .tickSize(-width)
        .tickSizeOuter(0)
        .tickArguments([yScale.domain()[1]])
        .tickFormat(d3.format(",")), // thousands seperator
    );
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
      bind:this={xAxis}
      transform="translate(0,{height - margin.bottom})"
    />

    <g
      bind:this={yAxis}
      transform="translate({margin.left},0)"
    />

    {#each data as { name, value }}
      <rect
        x={(xScale(name) ?? 0) + xScale.bandwidth() / 8}
        y={yScale(value)}
        width={xScale.bandwidth() - xScale.bandwidth() / 4}
        height={yScale(0) - yScale(value)}
        fill={colorScale(name)}
        class="mx-auto"
      />

      <!-- <text
        text-anchor="start"
        x={xScale(name)}
        dx={4}
        y={yScale(value)}
        dy={20}
      >
        {value}
      </text> -->
    {/each}
  </svg>
</div>
