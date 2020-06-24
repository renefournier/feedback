<script>
  import { Row, Col, Input, Button, FormGroup } from "sveltestrap";
  import { ListGroup, ListGroupItem } from "sveltestrap";

  import Modal from "../ui/Modal.svelte";
  import Thumbs from "../ui/Thumbs.svelte";
  import Ratings from "../ui/Ratings.svelte";
  import teachingPoints from "../teaching.js";

  export let event;

  // qwerqwer

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

  function good(point) {
    console.log(point);
  }

  function workon(point) {
    console.log(point);
  }
</script>

<!-- <p class="text-muted">VIEW</p> -->

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
