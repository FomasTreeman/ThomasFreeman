<video autoplay loop muted>
  <source src="hello-there.webm" type="video/mp4" />
</video>
<h1>Hi, I'm Thomas Freeman</h1>
<b>🖖</b>
<p>
  As a software developer, I relish the opportunity to create groundbreaking
  technologies that solve complex problems and improve people's lives. I am
  fascinated by the constantly evolving tech industry and thrive in fast-paced
  environments that challenges me to learn and apply new technologies. I look
  forward to sharing my unique perspective and learning from others as I embark
  on a successful and rewarding career in software development. <a href="/fac">
    🎊 Click the 🌍 for extras. Visit my FAC portfolio briefly too 📛
  </a>
</p>

<!-- <DarkMode bind:dark /> -->
<style>
  * {
    display: block;
    text-align: center;
    margin-inline: auto;
  }

  h1 {
    font-size: xxx-large;
    /* mix-blend-mode: difference; */
    z-index: 1;
    max-width: 50%;
    margin-block: 0px;
    padding-top: 2rem;
  }

  b {
    width: 4rem;
    font-size: xxx-large;
  }

  p {
    max-width: 75%;
    mix-blend-mode: luminosity;
    font-weight: 500;
    font-size: large;
    border-radius: 1rem;
    padding: 2rem;
    background-color: red;
  }

  a {
    color: rgb(0, 44, 163);
    opacity: 0.8;
  }
  a:hover {
    color: black;
  }

  video {
    height: 15rem;
    width: 15rem;
    object-fit: cover;
    border-radius: 50%;
    z-index: 5;
  }

  @media (max-width: 768px) {
    video {
      width: 10rem;
      height: 10rem;
    }

    h1 {
      font-size: x-large;
    }

    p {
      font-size: small;
    }
  }
</style>
