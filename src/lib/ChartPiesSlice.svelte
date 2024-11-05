<script lang="ts">
  import * as d3 from "d3";

  import { tweened } from "svelte/motion";
  import { quintOut } from "svelte/easing";

  import type { ChartEntry } from "$lib/interfaces";

  export let slice: {
    data: { name: string; value: number };
    endAngle: number;
    index: number;
    padAngle: number;
    startAngle: number;
    value: number;
  };
  export let fill = "";
  export let innerRadius = 0;
  export let outerRadius = 0;

  const arcGenerator = d3
    .arc<d3.PieArcDatum<ChartEntry>>()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

  const tweenArcStart = tweened(slice.startAngle, {
    delay: 200,
    duration: 1000,
    easing: quintOut,
  });
  const tweenArcEnd = tweened(slice.startAngle, {
    delay: 200,
    duration: 1000,
    easing: quintOut,
  });

  const tweenArcCentroidX = tweened(0, {
    delay: 200,
    duration: 1000,
    easing: quintOut,
  });
  const tweenArcCentroidY = tweened(0, {
    delay: 200,
    duration: 1000,
    easing: quintOut,
  });

  $: tweenArcStart.set(slice.startAngle);
  $: tweenArcEnd.set(slice.endAngle);

  $: sliceTweened = {
    data: slice.data,
    endAngle: $tweenArcEnd,
    index: slice.index,
    padAngle: slice.padAngle,
    startAngle: $tweenArcStart,
    value: slice.value,
  };

  $: centroid = arcGenerator.centroid(slice);
  $: tweenArcCentroidX.set(centroid[0]);
  $: tweenArcCentroidY.set(centroid[1]);
</script>

<path
  d={arcGenerator(sliceTweened)}
  {fill}
  stroke-width={1}
  class="stroke-gray-700"
/>

<text
  x={$tweenArcCentroidX}
  y={$tweenArcCentroidY}
  text-anchor="middle"
  class="text-xs font-bold"
>
  {slice.data.name}
</text>

<text
  x={$tweenArcCentroidX}
  y={$tweenArcCentroidY + 16}
  text-anchor="middle"
  class="text-xs"
>
  {slice.data.value.toLocaleString()}
</text>
