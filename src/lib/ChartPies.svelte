<script lang="ts">
  import type { ChartEntry } from "$lib/interfaces";

  import * as d3 from "d3";

  export let data: ChartEntry[];

  // chart dimensions
  const width = 400;
  const height = Math.min(width, 500);
  const radius = Math.min(width, height) / 2;
  const innerRadius = radius * 0.5;
  const outerRadius = radius - 1;
  const labelRadius = (innerRadius + outerRadius) / 2;

  const pieGenerator = d3
    .pie<ChartEntry>()
    .sort(null)
    .value((d) => d.value)
    .padAngle((1 / radius) * 2);

  const arcGenerator = d3
    .arc<d3.PieArcDatum<ChartEntry>>()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

  const arcGeneratorLabels = d3
    .arc<d3.PieArcDatum<ChartEntry>>()
    .innerRadius(labelRadius)
    .outerRadius(labelRadius);

  // const colorGenerator = d3
  //   .scaleOrdinal()
  //   .domain(data.map((d) => d.name))
  //   .range(
  //     d3.quantize((t) => d3.interpolatePlasma(t * 0.5 + 0.1), data.length),
  //   );

  const colorGenerator = (name: string) => {
    if (name === "W") return "#FCFAD4"; // white
    if (name === "U") return "#A9DFF9"; // blue
    if (name === "B") return "#CCC3C1"; // black
    if (name === "R") return "#F8AA8F"; // red
    if (name === "G") return "#9CD4AF"; // green
  }

  let arcs: {
    name: string;
    value: number;
    d: string | null;
    fill: string;
    centroid: [number, number];
  }[];

  $: {
    arcs = pieGenerator(data).map((arc) => {
      return {
        name: arc.data.name,
        value: arc.data.value,
        d: arcGenerator(arc), // svg path
        fill: colorGenerator(arc.data.name) as string,
        centroid: arcGeneratorLabels.centroid(arc),
      };
    });
  }
</script>

<svg
  {width}
  {height}
  viewBox="{-width / 2}, {-height / 2}, {width}, {height}"
  style:max-width="100%"
  style:height="auto"
>
  <g>
    {#each arcs as { d, fill }}
      <path
        {d}
        {fill}
      />
    {/each}
  </g>

  <g>
    <!-- draw labels after, so that they aren't covered up -->
    {#each arcs as { centroid, name, value }}
      <!-- <text -->
      <!--   x={centroid[0]} -->
      <!--   y={centroid[1]} -->
      <!--   text-anchor="middle" -->
      <!--   class="stroke-white stroke-2 font-bold" -->
      <!-- > -->
      <!--   {name} -->
      <!-- </text> -->
      <text
        x={centroid[0]}
        y={centroid[1]}
        text-anchor="middle"
        class="font-bold"
      >
        {name}
      </text>

      <!-- <text -->
      <!--   x={centroid[0]} -->
      <!--   y={centroid[1] + 20} -->
      <!--   text-anchor="middle" -->
      <!--   class="stroke-white stroke-2" -->
      <!-- > -->
      <!--   {value.toLocaleString()} -->
      <!-- </text> -->
      <text
        x={centroid[0]}
        y={centroid[1] + 20}
        text-anchor="middle"
      >
        {value.toLocaleString()}
      </text>
    {/each}
  </g>
</svg>
