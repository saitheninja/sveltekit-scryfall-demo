  import { writable } from "svelte/store";

  const createLocalStorageEntry = <Type,>(key: string, startValue: Type) => {
    const { subscribe, set, update } = writable(startValue);

    return {
      subscribe,
      set,
      update,
      useLocalStorage: () => {
        const storageValue = localStorage.getItem(key);

        if (storageValue) {
          set(JSON.parse(storageValue));
        }

        subscribe((currentValue) => {
          localStorage.setItem(key, JSON.stringify(currentValue));
        });
      },
    };
  };

  // user data
  export const email = createLocalStorageEntry("email", "");
  export const jwt = createLocalStorageEntry("jwt", "");
  // app status
  export const isLoading = createLocalStorageEntry("isLoading", "");

