<script lang="ts">
    export let icon: string;
    export let title: string;
    export let color: string = '#818cf8';
    
    let card: HTMLElement;
    let content: HTMLElement;
    let mouseX = 50;
    let mouseY = 50;
  
    function handleMouseMove(event: MouseEvent) {
      if (!card) return;
      const rect = card.getBoundingClientRect();
      mouseX = ((event.clientX - rect.left) / rect.width) * 100;
      mouseY = ((event.clientY - rect.top) / rect.height) * 100;
      
      const rotateY = ((mouseX - 50) * 20) / 50;
      const rotateX = (((50 - mouseY) * 20) / 50);
      
      content.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
  
    function handleMouseLeave() {
      if (!content) return;
      content.style.transform = 'rotateX(0deg) rotateY(0deg)';
    }
  </script>
  
  <li 
    class="hobby-card"
    bind:this={card}
    on:mousemove={handleMouseMove}
    on:mouseleave={handleMouseLeave}
  >
    <div class="hobby-content" bind:this={content}>
      <div class="hobby-icon-wrapper">
        <div class="hobby-icon">{icon}</div>
        <div class="icon-ring" style="--hobby-color: {color}"></div>
        <div class="icon-particles">
          {#each Array(6) as _, i}
            <div 
              class="particle" 
              style="--angle: {i * 60}deg; --delay: {i * 0.1}s; --color: {color}"
            ></div>
          {/each}
        </div>
      </div>
      <h4>{title}</h4>
      <div class="hobby-glow" style="--hobby-color: {color}"></div>
      <div class="bubbles">
        {#each Array(6) as _, i}
          <div class="bubble" style="--delay: {i * 1.5}s; --size: {Math.random() * 2 + 1}rem"></div>
        {/each}
      </div>
    </div>
  </li>
  
  <style>
    .hobby-card {
      position: relative;
      height: 180px;
      perspective: 1000px;
    }
  
    .hobby-content {
      position: relative;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      backdrop-filter: blur(12px);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      transition: transform 0.1s ease;
      transform-style: preserve-3d;
    }
  
    .hobby-icon-wrapper {
      position: relative;
      width: 64px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      transform-style: preserve-3d;
    }
  
    .hobby-icon {
      font-size: 3rem;
      filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
      transform: translateZ(40px);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      z-index: 2;
    }
  
    .hobby-card:hover .hobby-icon {
      transform: translateZ(60px) scale(1.2);
      filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.5));
    }
  
    .icon-ring {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      transform: translateZ(20px) scale(0.8);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      opacity: 0;
    }
  
    .hobby-card:hover .icon-ring {
      border-color: var(--hobby-color);
      transform: translateZ(20px) scale(1.4);
      opacity: 0.5;
    }
  
    .icon-particles {
      position: absolute;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
    }
  
    .particle {
      position: absolute;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background-color: var(--color);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(var(--angle)) translateX(20px) translateZ(30px) scale(0);
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      transition-delay: var(--delay);
    }
  
    .hobby-card:hover .particle {
      opacity: 0.8;
      transform: translate(-50%, -50%) rotate(var(--angle)) translateX(40px) translateZ(30px) scale(1);
    }
  
    h4 {
      margin: 0.5rem 0 0 0;
      font-size: 1.1rem;
      color: var(--text);
      transform: translateZ(30px);
    }
  
    .hobby-glow {
      position: absolute;
      width: 200%;
      height: 200%;
      background: radial-gradient(
        circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
        var(--hobby-color) 0%,
        transparent 50%
      );
      opacity: 0;
      transform: translate(-25%, -25%);
      transition: opacity 0.3s ease;
      mix-blend-mode: overlay;
      pointer-events: none;
    }
  
    .hobby-card:hover .hobby-glow {
      opacity: 0.15;
    }
  
    .bubbles {
      position: absolute;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
  
    .bubble {
      position: absolute;
      background: radial-gradient(
        circle at center,
        var(--hobby-color) 0%,
        transparent 70%
      );
      border-radius: 50%;
      width: var(--size);
      height: var(--size);
      opacity: 0;
      animation: bubble 8s ease-in infinite;
      animation-delay: var(--delay);
      left: calc(random() * 100%);
      transform: translateZ(20px);
    }
  
    @keyframes bubble {
      0% {
        bottom: -20%;
        opacity: 0;
        transform: translateX(0) translateZ(20px) scale(0.5);
      }
      50% {
        opacity: 0.15;
        transform: translateX(calc(sin(var(--delay)) * 40px)) translateZ(20px) scale(1);
      }
      100% {
        bottom: 120%;
        opacity: 0;
        transform: translateX(0) translateZ(20px) scale(0.5);
      }
    }
  
    @media (max-width: 480px) {
      .hobby-card {
        height: 150px;
      }
    }
  </style>