<script>
  export let repo;
</script>

<h1>
  {repo.name}
  <a href={repo.url} class="link-parent"
    ><img src="link.png" alt="site here" /></a
  >
</h1>

<style>
  h1 {
    font-size: 3rem;
    text-align: center;
    margin: 2rem;
  }

  a {
    z-index: 20;
    isolation: isolate;
  }

  a > img:hover {
    scale: 1.5;
  }

  img {
    height: 20rem;
  }

  .link-parent {
    position: relative;
  }

  img[src="link.png"] {
    filter: invert();
    height: 2rem;
    margin: 2rem;
    position: absolute;
    top: -1rem;
  }
</style>
