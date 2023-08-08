<script>
  export let dark;

  function toggleDarkMode() {
    dark = !dark;
  }
</script>

<button on:click={toggleDarkMode}> moon </button>
