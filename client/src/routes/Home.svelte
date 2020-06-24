<script>
  import { onMount } from "svelte";
  import { link, push, pop, replace } from "svelte-spa-router";
  import { Container, Row, Col, Button, ButtonGroup } from "sveltestrap";
  import conductor from "../stores/conductor.js";
  import { user } from "../stores/user";
  import { events } from "../stores/events";

  import Modal from "../ui/Modal.svelte";

  user.useLocalStorage();
  events.useLocalStorage();

  let modalHelpOpen = false;
  let emailHelp = `
- What is this about, you ask? - 
When trying to improve in the art of teaching and public speaking, many speakers will ask for feedback in advance, so the person whom they ask for counsel will listen to their assignment and give them some constructive feedback—with the goal of helping the speaker improve. Feedback is designed to make this kind of counsel easier to give and receive.
`;

  onMount(async () => {
    console.log("M: Home");
    conductor.onopen = () => {
      getEvents();
    };
  });

  function showModal(point) {
    currentPoint = point;
    modalOpen = true;
  }

  function dismiss() {
    modalOpen = false;
  }

  function viewEvent(action) {
    const eventKey = prompt(
      `To view the ratings for an event you created, please enter its six-digit View Key.`
    );

    if (eventKey) {
      push(`/view-event/V-${eventKey}`);
    }
  }

  function rateEvent(action) {
    const eventKey = prompt(
      `To rate parts of an event, please enter its six-digit Rating Key.`
    );

    if (eventKey) {
      push(`/rate-event/R-${eventKey}`);
    }
  }

  function mailto(kind, event) {
    switch (kind) {
      case "view":
        var subject = encodeURIComponent(`Feedback for: ${event.name}`);
        var body = encodeURIComponent(`Hello!

You’re invited to view ratings for “${event.name}”. To do so:

  • Tap this link: ${window.location}view-event/${event.view_key}

  • Or, visit ${
    window.location.href
  }, tap View, then enter: ${event.view_key.substr(2)}

`);
        return `mailto:?subject=${subject}&body=${body}`;
        break;
      default:
      case "rate":
        var subject = encodeURIComponent(`Feedback for: ${event.name}`);
        var body = encodeURIComponent(`Hello!

You’re invited to rate parts in “${event.name}”. To do so: 

  • Tap this link: ${window.location}rate-event/${event.rating_key}
  
  • Or, visit ${
    window.location.href
  }, tap Rate, then enter: ${event.rating_key.substr(2)}
  
`);
        return `mailto:?subject=${subject}&body=${body}`;
        break;
    }
  }

  function copyStringToClipboard(str) {
    // Create new element
    var el = document.createElement("textarea");
    // Set value (string to be copied)
    el.value = str;
    // Set non-editable to avoid focus and move outside of view
    el.setAttribute("readonly", "");
    el.style = { position: "absolute", left: "-9999px" };
    document.body.appendChild(el);
    // Select text inside element
    el.select();
    // Copy text to clipboard
    document.execCommand("copy");
    // Remove temporary element
    document.body.removeChild(el);
  }

  function copy(kind, event) {
    // if (!navigator.clipboard) {
    //   console.log("No clipboard");
    //   return;
    // }

    switch (kind) {
      case "view":
        var text = `${window.location}view-event/${event.view_key}`;
        break;
      default:
      case "rate":
        var text = `${window.location}rate-event/${event.rating_key}`;
        break;
    }

    copyStringToClipboard(text);
  }

  function remove(event) {
    const confirmed = confirm(
      `Are you sure you want to delete the event "${event.name}"?\n\nPlease note: This will also delete any and all related parts and ratings.\nWarning: There is no undo.`
    );

    if (confirmed) {
      if (conductor.readyState === 1) {
        console.log("x");
        const msg = {
          action: "/remove-event",
          id: event.id,
          organizer_name: $user.name,
          organizer_pin: $user.pin
        };
        events.remove(event.id);
        console.log("←", msg);
        conductor.fetch(msg);
      }
    }
  }

  conductor.onmessage = e => {
    try {
      const data = JSON.parse(e.data);
      console.log("→", data);
      switch (data.action) {
        case "/remove-event":
          console.log("-");
          break;
        case "/get-events":
          console.log("*");
          events.set(data.data);
          break;
      }
    } catch (error) {
      console.error(error);
      alert("Ack!");
    }
  };

  function auth() {
    if ($user.name || $user.pin) {
      const signout = confirm(
        `Do you wish to sign-out as “${$user.name}”?\n\nIn order to sign-in again as yourself, you will need to enter your user exactly as "${$user.name}", along with your pin "${$user.pin}". If you change your mind, click Cancel.`
      );
      if (signout) {
        user.set({ name: null, pin: null });
        events.set([]);
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
          getEvents();
        }
      }
    }
  }

  function getEvents() {
    const msg = {
      action: "/get-events",
      organizer_name: $user.name || null,
      organizer_pin: $user.pin || null
    };
    console.log("←", msg);
    conductor.fetch(msg);
  }
</script>

