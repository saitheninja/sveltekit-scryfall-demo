<script lang="ts">
  import * as d3 from "d3";

  import ChartBarsRect from "$lib/ChartBarsRect.svelte";

  import type { ChartEntry } from "$lib/interfaces";

  export let data: ChartEntry[] = [];
  export let xAxisLabel = "Total Converted Mana Cost (mana) →";
  export let yAxisLabel = "↑ Total (cards)";

  let tickSize = 6;

  const margin = {
    top: 40,
    right: 0,
    left: 30,
    bottom: 50,
  };

  const height = 500;
  let width = 500;

  $: xScaleDomain = data.map((d) => d.name);
  $: xScale = d3
    .scaleBand()
    .domain(xScaleDomain)
    .range([margin.left, width - margin.right])
    .paddingInner(0.1) // bar <-> bar
    .paddingOuter(0.1); // y-axis <-> bars <-> end
  $: xBandwidth = xScale.bandwidth();

  $: yScaleDomainMax = Math.max(...data.map((d) => d.value));
  $: yScale = d3
    .scaleLinear()
    .domain([0, yScaleDomainMax])
    .range([height - margin.bottom, margin.top])
    .nice(); // round to nice values
  $: yScaleTicks = yScale.ticks(Math.min(10, yScaleDomainMax)); // show less ticks if max value < 10
  $: yBaseline = yScale(0);

  $: colorScale = d3
    .scaleOrdinal(d3.quantize((t) => d3.interpolateBuGn(t * 0.4 + 0.3), data.length))
    .domain(data.map((d) => d.name));
</script>

<div bind:clientWidth={width}>
  <svg
    {width}
    {height}
  >
    <g id="grid-y">
      {#each yScaleTicks as value, i}
        {@const yOffset = yScale(value)}

        <line
          id="grid-y-line-{i}-{value}"
          x1={margin.left}
          y1={yOffset}
          x2={width - margin.right}
          y2={yOffset}
          stroke-dasharray="5,5"
          class="stroke-gray-200"
        ></line>

        <line
          id="grid-y-tick-{i}-{value}"
          x1={margin.left - tickSize}
          y1={yOffset}
          x2={margin.left}
          y2={yOffset}
          class="stroke-gray-700"
        ></line>

        <text
          id="grid-y-label-{i}-{value}"
          x={margin.left - tickSize * 1.5}
          y={yOffset + 4}
          text-anchor="end"
          class="fill-gray-700 text-xs"
        >
          {value}
        </text>
      {/each}

      <line
        id="grid-y-axis"
        x1={margin.left}
        y1={margin.top}
        x2={margin.left}
        y2={height - margin.bottom}
        stroke-linecap="square"
        class="stroke-gray-700"
      ></line>

      <text
        id="grid-y-axis-label"
        x={0}
        y={margin.top / 2}
        text-anchor="start"
        class="fill-gray-700 text-xs">{yAxisLabel}</text
      >
    </g>

    <g id="grid-x">
      {#each xScaleDomain as name, i}
        {@const xOffset = (xScale(name) ?? 0) + xScale.bandwidth() / 2}

        <!-- <line
          id="grid-x-line-{i}-{name}"
          x1={xOffset}
          y1={margin.top}
          x2={xOffset}
          y2={height - margin.top}
          class="stroke-gray-200"
        ></line> -->

        <line
          id="grid-x-tick-{i}-{name}"
          x1={xOffset}
          y1={height - margin.bottom}
          x2={xOffset}
          y2={height - margin.bottom + tickSize}
          class="stroke-gray-700"
        ></line>

        <text
          id="grid-x-label-{i}-{name}"
          x={xOffset}
          y={height - margin.bottom + tickSize + 14}
          text-anchor="middle"
          class="fill-gray-700 text-xs"
        >
          {name}
        </text>
      {/each}

      <line
        id="grid-x-axis"
        x1={margin.left}
        y1={height - margin.bottom}
        x2={width - margin.right}
        y2={height - margin.bottom}
        stroke-linecap="square"
        class="stroke-gray-700"
      ></line>

      <text
        id="grid-x-axis-label"
        x={width - margin.right}
        y={height - margin.bottom / 8}
        text-anchor="end"
        class="fill-gray-700 text-xs">{xAxisLabel}</text
      >
    </g>

    {#each data as { name, value }}
      <ChartBarsRect
        name={"total-" + name}
        {value}
        fill={colorScale(name)}
        x={xScale(name)}
        y={yScale(value)}
        baseline={yBaseline}
        width={xBandwidth}
      />
    {/each}
  </svg>
</div>
