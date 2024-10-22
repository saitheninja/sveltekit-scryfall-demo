<form
  id="form-log-out"
  class="mx-auto max-w-max"
  on:submit|preventDefault={() => {
    localStorage.clear();
    location.reload();
  }}
>
  <button class="button-primary mx-auto max-w-max"> Log Out </button>
</form>