<div class="row align-items-center h-100">
  <div class="col-12 mx-auto">

    <div class="text-center">
      <h1>
        Welcome to
        <span class="brand">Feedback</span>

      </h1>

      <div class="mt-2 mb-5">
        <a
          href="https://wol.jw.org/en/wol/b/r1/lp-e/Rbi8/20/15#study=discover&v=20:15:22"
          title="jw.org"
          class="subtle">
          In the multitude of counsellors there is accomplishment.
        </a>
        <span
          class="fas fa-lg fa-question-circle subtle pointy"
          on:click={() => (modalHelpOpen = true)} />

        <br />

      </div>
      <Row>
        <Col>

          {#if $user.name}
            <a class="btn primary mt-1" href="/new-event" use:link>
              <span class="fas fa-plus" />
              New event
            </a>

            <Button class="mb-0 mt-1" on:click={viewEvent}>
              <span class="fas fa-binoculars" />
              View
            </Button>

            <Button class="mb-0 mt-1" on:click={rateEvent}>
              <span class="far fa-thumbs-up" />
              Rate
            </Button>

            {#if $user.name}
              <Button class="mb-0 mt-1 btn-light subtle" on:click={auth}>
                Hello, {$user.name}
              </Button>
            {/if}
          {:else}
            <Button outline on:click={auth}>
              <span class="fas fa-user" />
              Who are you?
            </Button>

            <p class="subtle mt-3" style="max-width:25rem; margin: 0 auto">
              <span>
                <strong>What is this all about, you ask?</strong>
                <br />
                Feedback is designed to help speakers improve in the art of
                teaching. It does so by making counsel easier to give and
                receive. For more information—and a riveting backstory—click the
                question mark button above.
              </span>
            </p>
          {/if}

          <div class="mt-4">

            {#each $events as event, index (event.id)}
              <div class="event">

                <span class="text-muted mr-2">{event.name}</span>

                <ButtonGroup class="mx-1 my-0">
                  <a
                    class="btn btn-outline-secondary btn-sm "
                    href="/view-event/{event.view_key}"
                    use:link>
                    <span class="fas fa-binoculars" />
                    View
                  </a>
                  <button
                    class="btn btn-sm btn-outline-secondary mb-0"
                    type="button"
                    on:click={() => copy('view', event)}>
                    <span class="far fa-copy" />
                  </button>
                  <a
                    class="btn btn-outline-secondary btn-sm "
                    href={mailto('view', event)}>
                    <span class="fas fa-paper-plane" />
                  </a>
                </ButtonGroup>
                <ButtonGroup class="mx-1 my-0">
                  <a
                    class="btn btn-outline-secondary btn-sm "
                    href="/rate-event/{event.rating_key}"
                    use:link>
                    <span class="far fa-thumbs-up" />
                    Rate
                  </a>
                  <button
                    class="btn btn-sm btn-outline-secondary mb-0"
                    type="button"
                    on:click={() => copy('rate', event)}>
                    <span class="far fa-copy" />
                  </button>
                  <a
                    class="btn btn-outline-secondary btn-sm "
                    href={mailto('rate', event)}>
                    <span class="fas fa-paper-plane" />
                  </a>
                </ButtonGroup>

                <ButtonGroup class="mx-1 my-0">
                  <button
                    class="btn btn-sm btn-outline-secondary mb-0"
                    type="button"
                    on:click={() => remove(event)}>
                    <span class="far fa-trash-alt" />
                  </button>
                </ButtonGroup>

              </div>
            {/each}
          </div>

        </Col>
      </Row>
    </div>
  </div>
</div>

<Modal isOpen={modalHelpOpen} on:dismiss={() => (modalHelpOpen = false)}>
  <div slot="header" class="text-center">
    <div class="text-center">
      About
      <span class="brand">Feedback</span>
    </div>
  </div>
  <span slot="body">
    <h5>What & why</h5>
    <p>
      When trying to improve in the art of teaching and public speaking, many
      speakers will ask for feedback. Even better, some will ask in advance, so
      the person whom they ask can listen carefully to the talk and, afterwards,
      provide constructive feedback: Which speech qualities were handled well
      <span class="badge badge-pill badge-success">
        <span class="far fa-thumbs-up" />

      </span>
      , which ones could perhaps be worked-on
      <span class="badge badge-pill badge-warning">
        <span class="fas fa-hammer" />

      </span>
      .
    </p>
    <p>
      It can also be helpful to get more than one opinion, since different
      listeners will spot different strengths and/or areas for improvement. On
      the other hand, when several of your friends all make the same
      observation: “Maybe you could work on modulation.” ...They are probably
      right.
      <span class="brand brandColor">Feedback</span>
      is designed to make this kind of counsel easier to give and receive. Let’s
      help each other improve!
    </p>

    <h5>Getting started</h5>

    <ol>
      <li>
        Create a New Event, and give it a name: “Midweek Meeting”, “Public
        Meeting”, “Circuit Assembly”, etc.
      </li>
      <li>
        Add one or more parts, e.g.: “Public Talk: Speaker”, “Watchtower Study:
        Conductor”, “Watchtower Study: Reader”, etc.
      </li>
      <li>Tap Create.</li>
      <li>
        Next, share the Rating Link with one or more people from whom you would
        like feedback:
        <ul>
          <li>
            Tap
            <Button size="sm" outline>
              <span class="far fa-copy" />
            </Button>
            to copy the link to the clipboard; or
          </li>
          <li>
            Tap
            <Button size="sm" outline>
              <span class="far fa-paper-plane" />
            </Button>
            to email it to one or more persons.
          </li>
        </ul>
      </li>
      <li>
        When the event is over, tap
        <Button size="sm" outline>
          <span class="fas fa-binoculars" />
          View
        </Button>
        to see—and potentially share—a summary of feedback and comments from all
        who rated parts at the event.
      </li>
    </ol>

    <p class="subtle">As iron sharpens iron, so one man sharpens his friend.</p>
  </span>
</Modal>
