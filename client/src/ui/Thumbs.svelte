<script>
  import { onMount } from "svelte";
  import { beforeUpdate, afterUpdate } from "svelte";

  export let ratings;

  $: ups = upCounter(ratings);
  $: downs = downCounter(ratings);

  function upCounter() {
    let count = 0;
    ratings.forEach(rating => {
      count += [
        rating.th_01,
        rating.th_02,
        rating.th_03,
        rating.th_04,
        rating.th_05,
        rating.th_06,
        rating.th_07,
        rating.th_08,
        rating.th_09,
        rating.th_10,
        rating.th_11,
        rating.th_12,
        rating.th_13,
        rating.th_14,
        rating.th_15,
        rating.th_16,
        rating.th_17,
        rating.th_18,
        rating.th_19,
        rating.th_20
      ].filter(v => v === true).length;
    });
    return count;
  }

  function downCounter() {
    let count = 0;
    ratings.forEach(rating => {
      count += [
        rating.th_01,
        rating.th_02,
        rating.th_03,
        rating.th_04,
        rating.th_05,
        rating.th_06,
        rating.th_07,
        rating.th_08,
        rating.th_09,
        rating.th_10,
        rating.th_11,
        rating.th_12,
        rating.th_13,
        rating.th_14,
        rating.th_15,
        rating.th_16,
        rating.th_17,
        rating.th_18,
        rating.th_19,
        rating.th_20
      ].filter(v => v === false).length;
    });
    return count;
  }

  onMount(async () => {
    console.log("M: Thumbs");
  });

  beforeUpdate(() => {
    console.log("BU: Thumbs");
  });
</script>

<span class="badge badge-pill badge-warning">
  <span class="fas fa-hammer" />
  {downs}
</span>
<span class="badge badge-pill badge-success">
  <span class="far fa-thumbs-up" />
  {ups}
</span>
