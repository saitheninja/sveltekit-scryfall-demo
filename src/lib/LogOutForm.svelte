<script lang="ts">
  export let disabled = false;
</script>

<form
  id="form-log-out"
  class="mx-auto max-w-max"
  on:submit|preventDefault={() => {
    disabled = true;
    localStorage.clear();

    disabled = false;
    location.reload();
  }}
>
  <button
    {disabled}
    class="button-primary mx-auto max-w-max"
  >
    Log Out
  </button>
</form>
