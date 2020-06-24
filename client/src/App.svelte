<script>
  import Router from "svelte-spa-router";
  import { Container, Row, Col, Button } from "sveltestrap";

  import Home from "./routes/Home.svelte";
  import NewEvent from "./routes/NewEvent.svelte";
  import ViewEvent from "./routes/ViewEvent.svelte";
  import RateEvent from "./routes/RateEvent.svelte";
  import NotFound from "./routes/NotFound.svelte";

  const routes = {
    // Exact path
    "/": Home,

    // Using named parameters, with last being optional
    "/new-event": NewEvent,

    // View event
    "/view-event/:key": ViewEvent,

    // Rate event
    "/rate-event/:key": RateEvent,

    // Catch-all
    // This is optional, but if present it must be the last
    "*": NotFound
  };
</script>

<style>

</style>

<div class="container h-100">
  <Router {routes} />
</div>
