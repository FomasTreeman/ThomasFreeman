import type { IPinnedData } from '$lib/types.js';

const PINNED: { [key: string]: Partial<IPinnedData> } = {
    'Comms': {
        production: 'https://comm-a.vercel.app/',
        imageExt: '.png',
        description: 'My quick rough messaging app for testing new frameworks'
    },
    'Rich_System_Site': {
        imageExt: '.png',
        description: 'A betting bot dashboard'
    },
    'KodiTV': {
        imageExt: '.webp',
        description: 'My kodi auto-play plugin'
    },
    'home-page': {
        imageExt: '.png',
        description: 'My responsive home page for chrome'
    },

};

export default PINNED;