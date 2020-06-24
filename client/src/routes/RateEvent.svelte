<script>
  import { user } from "../stores/user.js";
  import { onMount, onDestroy, createEventDispatcher } from "svelte";
  import conductor from "../stores/conductor.js";
  import { Container } from "sveltestrap";
  import Nav from "../partials/Nav.svelte";
  import RateParts from "../partials/RateParts.svelte";
  export let params = {};

  user.useLocalStorage();

  let event;
  let i = 0;

  onMount(async () => {
    console.log("M: Event");
    const retry = setInterval(function() {
      console.log(".");
      if (conductor.readyState === 1) {
        console.log("*", params.key);
        const msg = {
          action: "/rate-event",
          key: params.key,
          user: $user
        };
        console.log("←", msg);
        clearInterval(retry);
        conductor.fetch(msg);
      }
    }, 0);
  });

  conductor.onmessage = e => {
    try {
      const data = JSON.parse(e.data);
      console.log("→", data);
      switch (data.action) {
        case "/rate-event":
          console.log("+++");
          console.log(data.data.ratings);
          event = data.data;
          break;
      }
    } catch (error) {
      console.error(error);
      alert("Ack!");
    }
  };
</script>

<Container>
  <Nav />

  {#if event && event.name}
    <h1 class="text-center mb-4">
      <span class="mode">Rating</span>
      {event.name}
    </h1>

    <RateParts {event} key={params.key} />
  {/if}
</Container>

<style>

</style>
