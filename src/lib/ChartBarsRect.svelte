<script lang="ts">
  import { tweened } from "svelte/motion";
  import { quintOut } from "svelte/easing";

  export let name = "";
  export let value = 0;
  export let x = 0;
  export let y = 0;
  export let width = 0;
  export let baseline = 0;
  export let fill = "";

  const heightTween = tweened(0, { duration: 1000, easing: quintOut });

  $: height = baseline - y;
  $: heightTween.set(height);

  $: yGrow = baseline - $heightTween;
</script>

<rect
  id="rect-{name}"
  {x}
  y={yGrow}
  {width}
  height={$heightTween}
  {fill}
  stroke-width={1}
  class="stroke-gray-700"
/>

<text
  id="text-{name}"
  text-anchor="middle"
  x={x + width / 2}
  y={yGrow}
  dy={-8}
  class="text-xs">{value}</text
>
