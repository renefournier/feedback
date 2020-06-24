<script>
  import { onMount, onDestroy } from "svelte";
  import { user } from "../stores/user.js";
  import conductor from "../stores/conductor.js";
  import { Row, Col, Input, Button, FormGroup } from "sveltestrap";
  import Modal from "../ui/Modal.svelte";
  import teachingPoints from "../teaching.js";
  import Thumbs from "../ui/Thumbs.svelte";

  export let key;
  export let event;

  user.useLocalStorage();

  // 09870987

  onMount(async () => {
    console.log("M: RateParts");
    console.log(key);
  });

  conductor.onmessage = e => {
    try {
      const data = JSON.parse(e.data);
      console.log("→", data);
      switch (data.action) {
        case "/rate-part":
          const updatedRating = data.data;
          const partIndex = event.parts.findIndex(part => {
            return part.id === updatedRating.part_id;
          });
          if (partIndex > -1) {
            event.parts[partIndex].ratings[0] = updatedRating;
            selectedPart = event.parts[partIndex];
          }
          break;
      }
    } catch (error) {
      alert(error);
    }
  };

  let selectedPart = null;

  let selectedStudyPoint;

  let partModalOpen = false;
  let studyPointModalOpen = false;
  let helpModalOpen = false;

  function ratePart(part) {
    selectedPart = part;
    partModalOpen = true;
  }

  // selectedPart = event.parts[1];
  // selectedPart = null;
  // partModalOpen = true;

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

  function good(part, point) {
    console.log(part, point);
    rate(part, point, true);
  }

  function workon(part, point) {
    console.log(part, point);
    rate(part, point, false);
  }

  function rated(kind, point, ratingsArr) {
    if (ratingsArr.length === 0) {
      return "light";
    } else {
      const ratings = ratingsArr[0];
      if (kind === "down" && ratings[point] === false) {
        return "warning";
      } else if (kind === "up" && ratings[point] === true) {
        return "success";
      } else {
        return "light";
      }
    }
  }

  function rate(part, point, opinion) {
    const msg = {
      action: "/rate-part",
      key: key,
      user: $user,
      part: part,
      point: point,
      opinion: opinion
    };
    console.log("← Rate", msg);
    conductor.fetch(msg);
  }

  let k = 0;
  let saveDebounce = null;

  function saveComments(event) {
    k++;
    console.log(k);
    clearTimeout(saveDebounce);
    saveDebounce = setTimeout(() => {
      const comments = event.target.value;
      console.log(comments);
      selectedPart.ratings[0] = {
        comments: comments
      };
      const msg = {
        action: "/rate-part",
        key: key,
        user: $user,
        part: selectedPart
      };
      console.log("← Comments", msg);
      conductor.fetch(msg);
    }, 500);
  }
</script>

<!-- <p class="text-muted">RATE</p> -->

{#if event.parts}
  {#each event.parts as part, index (part.id)}
    <div>
      <Button color="light" class="part" block on:click={() => ratePart(part)}>
        {part.name}
        {#if part.ratings.length > 0}
          <div class="float-right ml-2">
            <Thumbs ratings={part.ratings} />
          </div>
        {/if}

      </Button>
    </div>
  {/each}
{/if}

<Modal isOpen={partModalOpen} on:dismiss={() => (partModalOpen = false)}>
  <div slot="header" class="text-center">
    {#if selectedPart}{selectedPart.name}{/if}
    <span class=" ml-2">
      <span
        class="far fa-lg fa-question-circle"
        on:click={() => (helpModalOpen = true)} />
    </span>
  </div>
  <div slot="body">
    <Row>
      <Col xs="12">

        {#if selectedPart}
          <FormGroup>
            <Input
              type="textarea"
              rows="3"
              name="text"
              id="comments"
              placeholder="Comments, observations, suggestions..."
              value={selectedPart.ratings[0] ? selectedPart.ratings[0].comments : ''}
              on:input={saveComments} />
          </FormGroup>
        {/if}
      </Col>
    </Row>
    {#each teachingPoints as point (point.study)}
      <Row>
        <Col xs="3" class="text-center">
          {#if selectedPart}
            <Button
              block
              color={rated('down', point.study, selectedPart.ratings)}
              size="lg"
              on:click={() => workon(selectedPart, point)}>
              <span class="fas fa-hammer" />
            </Button>
          {/if}
        </Col>
        <Col xs="6">
          <Button block color="light" on:click={() => showStudyPoint(point)}>
            {point.name}
          </Button>
        </Col>

        <Col xs="3" class="text-center">
          {#if selectedPart}
            <Button
              block
              color={rated('up', point.study, selectedPart.ratings)}
              size="lg"
              on:click={() => good(selectedPart, point)}>
              <span class="far fa-thumbs-up" />
            </Button>
          {/if}
        </Col>
      </Row>
    {/each}

  </div>
</Modal>

<Modal
  isOpen={studyPointModalOpen}
  on:dismiss={() => (studyPointModalOpen = false)}>
  <div slot="header">{selectedStudyPoint.name}</div>
  <span slot="body">
    {selectedStudyPoint.description}
    <hr />
    <a href={selectedStudyPoint.source}>
      <span class="fas fa-lg fa-link" />
      {selectedStudyPoint.source}
    </a>
  </span>
</Modal>

<Modal isOpen={helpModalOpen} on:dismiss={() => (helpModalOpen = false)}>
  <div slot="header">Rating a part</div>
  <span slot="body">
    If a speaker displays a speech quality particulary well, tap
    <span class="far fa-lg fa-thumbs-up" />
    . On the other hand, if there is a speech quality that you feel the speaker
    can work on, tap
    <span class="fas fa-lg fa-hammer" />
    . Use the Comments field to add specific feedback regarding what was
    especially effective about the part and/or which speech quality could use
    improvement, and why.
    <hr />
    <strong>Please note:</strong>
    Not all speech qualities need to be rated, just the ones that stand out in a
    positive or negative way.
  </span>
</Modal>
