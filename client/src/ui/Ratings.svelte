<script>
  import { onMount } from "svelte";
  import { beforeUpdate, afterUpdate } from "svelte";
  import Modal from "../ui/Modal.svelte";

  import { Table } from "sveltestrap";
  import Icon from "./Icon.svelte";
  import teachingPoints from "../teaching.js";

  export let ratings;
  let studyPointModalOpen = false;
  let selectedStudyPoint;

  let reviewersModalOpen = false;
  let reviewersPeople = [];
  let reviewerReaction;

  var sumRatings = {};

  onMount(async () => {
    console.log("M: Ratings");
  });

  beforeUpdate(() => {
    console.log("BU: Ratings");
    sumRatings = {
      th_01: {
        ups: { ratings: 0, people: [] },
        downs: { ratings: 0, people: [] }
      },
      th_02: {
        ups: { ratings: 0, people: [] },
        downs: { ratings: 0, people: [] }
      },
      th_03: {
        ups: { ratings: 0, people: [] },
        downs: { ratings: 0, people: [] }
      },
      th_04: {
        ups: { ratings: 0, people: [] },
        downs: { ratings: 0, people: [] }
      },
      th_05: {
        ups: { ratings: 0, people: [] },
        downs: { ratings: 0, people: [] }
      },
      th_06: {
        ups: { ratings: 0, people: [] },
        downs: { ratings: 0, people: [] }
      },
      th_07: {
        ups: { ratings: 0, people: [] },
        downs: { ratings: 0, people: [] }
      },
      th_08: {
        ups: { ratings: 0, people: [] },
        downs: { ratings: 0, people: [] }
      },
      th_09: {
        ups: { ratings: 0, people: [] },
        downs: { ratings: 0, people: [] }
      },
      th_10: {
        ups: { ratings: 0, people: [] },
        downs: { ratings: 0, people: [] }
      },
      th_11: {
        ups: { ratings: 0, people: [] },
        downs: { ratings: 0, people: [] }
      },
      th_12: {
        ups: { ratings: 0, people: [] },
        downs: { ratings: 0, people: [] }
      },
      th_13: {
        ups: { ratings: 0, people: [] },
        downs: { ratings: 0, people: [] }
      },
      th_14: {
        ups: { ratings: 0, people: [] },
        downs: { ratings: 0, people: [] }
      },
      th_15: {
        ups: { ratings: 0, people: [] },
        downs: { ratings: 0, people: [] }
      },
      th_16: {
        ups: { ratings: 0, people: [] },
        downs: { ratings: 0, people: [] }
      },
      th_17: {
        ups: { ratings: 0, people: [] },
        downs: { ratings: 0, people: [] }
      },
      th_18: {
        ups: { ratings: 0, people: [] },
        downs: { ratings: 0, people: [] }
      },
      th_19: {
        ups: { ratings: 0, people: [] },
        downs: { ratings: 0, people: [] }
      },
      th_20: {
        ups: { ratings: 0, people: [] },
        downs: { ratings: 0, people: [] }
      }
    };

    ratings.forEach(rating => {
      for (let i = 1; i < 21; i++) {
        let suff = String("00" + i).substr(-2);
        if (rating["th_" + suff] === true) {
          sumRatings["th_" + suff].ups.ratings++;
          console.log(rating.listener_name);
          sumRatings["th_" + suff].ups.people.push(rating.listener_name);
        }
        if (rating["th_" + suff] === false) {
          sumRatings["th_" + suff].downs.ratings++;
          console.log(rating.listener_name);
          sumRatings["th_" + suff].downs.people.push(rating.listener_name);
        }
      }
    });
  });

  afterUpdate(() => {
    console.log("AU: Ratings");
  });

  function showStudyPoint(point) {
    selectedStudyPoint = point;
    studyPointModalOpen = true;
  }

  function showReviewers(point, reaction, reviewers) {
    selectedStudyPoint = point;
    reviewerReaction = reaction;
    reviewersPeople = reviewers;
    reviewersModalOpen = true;
  }
</script>

{#each ratings as rating}
  {#if rating.comments && rating.comments.trim().length > 0}
    <p class="comment mb-4">
      “{rating.comments}”
      <span class="text-muted">— {rating.listener_name}</span>
    </p>
  {/if}
{/each}

<Table class="table table-sm">
  <tbody>
    {#each teachingPoints as point (point.study)}
      <tr>
        <td class="pointy" on:click={() => showStudyPoint(point)}>
          {point.name}
        </td>
        <td
          class="text-center pointy"
          on:click={() => showReviewers(point, 'work-on', sumRatings[point.study].downs.people)}>
          <Icon
            icon="fa-hammer"
            color="badge-warning"
            numRatings={sumRatings[point.study].downs.ratings} />
        </td>
        <td
          class="text-center pointy"
          on:click={() => showReviewers(point, 'good', sumRatings[point.study].ups.people)}>
          <Icon
            icon="fa-thumbs-up"
            color="badge-success"
            numRatings={sumRatings[point.study].ups.ratings} />

        </td>
      </tr>
    {/each}
  </tbody>
</Table>

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

<Modal
  isOpen={reviewersModalOpen}
  on:dismiss={() => (reviewersModalOpen = false)}>
  <div slot="header">{selectedStudyPoint.name}</div>
  <span slot="body">

    {#each reviewersPeople as person}
      <p>
        <span class="mr-2">
          {#if reviewerReaction === 'work-on'}
            <Icon icon="fa-hammer" color="badge-warning" numRatings={1} />
          {:else}
            <Icon icon="fa-thumbs-up" color="badge-success" numRatings={1} />
          {/if}
        </span>
        {person}
      </p>
    {/each}

  </span>
</Modal>

<style>
  table {
    margin: 0;
  }
  .table td,
  .table th {
    border-top: 1px solid rgba(0, 0, 0, 0.05);
  }
  table tbody tr td {
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }
</style>
