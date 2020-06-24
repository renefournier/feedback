<script>
  import { onMount, onDestroy } from "svelte";
  import { fade, fly } from "svelte/transition";

  import { link, push, pop, replace } from "svelte-spa-router";
  import {
    Row,
    Col,
    Input,
    InputGroup,
    InputGroupAddon,
    Button,
    FormGroup,
    FormText
  } from "sveltestrap";
  import { user } from "../stores/user";
  import { events } from "../stores/events";
  import conductor from "../stores/conductor";
  import Nav from "../partials/Nav.svelte";

  user.useLocalStorage();
  events.useLocalStorage();

  // let eventName = "2020 Regional Convention in Red Deer, AB";
  // let parts = [
  //   "Daily Text",
  //   "Symposium: Learn from Josiah: Part 1",
  //   "Symposium: Learn from David",
  //   "Symposium: Learn from Jesus"
  // ];
  let eventName = "";
  let parts = [];

  let viewKey = String(`V-${randomCode(6)}`);
  let ratingKey = String(`R-${randomCode(6)}`);

  onMount(async () => {
    console.log("M: NewEvent");
  });

  conductor.onmessage = e => {
    try {
      const data = JSON.parse(e.data);
      console.log("→ New event", data);
      switch (data.action) {
        case "/new-event":
          const event = data.data;
          delete event.parts;
          delete event.created;
          delete event.deleted;
          delete event.updated;
          console.log(event);
          events.add(event);
          push(`/`);
          break;
      }
    } catch (error) {
      alert(error);
    }
  };

  function uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  function randomCode() {
    return Math.floor(100000 + Math.random() * 900000);
  }

  function addPart() {
    parts = [...parts, ""];
  }

  function deletePart(i) {
    // INDEX
    var filtered = parts.filter(function(value, index, arr) {
      return index !== i;
    });
    parts = [...filtered];
  }

  function createEvent(event) {
    parts = parts.filter(function(el) {
      return el != null && el !== "";
    });

    if (eventName.trim().length < 1) {
      alert("Please enter an event name.");
    } else if (parts.length < 1) {
      alert("Please add at least one part.");
    } else {
      const msg = {
        action: "/new-event",
        name: eventName,
        parts: parts,
        organizer_name: $user.name,
        organizer_pin: $user.pin,
        view_key: viewKey,
        rating_key: ratingKey
      };
      console.log("← New event", msg);
      conductor.fetch(msg);
    }
  }
</script>

<Nav />

<h1 class="text-center mb-4">

  <span class="mode">New event</span>
  {eventName}
</h1>

<FormGroup class="">

  <Input
    class="form-control form-control-lg"
    placeholder="Event name"
    bind:value={eventName} />

</FormGroup>

<FormGroup class="">
  <Row>
    <Col xs="6">
      <FormText>
        <h3 class="subtle">Parts</h3>
      </FormText>
    </Col>
    <Col xs="6" class="text-right">
      <Button outline size=" " on:click={addPart}>
        <span class="fas fa-plus" />
      </Button>
    </Col>
  </Row>
  {#each parts as part, index}
    <div transition:fly={{ x: -500, duration: 250 }}>
      <InputGroup>
        <Input placeholder="Part name" bind:value={part} />
        <InputGroupAddon addonType="append">
          <Button outline on:click={() => deletePart(index)}>
            <span class="far fa-trash-alt" />
          </Button>
        </InputGroupAddon>
      </InputGroup>
    </div>
  {/each}

</FormGroup>

<Button block class="btn btn-info" on:click={createEvent}>Create</Button>

<br />
<br />
<br />
