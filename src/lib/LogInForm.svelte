<script lang="ts">
  import type { SubmitFunction } from "@sveltejs/kit";

  import { enhance } from "$app/forms";
  import { email, jwt } from "$lib/local-storage";

  export let form;

  const submitFn: SubmitFunction = () => {
    return async ({ result, update }) => {
      console.log(result);

      if (result.type === "success") {
        $email = result.data?.email?.toString() ?? "";
        $jwt = result.data?.jwt?.toString() ?? "";
      }

      await update();
    };
  };
</script>

{#if !form?.success}
  <h1 class="mb-12">Log In</h1>

  <div class="mx-auto w-full max-w-sm p-4">
    <h2
      id="heading-log-in"
      class="mb-4 text-center"
    >
      Log In
    </h2>

    <form
      id="form-log-in"
      aria-labelledby="heading-log-in"
      class="flex flex-col gap-2"
      method="POST"
      action="?/login"
      use:enhance={submitFn}
    >
      <div>
        <label for="log-in-email">
          <span> Email </span>
          <span class="text-red-500"> * </span>
        </label>

        <input
          type="email"
          id="log-in-email"
          name="log-in-email"
          required
          minlength="4"
        />
      </div>

      <div>
        <label for="log-in-password">
          <span> Password </span>
          <span class="text-red-500"> * </span>
        </label>

        <input
          type="password"
          id="log-in-password"
          name="log-in-password"
          required
          minlength="6"
        />
      </div>

      <div class="mx-auto my-2 max-w-max">
        <button
          id="log-in-submit"
          class="button"
        >
          Log In
        </button>
      </div>
    </form>

    {#if form && !form.success}
      <div class="mt-4 text-center italic">
        <h3>Error!</h3>

        <p>
          {form?.message}
        </p>
      </div>
    {/if}
  </div>
{:else}
  <div class="mx-auto flex max-w-sm flex-col justify-center p-4">
    <h2 class="mb-4 text-center">Logged In!</h2>

    <p class="mb-4 text-center">You have successfully logged in!</p>
  </div>
{/if}

<!-- <style>
  form:has(:invalid) {
    background-color: red;
  }

  input:required:invalid {
    border-width: 2px;
    border-color: red;
  }

  input:required:valid {
    border-width: 2px;
    border-color: green;
  }

  label:has(+ input:required):after {
    content: " *";
    color: red;
  }
</style> -->
