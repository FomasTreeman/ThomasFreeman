import type { IPinnedData } from '$lib/types.js';

const PINNED: { [key: string]: IPinnedData } = {
    'Comms': {
        production: 'https://comm-a.vercel.app/',
        imageExt: '.webp',
        summary: 'My quick rough messaging app for testing new frameworks',
        stack: ['react', 'supabase'],
        description: 'A messaging app using react, (version 2) the current feature in development is introducing Supabases DB and login/auth tools. where originally there wasnt session management'

    },
    'Rich_System_Site': {
        imageExt: '.webp',
        summary: 'A betting bot dashboard',
        stack: ['Node.js', 'Docker', 'Cypress', 'PM2', 'Svelte', 'shell'],
        description: 'I assisted clients in automating their betting system by utilising web scraping techniques and placing necessary bets accordingly. In the initial version, I used a docker container with Cypress, but it became increasingly complicated and heavy due to the need for headless video buffers to run the test in a browser. In the second revision, I simply made a request for the HTML with a valid cookie that I refreshed on each request to avoid conflicts. Additionally, I developed a user-friendly interface that allows clients to view their open, closed, and live bets for the day, as well as all historical data, represented in various graphs with customisable filters. To ensure secure operation, I implemented a minimal login feature that allows me to change settings and preset configurations for the bot, such as turning it on/off or increasing the maximum stake.'
    },
    'KodiTV': {
        imageExt: '.webp',
        summary: 'My kodi auto-play plugin',
        stack: ['python'],
        description: 'A Kodi plug-in. A program that automatically recorded TV show episodes you were watching to create a queue for things to watch next. Also using Alexa skills to stop, start and skip.'

    },
    'home-page': {
        imageExt: '.webp',
        summary: 'My responsive home page for chrome',
        stack: ['Svelte-Kit'],
        description: 'A new Chrome extension for power users. Faster access to your GitHub repos. Integrating my progress tracker, with a shortcut for the projects status Customise and save notes with the sticky note feature and fun widgets like BTC and ETH prices, an age widget, and a clock.Currently building a Rust LLM chatbot to replace my current phind.com hotline.'
    },
    'boids': {
        imageExt: '.webp',
        summary: "My BOID's simulation",
        stack: ['python'],
        description: 'This is a simulation to replicate the behaviour of flocks of birds. It follows three rules; separation, alignment, cohesion. Separation - each bird attempts to maintain even spacing among its neighbouring birds. Alignment - each bird tries to gradually follow the same vector as neighbouring birds. Cohesion - each bird ties to move towards the average position of other neighbouring birds (countering separation to create an average position).',
    }

};

export default PINNED;