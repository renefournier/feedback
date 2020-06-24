<script>
  // import conductor from "../stores/conductor.js";
  import { user } from "../stores/user";
  // import { events } from "../stores/events";
  import { link, location, push, pop, replace } from "svelte-spa-router";

  import { onMount, onDestroy, createEventDispatcher } from "svelte";
  import { Col, Row, Button } from "sveltestrap";

  user.useLocalStorage();
  // events.useLocalStorage();

  onMount(async () => {
    console.log("M: Nav");
    if ($location.indexOf("rate-event") > -1) {
      if (!$user || !$user.name || !$user.pin) {
        auth();
      }
    }
  });

  function auth() {
    if ($user.name || $user.pin) {
      const signout = confirm(
        `Do you wish to sign-out as “${$user.name}”?\n\nIn order to sign-in again as yourself, you will need to enter your user exactly as "${$user.name}", along with your pin "${$user.pin}". If you change your mind, click Cancel.`
      );
      if (signout) {
        user.set({ name: null, pin: null });
      }
    } else {
      const userName = prompt(
        "Please enter your name, e.g., “John”.\n\nThis is what will appear alongside your ratings. Plus, entering your name—and, in a moment, an easy-to-remember four-digit PIN—will let you retrieve any events you’ve created in the past."
      );
      if (userName) {
        const userPin = prompt(
          "Please enter a four-digit PIN.\n\nIt can be any number you like.\nWe suggest choosing a  PIN that’s easy to remember."
        );
        if (userName && userPin) {
          user.set({ name: userName.trim(), pin: userPin.trim() });
          // getEvents();
        }
      }
    }
  }

  let winter = [0, 1, 2, 10, 11].includes(new Date().getMonth()) ? true : false;
</script>

<Row>
  <Col xs="3">

    <Button size="lg" class="" color="light" on:click={() => push(`/`)}>
      {#if winter === true}
        <span class="fas fa-igloo" />
      {:else}
        <span class="fas fa-home" />
      {/if}
    </Button>
  </Col>
  <Col xs="6" class="text-center">
    <h3 class="brand subtle pt-2">Feedback</h3>
  </Col>
  <Col xs="3" class="text-right">
    <Button size="lg" class="" color="light" on:click={auth}>

      {#if $user}
        <span>
          <span class="fas fa-user" />
          {#if $user.name}{$user.name}{/if}
        </span>
      {:else}
        <span class="fas fa-user" />
      {/if}

    </Button>
  </Col>
</Row>
