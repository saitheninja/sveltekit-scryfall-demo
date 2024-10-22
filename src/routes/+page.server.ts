import { fail } from "@sveltejs/kit";
// import { redirect } from "@sveltejs/kit";

import type { Actions } from "./$types";

export const actions: Actions = {
  login: async (event) => {
    const formData = await event.request.formData();

    const email = formData.get("log-in-email") as string;
    const password = formData.get("log-in-password") as string;

    if (!email || !password) {
      return fail(400, { message: "Missing form data." });
    }

    // auth check that requires sensitive data here, on the server side
    if (email !== "test@example.com" || password !== "password123") {
      return fail(400, { message: "Incorrect email or password!" });
    }

    return { success: true, email: email, jwt: "loggedin" };
    // throw redirect(303, "/scryfall");
  },
};
