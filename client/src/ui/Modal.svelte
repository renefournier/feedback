<script>
  import { createEventDispatcher } from "svelte"; //
  import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader
  } from "sveltestrap";

  export let isOpen;
  const dispatch = createEventDispatcher();
  function dismiss() {
    // console.log("← Modal");
    dispatch("dismiss");
  }
</script>

<Modal {isOpen}>
  <ModalHeader
    style="background: #aaa; width: 100%; color: white; margin: 0 auto;
    text-align: center">
    <slot name="header">Header</slot>
  </ModalHeader>
  <ModalBody>
    <slot name="body">Body</slot>
  </ModalBody>
  <ModalFooter>
    <Button color="secondary" on:click={dismiss}>Close</Button>
  </ModalFooter>
</Modal>

<style>
  .modal-body {
    /* padding: 0 !important; */
  }
</style>
