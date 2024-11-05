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

  const tweenHeight = tweened(0, { delay: 200, duration: 1000, easing: quintOut });
  const tweenWidth = tweened(0, { duration: 200, easing: quintOut });

  $: height = baseline - y;
  $: tweenHeight.set(height);
  $: tweenWidth.set(width);

  $: yGrow = baseline - $tweenHeight;
</script>

<rect
  id="rect-{name}"
  {x}
  y={yGrow}
  height={$tweenHeight}
  width={$tweenWidth}
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
