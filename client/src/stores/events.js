import { writable } from "svelte/store";

const createWritableStore = (key, startValue) => {
  const { subscribe, set } = writable(startValue);

  return {
    subscribe,
    set,

    add: event => {
      const json = JSON.parse(localStorage.getItem(key));
      json.unshift(event);
      set(json);
    },

    remove: id => {
      console.log("removing", id);
      const json = JSON.parse(localStorage.getItem(key));
      const newEvents = json.filter(i => i.id !== id);
      console.log(newEvents);
      set(newEvents);
    },

    useLocalStorage: () => {
      const json = localStorage.getItem(key);
      if (json) {
        set(JSON.parse(json));
      }

      subscribe(current => {
        localStorage.setItem(key, JSON.stringify(current));
      });
    }
  };
};

export const events = createWritableStore("events", []);
