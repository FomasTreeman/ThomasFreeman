<script>
  import { fly } from 'svelte/transition';
  import scrollIntoView from './utils/scroll';
</script>

<div class="flex">
  <a
    class="card"
    transition:fly={{ x: 150 }}
    href="#about"
    on:click|preventDefault={scrollIntoView}
  >
    About Me
  </a>
  <a
    class="card"
    transition:fly={{ x: 150 }}
    href="#project"
    on:click|preventDefault={scrollIntoView}
  >
    Betting Bot
  </a>
  <a
    class="card"
    transition:fly={{ x: 150 }}
    href="#readmes"
    on:click|preventDefault={scrollIntoView}
  >
    Projects
  </a>
</div>
<span class="flex col" transition:fly={{ y: -100 }}>
  <a href="https://fac-portfolio.vercel.app/">
    <img src="fac.svg" alt="FAC" />
  </a>
  <a href="https://github.com/FomasTreeman">
    <img style="filter: invert(1)" src="github.png" alt="github" />
  </a>
  <a href="https://www.linkedin.com/in/fomas-treeman/">
    <img src="linkedin.png" alt="linkedin" />
  </a>
  <a href="mailto: tom@team-freeman.com">
    <img src="gmail.png" alt="gmail" />
  </a>
</span>

<!-- <a href="https://www.flaticon.com/free-icons/linkedin" title="linkedin icons"
  >Linkedin icons created by Flaticon</a
> -->

<style>
  div {
    margin-right: 8rem;
    height: 7rem;
  }

  div > * {
    margin-bottom: 2rem;
  }

  .flex {
    display: flex;
    /* flex-wrap: wrap; */
    justify-content: end;
    align-items: end;
    gap: 5%;
  }

  .col {
    flex-direction: column;
  }

  .card {
    padding: 0.7rem;
    width: fit-content;
    height: fit-content;
    background-color: var(--background-color);
    border-radius: 2rem;
    font-size: x-large;
    text-transform: uppercase;
    font-weight: 800;
    text-align: center;
    box-shadow: 10px 10px 0px 0px var(--link-color);
    /* transition: all 1s cubic-bezier(0.075, 0.82, 0.165, 1); */
  }

  a.card:hover {
    transform: scale(1.1);
    transition: all 1s cubic-bezier(0.075, 0.82, 0.165, 1);
    color: var(--link-color-hover);
  }

  a img {
    width: 2.5rem;
    margin-inline: 2.3rem;
    margin-block: 0.7rem;
  }

  @media (max-width: 1000px) {
    a img {
      width: 2rem;
      margin-inline: 2.5rem;
    }

    div {
      margin-top: 1rem;
      height: fit-content;
    }

    span {
      position: absolute;
      top: 7rem;
      right: 0;
    }
    .flex {
      flex-direction: column;
    }

    .card {
      font-size: medium;
    }
  }
</style>
