<script>
  import { onMount, onDestroy, createEventDispatcher } from "svelte";
  import { user } from "../stores/user";
  import conductor from "../stores/conductor";
  import { Container } from "sveltestrap";
  import Nav from "../partials/Nav.svelte";
  // import ViewParts from "../partials/ViewParts.svelte";
  import { Row, Col, Input, Button, FormGroup } from "sveltestrap";
  import { ListGroup, ListGroupItem } from "sveltestrap";

  import Modal from "../ui/Modal.svelte";
  import Thumbs from "../ui/Thumbs.svelte";
  import Ratings from "../ui/Ratings.svelte";
  import teachingPoints from "../teaching.js";
  export let params = {};

  user.useLocalStorage();

  let event;

  onMount(async () => {
    console.log("M: Event");
    const retry = setInterval(function() {
      console.log(".");
      if (conductor.readyState === 1) {
        console.log("*");
        const msg = {
          action: "/view-event",
          key: params.key,
          user: $user
        };
        clearInterval(retry);
        conductor.fetch(msg);
      }
    }, 0);
  });

  conductor.onmessage = e => {
    try {
      const data = JSON.parse(e.data);
      console.log("→", data);
      // console.log(JSON.stringify(data));
      switch (data.action) {
        case "/view-event":
          console.log("!!!!");
          event = { ...data.data };
          break;
      }
    } catch (error) {
      console.error(error);
      alert("Ack!");
    }
  };

  let selectedPart = null;

  let comments = "";
  let selectedStudyPoint;

  let partModalOpen = false;
  let studyPointModalOpen = false;
  let helpModalOpen = false;

  function viewPart(part) {
    console.log(part);
    selectedPart = part;
    partModalOpen = true;
  }

  function dismiss() {
    partModalOpen = false;
  }

  function showModal(point) {
    partModalOpen = true;
  }

  function showStudyPoint(point) {
    selectedStudyPoint = point;
    studyPointModalOpen = true;
  }
</script>

<style>

</style>

<Container>
  <Nav mode="Viewing" />

  {#if event}
    <h1 class="text-center mb-4">
      <span class="mode">Viewing</span>
      {event.name}
    </h1>
    <!-- {#if event.parts[0] && event.parts[0].ratings[0]}
      {event.parts[0].ratings[0].th_01} {event.parts[0].ratings[0].comments}
    {/if} -->
    <div class="accordion" id="parts">
      {#each event.parts as part (part.id)}
        <div class="card">
          <div class="card-header p-0" id="card{part.id}">
            <button
              class="btn btn-block text-left mb-0 p-3 "
              type="button"
              data-toggle="collapse"
              data-target="#collapse{part.id}"
              aria-expanded="true"
              aria-controls="collapse{part.id}">
              {#if part.ratings.length > 0}
                <div class="float-right ml-2">
                  <Thumbs ratings={part.ratings} />
                </div>
              {/if}
              {part.name}
            </button>
          </div>

          <div
            id="collapse{part.id}"
            class="collapse "
            aria-labelledby="heading{part.id}"
            data-parent="#parts">
            <div class="card-body">
              <Ratings ratings={part.ratings} />
            </div>
          </div>

        </div>
      {/each}
    </div>
  {/if}
  <br />
  <br />
  <br />
</Container>
