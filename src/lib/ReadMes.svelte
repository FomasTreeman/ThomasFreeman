<script>
  import showdown from 'showdown';
  import { onMount } from 'svelte';
  import { Base64 } from '../../node_modules/js-base64';
  import scrollIntoView from './utils/scroll';
  import ReadMeTitle from './ReadMeTitle.svelte';
  import Saos from 'saos';

  let promise = getHtml();
  let repos = [];

  const productions = {
    Comms: 'https://comm-a.vercel.app/',
    'Weather-TM': 'https://fac27.github.io/Weather-TM/',
  };

  const pinned = [
    'Rich_System_Site',
    'home-page',
    'Comms',
    'KodiTV',
    // 'Weather-TM',
  ];

  async function getHtml() {
    return new showdown.Converter();
  }

  function renderHtml(html) {
    return html.slice(0, 1000);
  }

  function handleObserver(x) {
    console.info(x.detail.observing);
  }

  onMount(async () => {
    const tempRepos = [];
    const resp = await fetch(
      `https://api.github.com/users/FomasTreeman/repos?per_page=100&sort=updated`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: import.meta.env.TOKEN,
        },
      }
    );
    const jsonResp = await resp.json();
    const repoNames = jsonResp.map((repo) => repo.full_name.split('/')[1]);
    const pinnedRepos = repoNames.filter((name) => pinned.includes(name));
    await Promise.all(
      pinnedRepos.map(async (repoName) => {
        const resp = await fetch(
          `https://api.github.com/repos/FomasTreeman/${repoName}/readme`
        );
        const json = await resp.json();
        tempRepos.push({
          md: Base64.decode(json.content),
          name: repoName,
          url: `https://github.com/FomasTreeman/${repoName}`,
        });
      })
    );
    repos = tempRepos;
  });
</script>

<section class="article-layout pin-board">
  <ol class="project-list">
    {#each pinned as repo}
      <li>
        <a href={`#${repo}`} on:click|preventDefault={scrollIntoView}>{repo}</a>
      </li>
    {/each}
  </ol>
</section>
<!-- .md file -->
{#each repos as repo}
  <!-- <div class={index % 2 == 0 ? "flip" : ""}> -->
  <Saos
    animation={'slide-in-bottom 1s cubic-bezier(0.35, 0.5, 0.65, 0.95) both'}
  >
    <div id={repo.name} class="article-layout">
      <!-- <img src="{repo.name}.png" alt="project scrnsht" /> -->
      <article id="md" class="article">
        {#await promise}
          <h1>... waiting</h1>
        {:then converter}
          <header>
            {#if productions[repo.name]}
              <a href={productions[repo.name]} class="prod-link">
                <ReadMeTitle {repo} />
              </a>
            {:else}
              <ReadMeTitle {repo} />
            {/if}
          </header>
          {@html renderHtml(converter.makeHtml(repo.md))}
          <button>...</button>
        {:catch}
          <h1>page in development</h1>
        {/await}
      </article>
    </div>
  </Saos>
{/each}
<Saos on:update={handleObserver}>...</Saos>

<style>
  .article {
    background-color: black;
    mix-blend-mode: luminosity;
    max-width: 76%;
    padding: 3rem;
    box-shadow: 10px 10px 10px rgba(59, 52, 21, 0.375);
  }

  .article-layout {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 5rem;
    gap: 1rem;
  }

  /* .pin-board {
  } */

  .project-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 2rem;
    padding: 0px;
    margin-top: 1rem;
  }

  .project-list > * {
    list-style: none;
    background-color: white;
    border-radius: 5px;
    padding: 1rem;
    -webkit-box-shadow: rgb(255, 128, 128) 5px 5px 15px 5px,
      rgb(255, 228, 136) -9px 5px 15px 5px,
      rgb(140, 255, 133) -7px -5px 15px 5px,
      rgb(128, 199, 255) 12px -5px 15px 5px,
      rgb(228, 136, 255) 12px 10px 15px 7px,
      rgb(255, 97, 107) -10px 10px 15px 7px,
      rgb(142, 92, 255) -10px -7px 27px 1px, 5px 5px 15px 5px rgba(0, 0, 0, 0);
    box-shadow: rgb(255, 128, 128) 5px 5px 15px 5px,
      rgb(255, 228, 136) -9px 5px 15px 5px,
      rgb(140, 255, 133) -7px -5px 15px 5px,
      rgb(128, 199, 255) 12px -5px 15px 5px,
      rgb(228, 136, 255) 12px 10px 15px 7px,
      rgb(255, 97, 107) -10px 10px 15px 7px,
      rgb(142, 92, 255) -10px -7px 27px 1px, 5px 5px 15px 5px rgba(0, 0, 0, 0);
  }

  a {
    z-index: 20;
  }

  a.prod-link {
    font-weight: 800;
    font-size: 3rem;
    color: greenyellow;
    text-decoration-line: underline;
  }

  a.prod-link:hover {
    mix-blend-mode: lighten;
  }

  @-webkit-keyframes -global-slide-in-bottom {
    0% {
      -webkit-transform: translateY(1000px);
      transform: translateY(1000px);
      opacity: 0;
    }
    100% {
      -webkit-transform: translateY(0);
      transform: translateY(0);
      opacity: 1;
    }
  }
  @keyframes -global-slide-in-bottom {
    0% {
      -webkit-transform: translateY(1000px);
      transform: translateY(1000px);
      opacity: 0;
    }
    100% {
      -webkit-transform: translateY(0);
      transform: translateY(0);
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    article {
      max-width: 100%;
      padding: 2rem;
      /* temporary solution for image */
      overflow-x: hidden;
    }
    div {
      margin: 0%;
      margin-top: 4rem;
    }

    .project-list {
      margin-inline: 2rem;
    }

    .article-layout {
      margin: 0rem;
      margin-bottom: 4rem;
    }
  }
</style>
