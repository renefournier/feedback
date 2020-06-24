<script>
  export let icon = "fa-camera";
  export let color = "badge-secondary";
  export let numRatings = 0;

  $: size = whichSize(numRatings);
  $: padding = whichPadding(numRatings);

  function whichPadding(numRatings) {
    switch (numRatings) {
      case 1:
        return "";
        break;
      case 2:
        return "";
        break;
      case 3:
        return "p-1";
        break;
      case 4:
        return "p-1";
        break;
      case 5:
        return "p-2";
        break;
      case 6:
        return "p-3";
        break;
      default:
        return "p-3";
        break;
    }
  }

  function whichSize(numRatings) {
    switch (numRatings) {
      case 1:
        return "fa-sm";
        break;
      case 2:
        return "";
        break;
      case 3:
        return "fa-lg";
        break;
      case 4:
        return "fa-2x";
        break;
      case 5:
        return "fa-3x";
        break;
      case 6:
        return "fa-5x";
        break;
      default:
        return "fa-7x";
        break;
    }
  }
</script>

{#if numRatings > 0}
  <span class="badge badge-pill {color} ml-1">
    <span class="fas {size} {icon} {padding}" />
    {numRatings > 1 ? numRatings : ''}
  </span>
{/if}
