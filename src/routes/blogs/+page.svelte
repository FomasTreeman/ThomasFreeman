<script>
  let blogs = [
    {
      title: 'BTC as money',
      description: 'Coming soon',
      date: 'TBC',
      image: 'https://images.unsplash.com/photo-1640161704729-cbe966a08476?ixid=M3w1NTAxOTV8MHwxfHNlYXJjaHwzfHxiaXRjb2lufGVufDB8fHx8MTczNzMyMDQwMXww&ixlib=rb-4.0.3',
    },
  ];
</script>

<div class="blog-list">
  {#each blogs as blog}
    <a href={`/blogs/${blog.title.toLowerCase().replace(/ /g, '_')}`} class="blog-card">
      <div class="fade-overlay"></div>
      <div class="blog-content">
        <h2 class="blog-title">{blog.title}</h2>
        <p class="blog-date">Published on {blog.date}</p>
        <p class="blog-description">{blog.description}</p>
      </div>
      <img src={blog.image} alt="{blog.title} image" />
    </a>
  {/each}
</div>

<style>
  .blog-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 20px;
    margin-inline: var(--margin-left);
    margin-top: 6.5rem;
  }
  .blog-card {
    display: flex;
    flex-direction: row;
    background: #000;
    border-radius: 1rem;
    max-height: 250px;
    overflow: hidden;
    position: relative;
    color: white;
    text-decoration: none;
    transition: transform 0.2s;
  }
  .blog-card:hover {
    transform: scale(1.05);
  }
  .blog-card img {
    width: 50%;
    height: auto;
    object-fit: cover;
    opacity: 1;
  }
  .blog-content {
    width: 50%;
    padding: 20px;
    padding-left: 2.25rem;
  }
  .fade-overlay {
    position: absolute;
    top: 0;
    left: 50%;
    width: 50%;
    height: 100%;
    background: linear-gradient(to right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
    z-index: 1;
  }
  .blog-title {
    font-size: 1.5em;
    font-weight: bold;
    color: white;
  }
  .blog-date {
    font-size: 0.9em;
    color: #ccc;
  }
  .blog-description {
    margin-top: 10px;
  }
</style>
