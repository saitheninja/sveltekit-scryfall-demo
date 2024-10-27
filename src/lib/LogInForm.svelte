<script lang="ts">
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";

  import { email, jwt } from "$lib/local-storage";

  import type { SubmitFunction } from "@sveltejs/kit";

  export let form;

  const submitFn: SubmitFunction = () => {
    return async ({ result, update }) => {
      if (result.type === "success") {
        $email = result.data?.email?.toString() ?? "";
        $jwt = result.data?.jwt?.toString() ?? "";
        // alert("Login sucessful. Redirecting to data page.");
        await goto("/scryfall");
      } else {
        await update();
      }
    };
  };
</script>

<div class="w-full">
  {#if !form?.success}
    <hgroup class="mb-4">
      <h2
        id="heading-log-in"
        class="heading-style-2"
      >
        Log In
      </h2>
      <p class="text-minor">"test@example.com" "password123"</p>
    </hgroup>

    <form
      id="form-log-in"
      aria-labelledby="heading-log-in"
      class="flex flex-col gap-2"
      method="POST"
      action="/?/login"
      use:enhance={submitFn}
    >
      <div class="flex flex-col">
        <label for="log-in-email">Email</label>

        <input
          type="email"
          id="log-in-email"
          name="log-in-email"
          required
          minlength="4"
        />
      </div>

      <div class="flex flex-col">
        <label for="log-in-password">Password</label>

        <input
          type="password"
          id="log-in-password"
          name="log-in-password"
          required
          minlength="6"
        />
      </div>

      <div class="mx-auto max-w-max py-4">
        <button
          id="log-in-submit"
          class="button-primary"
        >
          Log In
        </button>
      </div>
    </form>
  {/if}

  {#if form?.message}
    <hr class="mb-4 mt-2" />

    <div class="pb-2 italic text-red-500">
      <h3 class="heading-style-3">Error</h3>

      <p>{form.message}</p>
    </div>
  {/if}
</div>
