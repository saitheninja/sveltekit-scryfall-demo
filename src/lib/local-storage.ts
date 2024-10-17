  import { writable } from "svelte/store";

  const createLocalStore = <Type,>(key: string, startValue: Type) => {
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

  export const jwt = createLocalStore("jwt", "");
  export const email = createLocalStore("email", "");

