<script lang="ts">
    import { onMount } from 'svelte';
    
    export let onSectionChange: (index: number) => void;
    export let pauseIO: boolean;
    let observer: IntersectionObserver;

    function handleIntersection(entries: IntersectionObserverEntry[]) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                const itemIndex = ['home', 'about', 'projects'].findIndex((item) => item === id);
                if (itemIndex !== -1 && !pauseIO) {
                    onSectionChange(itemIndex);
                }
            }
        });
    }

    function initializeObserver() {
        if (observer) {
            observer.disconnect();
        }

        observer = new IntersectionObserver(handleIntersection, {
            root: null,
            rootMargin: '-20% 0px -20% 0px',
            threshold: [0.1, 0.5]
        });

        document.querySelectorAll('section[id]').forEach((section) => {
            observer.observe(section);
        });
    }

    onMount(() => {
        initializeObserver();
        return () => {
            if (observer) {
                observer.disconnect();
            }
        };
    });
</script>
