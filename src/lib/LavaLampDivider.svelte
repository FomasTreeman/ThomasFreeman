<script lang="ts">
	export let position: 'top' | 'bottom' = 'top';

	// Optional vertical offset to fine-tune reveal/overlap
	// - number: pixels (e.g. 12 => 12px)
	// - string: any CSS length/calc (e.g. '1rem', 'calc(10px + 1vh)')
	export let offset: number | string = 0;

	// Optional height of the divider container in px
	export let height: number = 175;

	// Normalize offset to a CSS length string
	$: offsetValue = typeof offset === 'number' ? `${offset}px` : offset;

	// Keep positive values consistent: positive means "push further out"
	// For bottom we invert the sign so semantics match top.
	$: signedOffsetValue = (() => {
		if (typeof offset === 'number') return position === 'top' ? `${offset}px` : `${-offset}px`;
		return position === 'top' ? offset : `calc(-1 * (${offset}))`;
	})();
</script>

<div class="lava-lamp-divider {position}" style="--lava-offset: {signedOffsetValue}; height: {height}px;">
	<svg
		class="lava-svg"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="-100 0 1400 200"
		preserveAspectRatio="none"
	>
		<defs>
			<!-- Turbulence for organic distortion -->
			<filter id="organic-{position}" x="-50%" y="-50%" width="200%" height="200%">
				<feTurbulence
					type="fractalNoise"
					baseFrequency="0.01 0.02"
					numOctaves="3"
					result="turbulence"
					seed="2"
				>
					<animate
						attributeName="baseFrequency"
						values="0.01 0.02; 0.015 0.025; 0.01 0.02"
						dur="20s"
						repeatCount="indefinite"
					/>
				</feTurbulence>
				<feDisplacementMap in="SourceGraphic" in2="turbulence" scale="15" />
			</filter>

			<!-- Enhanced goo filter for blob merging with soft internal shadow -->
			<filter id="goo-{position}" x="-50%" y="-50%" width="200%" height="200%">
				<!-- Create the goo effect with stronger contrast -->
				<feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
				<feColorMatrix
					in="blur"
					mode="matrix"
					values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 35 -12"
					result="goo"
				/>

				<!-- Create soft internal shadow by inverting and blurring the alpha -->
				<!-- <feColorMatrix
					in="goo"
					type="matrix"
					values="0 0 0 0 0
					        0 0 0 0 0
					        0 0 0 0 0
					        0 0 0 -1 1"
					result="inverse-alpha"
				/>
				<feGaussianBlur in="inverse-alpha" stdDeviation="20" result="soft-edge" /> -->

				<!-- Darken it -->
				<!-- <feComponentTransfer in="soft-edge" result="dark-edge">
					<feFuncA type="linear" slope="1.5" />
				</feComponentTransfer> -->

				<!-- Fill with black -->
				<feFlood flood-color="rgba(0, 0, 0, 1)" result="black" />
				<feComposite in="black" in2="dark-edge" operator="in" result="internal-shadow" />

				<!-- Composite it on top of the goo -->
				<feComposite in="internal-shadow" in2="goo" operator="in" result="shadow-clipped" />

				<!-- Layer: colored goo on bottom, soft shadow on top -->
				<feMerge>
					<feMergeNode in="goo" />
					<feMergeNode in="shadow-clipped" />
				</feMerge>
			</filter>

			<!-- Combined filter for organic gooey blobs -->
			<filter id="organic-goo-{position}" x="-50%" y="-50%" width="200%" height="200%">
				<feTurbulence
					type="fractalNoise"
					baseFrequency="0.015 0.02"
					numOctaves="4"
					result="turbulence"
					seed="5"
				>
					<animate
						attributeName="baseFrequency"
						values="0.015 0.02; 0.02 0.03; 0.015 0.02"
						dur="15s"
						repeatCount="indefinite"
					/>
				</feTurbulence>
				<feDisplacementMap in="SourceGraphic" in2="turbulence" scale="25" result="displaced" />
				<feGaussianBlur in="displaced" stdDeviation="10" result="blur" />
				<feColorMatrix
					in="blur"
					mode="matrix"
					values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9"
					result="goo"
				/>
			</filter>

			<!-- Gradients using brand colors - solid -->
			<radialGradient id="blob-gradient-1-{position}">
				<stop offset="0%" style="stop-color: rgba(255, 139, 0, 0.95)" />
				<stop offset="50%" style="stop-color: rgba(249, 220, 0, 0.85)" />
				<stop offset="100%" style="stop-color: rgba(255, 139, 0, 0.7)" />
			</radialGradient>

			<radialGradient id="blob-gradient-2-{position}">
				<stop offset="0%" style="stop-color: rgba(0, 121, 255, 0.95)" />
				<stop offset="50%" style="stop-color: rgba(72, 190, 255, 0.85)" />
				<stop offset="100%" style="stop-color: rgba(0, 121, 255, 0.7)" />
			</radialGradient>

			<radialGradient id="blob-gradient-3-{position}">
				<stop offset="0%" style="stop-color: rgba(249, 220, 0, 0.95)" />
				<stop offset="50%" style="stop-color: rgba(255, 139, 0, 0.85)" />
				<stop offset="100%" style="stop-color: rgba(249, 220, 0, 0.7)" />
			</radialGradient>

			<radialGradient id="blob-gradient-4-{position}">
				<stop offset="0%" style="stop-color: rgba(72, 190, 255, 0.95)" />
				<stop offset="50%" style="stop-color: rgba(0, 121, 255, 0.85)" />
				<stop offset="100%" style="stop-color: rgba(72, 190, 255, 0.7)" />
			</radialGradient>
		</defs>

		<!-- Organic gooey layer with blobs and waves -->
		<g filter="url(#goo-{position})">
			<!-- Edge blobs - extend off screen -->
			<ellipse class="wave-blob wave-blob-edge-1" cx="-50" cy="87" rx="120" ry="55" fill="url(#blob-gradient-1-{position})" opacity="0.6" />
			<ellipse class="wave-blob wave-blob-edge-2" cx="1250" cy="85" rx="115" ry="52" fill="url(#blob-gradient-3-{position})" opacity="0.6" />

			<!-- Main wave surface - more bubbly with overlapping blobs -->
			<ellipse class="wave-blob wave-blob-1" cx="120" cy="85" rx="110" ry="50" fill="url(#blob-gradient-1-{position})" opacity="0.6" />
			<ellipse class="wave-blob wave-blob-2" cx="280" cy="88" rx="95" ry="48" fill="url(#blob-gradient-2-{position})" opacity="0.6" />
			<ellipse class="wave-blob wave-blob-3" cx="440" cy="82" rx="105" ry="52" fill="url(#blob-gradient-3-{position})" opacity="0.6" />
			<ellipse class="wave-blob wave-blob-4" cx="600" cy="87" rx="120" ry="48" fill="url(#blob-gradient-4-{position})" opacity="0.6" />
			<ellipse class="wave-blob wave-blob-5" cx="760" cy="84" rx="100" ry="50" fill="url(#blob-gradient-1-{position})" opacity="0.6" />
			<ellipse class="wave-blob wave-blob-6" cx="920" cy="89" rx="110" ry="47" fill="url(#blob-gradient-2-{position})" opacity="0.6" />
			<ellipse class="wave-blob wave-blob-7" cx="1080" cy="86" rx="105" ry="51" fill="url(#blob-gradient-3-{position})" opacity="0.6" />

			<!-- Secondary bubbly layer for more texture -->
			<ellipse class="wave-blob-small small-1" cx="60" cy="90" rx="60" ry="35" fill="url(#blob-gradient-4-{position})" opacity="0.5" />
			<ellipse class="wave-blob-small small-2" cx="200" cy="92" rx="55" ry="32" fill="url(#blob-gradient-1-{position})" opacity="0.5" />
			<ellipse class="wave-blob-small small-3" cx="360" cy="88" rx="62" ry="38" fill="url(#blob-gradient-2-{position})" opacity="0.5" />
			<ellipse class="wave-blob-small small-4" cx="520" cy="91" rx="58" ry="34" fill="url(#blob-gradient-3-{position})" opacity="0.5" />
			<ellipse class="wave-blob-small small-5" cx="680" cy="87" rx="60" ry="36" fill="url(#blob-gradient-4-{position})" opacity="0.5" />
			<ellipse class="wave-blob-small small-6" cx="840" cy="93" rx="56" ry="33" fill="url(#blob-gradient-1-{position})" opacity="0.5" />
			<ellipse class="wave-blob-small small-7" cx="1000" cy="89" rx="61" ry="37" fill="url(#blob-gradient-2-{position})" opacity="0.5" />
			<ellipse class="wave-blob-small small-8" cx="1140" cy="91" rx="57" ry="35" fill="url(#blob-gradient-3-{position})" opacity="0.5" />

			<!-- Rising organic blobs that just rise -->
			<ellipse class="rising-blob blob-1" cx="200" cy="80" rx="35" ry="40" fill="url(#blob-gradient-1-{position})" />
			<ellipse class="rising-blob blob-2" cx="500" cy="80" rx="28" ry="32" fill="url(#blob-gradient-2-{position})" />
			<ellipse class="rising-blob blob-3" cx="750" cy="80" rx="32" ry="38" fill="url(#blob-gradient-3-{position})" />
			<ellipse class="rising-blob blob-4" cx="320" cy="80" rx="30" ry="35" fill="url(#blob-gradient-4-{position})" />

			<!-- Floating blobs that rise, float, and fall back -->
			<ellipse class="floating-blob float-blob-1" cx="600" cy="80" rx="26" ry="30" fill="url(#blob-gradient-1-{position})" />
			<ellipse class="floating-blob float-blob-2" cx="850" cy="80" rx="29" ry="34" fill="url(#blob-gradient-2-{position})" />
			<ellipse class="floating-blob float-blob-3" cx="1000" cy="80" rx="33" ry="37" fill="url(#blob-gradient-3-{position})" />
			<ellipse class="floating-blob float-blob-4" cx="100" cy="80" rx="27" ry="31" fill="url(#blob-gradient-4-{position})" />
		</g>

		<!-- Aggressive but smooth gradient overlay to fade into black background -->
		<!-- <defs>
			<linearGradient id="fade-to-black-{position}" x1="0%" y1="0%" x2="0%" y2="100%">
				<stop offset="0%" style="stop-color: rgba(0, 0, 0, 0); stop-opacity: 1" />
				<stop offset="45%" style="stop-color: rgba(0, 0, 0, 0); stop-opacity: 1" />
				<stop offset="60%" style="stop-color: rgba(0, 0, 0, 0.35); stop-opacity: 1" />
				<stop offset="80%" style="stop-color: rgba(0, 0, 0, 0.98); stop-opacity: 1" />
				<stop offset="100%" style="stop-color: rgba(0, 0, 0, 1); stop-opacity: 1" />
			</linearGradient>
		</defs>
		<rect x="-100" y="0" width="1400" height="200" fill="url(#fade-to-black-{position})" /> -->
	</svg>
</div>

<style>
	.lava-lamp-divider {
		position: absolute;
		left: 0;
		width: 100%;
		height: 200px; /* default; overridden by inline style from prop */
		overflow: hidden;
		pointer-events: none;
		z-index: -1;
	}

	.lava-lamp-divider svg {
		overflow: visible;
		/* Base alignment then fine-tune with --lava-offset */
		transform: translateY(calc(50% + var(--lava-offset, 0px)));
	}

	.lava-lamp-divider.top {
		top: -4rem;
		transform: translateY(-50%);
	}

	.lava-lamp-divider.bottom {
		bottom: -4rem;
		transform: translateY(50%) rotate(180deg);
	}

	.lava-svg {
		width: 100%;
		height: 100%;
		display: block;
	}

	/* Wave surface blobs that create organic undulating surface */
	.wave-blob-edge-1 {
		animation: wave-blob-morph-1 13s ease-in-out infinite 3s;
	}

	.wave-blob-edge-2 {
		animation: wave-blob-morph-2 12s ease-in-out infinite 2.5s;
	}

	.wave-blob-1 {
		animation: wave-blob-morph-1 12s ease-in-out infinite;
	}

	.wave-blob-2 {
		animation: wave-blob-morph-2 10s ease-in-out infinite 1s;
	}

	.wave-blob-3 {
		animation: wave-blob-morph-3 14s ease-in-out infinite 2s;
	}

	.wave-blob-4 {
		animation: wave-blob-morph-4 11s ease-in-out infinite 1.5s;
	}

	.wave-blob-5 {
		animation: wave-blob-morph-5 13s ease-in-out infinite 0.5s;
	}

	.wave-blob-6 {
		animation: wave-blob-morph-6 11.5s ease-in-out infinite 2.5s;
	}

	.wave-blob-7 {
		animation: wave-blob-morph-7 12.5s ease-in-out infinite 1.8s;
	}

	/* Smaller bubbly blobs for extra texture */
	.wave-blob-small {
		animation: wave-blob-small-morph 8s ease-in-out infinite;
	}

	.small-1 {
		animation: wave-blob-small-morph 8s ease-in-out infinite 0s;
	}

	.small-2 {
		animation: wave-blob-small-morph 7.5s ease-in-out infinite 0.5s;
	}

	.small-3 {
		animation: wave-blob-small-morph 8.5s ease-in-out infinite 1s;
	}

	.small-4 {
		animation: wave-blob-small-morph 7.8s ease-in-out infinite 1.5s;
	}

	.small-5 {
		animation: wave-blob-small-morph 8.2s ease-in-out infinite 2s;
	}

	.small-6 {
		animation: wave-blob-small-morph 7.7s ease-in-out infinite 2.5s;
	}

	.small-7 {
		animation: wave-blob-small-morph 8.3s ease-in-out infinite 3s;
	}

	.small-8 {
		animation: wave-blob-small-morph 7.9s ease-in-out infinite 3.5s;
	}

	/* Rising blobs that emerge and separate from the wave */
	.rising-blob {
		opacity: 0;
		mix-blend-mode: screen;
	}

	.blob-1 {
		animation: blob-rise-1 8s ease-in-out infinite;
	}

	.blob-2 {
		animation: blob-rise-2 9s ease-in-out infinite 1.5s;
	}

	.blob-3 {
		animation: blob-rise-3 7.5s ease-in-out infinite 3s;
	}

	.blob-4 {
		animation: blob-rise-4 8.5s ease-in-out infinite 0.8s;
	}

	/* Floating blobs that rise, float, and fall back */
	.floating-blob {
		opacity: 0;
		mix-blend-mode: screen;
	}

	.float-blob-1 {
		animation: blob-float-1 16s ease-in-out infinite;
	}

	.float-blob-2 {
		animation: blob-float-2 18s ease-in-out infinite 4s;
	}

	.float-blob-3 {
		animation: blob-float-3 17s ease-in-out infinite 8s;
	}

	.float-blob-4 {
		animation: blob-float-4 19s ease-in-out infinite 2s;
	}

	/* Organic wave surface morphing animations */
	@keyframes wave-blob-morph-1 {
		0%,
		100% {
			cy: 85;
			rx: 120;
			ry: 45;
		}
		25% {
			cy: 78;
			rx: 135;
			ry: 38;
		}
		50% {
			cy: 92;
			rx: 110;
			ry: 52;
		}
		75% {
			cy: 80;
			rx: 125;
			ry: 42;
		}
	}

	@keyframes wave-blob-morph-2 {
		0%,
		100% {
			cy: 90;
			rx: 100;
			ry: 50;
		}
		30% {
			cy: 82;
			rx: 115;
			ry: 42;
		}
		60% {
			cy: 95;
			rx: 95;
			ry: 55;
		}
	}

	@keyframes wave-blob-morph-3 {
		0%,
		100% {
			cy: 82;
			rx: 130;
			ry: 48;
		}
		20% {
			cy: 88;
			rx: 120;
			ry: 55;
		}
		50% {
			cy: 76;
			rx: 140;
			ry: 40;
		}
		80% {
			cy: 85;
			rx: 125;
			ry: 50;
		}
	}

	@keyframes wave-blob-morph-4 {
		0%,
		100% {
			cy: 88;
			rx: 110;
			ry: 52;
		}
		35% {
			cy: 80;
			rx: 120;
			ry: 45;
		}
		70% {
			cy: 93;
			rx: 105;
			ry: 58;
		}
	}

	@keyframes wave-blob-morph-5 {
		0%,
		100% {
			cy: 84;
			rx: 100;
			ry: 50;
		}
		40% {
			cy: 78;
			rx: 110;
			ry: 45;
		}
		75% {
			cy: 88;
			rx: 95;
			ry: 54;
		}
	}

	@keyframes wave-blob-morph-6 {
		0%,
		100% {
			cy: 89;
			rx: 110;
			ry: 47;
		}
		33% {
			cy: 82;
			rx: 120;
			ry: 42;
		}
		66% {
			cy: 94;
			rx: 105;
			ry: 52;
		}
	}

	@keyframes wave-blob-morph-7 {
		0%,
		100% {
			cy: 86;
			rx: 105;
			ry: 51;
		}
		38% {
			cy: 79;
			rx: 115;
			ry: 46;
		}
		72% {
			cy: 91;
			rx: 100;
			ry: 56;
		}
	}

	@keyframes wave-blob-small-morph {
		0%,
		100% {
			cy: 90;
			rx: 60;
			ry: 35;
		}
		25% {
			cy: 85;
			rx: 65;
			ry: 30;
		}
		50% {
			cy: 95;
			rx: 55;
			ry: 40;
		}
		75% {
			cy: 88;
			rx: 62;
			ry: 33;
		}
	}

	/* Blobs emerging and rising from the wave surface */
	@keyframes blob-rise-1 {
		0% {
			cy: 85;
			rx: 35;
			ry: 40;
			opacity: 0;
		}
		15% {
			cy: 80;
			rx: 38;
			ry: 35;
			opacity: 0.9;
		}
		40% {
			cy: 50;
			rx: 32;
			ry: 42;
			opacity: 0.8;
		}
		70% {
			cy: 20;
			rx: 28;
			ry: 38;
			opacity: 0.4;
		}
		100% {
			cy: -10;
			rx: 22;
			ry: 30;
			opacity: 0;
		}
	}

	@keyframes blob-rise-2 {
		0% {
			cy: 90;
			rx: 28;
			ry: 32;
			opacity: 0;
		}
		18% {
			cy: 82;
			rx: 32;
			ry: 28;
			opacity: 0.85;
		}
		45% {
			cy: 48;
			rx: 26;
			ry: 35;
			opacity: 0.75;
		}
		75% {
			cy: 15;
			rx: 22;
			ry: 30;
			opacity: 0.3;
		}
		100% {
			cy: -15;
			rx: 18;
			ry: 25;
			opacity: 0;
		}
	}

	@keyframes blob-rise-3 {
		0% {
			cy: 82;
			rx: 32;
			ry: 38;
			opacity: 0;
		}
		12% {
			cy: 78;
			rx: 36;
			ry: 32;
			opacity: 0.92;
		}
		38% {
			cy: 52;
			rx: 30;
			ry: 40;
			opacity: 0.82;
		}
		68% {
			cy: 22;
			rx: 26;
			ry: 36;
			opacity: 0.42;
		}
		100% {
			cy: -8;
			rx: 20;
			ry: 28;
			opacity: 0;
		}
	}

	@keyframes blob-rise-4 {
		0% {
			cy: 88;
			rx: 30;
			ry: 35;
			opacity: 0;
		}
		16% {
			cy: 80;
			rx: 34;
			ry: 30;
			opacity: 0.88;
		}
		42% {
			cy: 50;
			rx: 28;
			ry: 38;
			opacity: 0.78;
		}
		72% {
			cy: 18;
			rx: 24;
			ry: 32;
			opacity: 0.38;
		}
		100% {
			cy: -12;
			rx: 19;
			ry: 26;
			opacity: 0;
		}
	}

	/* Floating blobs - rise, float, fall back, merge */
	@keyframes blob-float-1 {
		0% {
			cy: 85;
			rx: 26;
			ry: 30;
			opacity: 0;
		}
		8% {
			cy: 78;
			rx: 30;
			ry: 26;
			opacity: 0.9;
		}
		20% {
			cy: 40;
			rx: 28;
			ry: 32;
			opacity: 0.85;
		}
		35% {
			cy: 10;
			rx: 32;
			ry: 28;
			opacity: 0.9;
		}
		/* Float at top */
		45% {
			cy: 5;
			rx: 30;
			ry: 34;
			opacity: 0.88;
		}
		55% {
			cy: 8;
			rx: 34;
			ry: 30;
			opacity: 0.85;
		}
		/* Start falling */
		70% {
			cy: 45;
			rx: 28;
			ry: 32;
			opacity: 0.8;
		}
		85% {
			cy: 80;
			rx: 30;
			ry: 28;
			opacity: 0.6;
		}
		/* Merge back */
		92% {
			cy: 85;
			rx: 26;
			ry: 30;
			opacity: 0.3;
		}
		100% {
			cy: 85;
			rx: 26;
			ry: 30;
			opacity: 0;
		}
	}

	@keyframes blob-float-2 {
		0% {
			cy: 88;
			rx: 29;
			ry: 34;
			opacity: 0;
		}
		10% {
			cy: 80;
			rx: 33;
			ry: 29;
			opacity: 0.88;
		}
		22% {
			cy: 38;
			rx: 31;
			ry: 36;
			opacity: 0.82;
		}
		38% {
			cy: 8;
			rx: 35;
			ry: 31;
			opacity: 0.92;
		}
		/* Float */
		48% {
			cy: 3;
			rx: 33;
			ry: 37;
			opacity: 0.9;
		}
		58% {
			cy: 6;
			rx: 37;
			ry: 33;
			opacity: 0.88;
		}
		/* Fall */
		72% {
			cy: 42;
			rx: 31;
			ry: 35;
			opacity: 0.78;
		}
		88% {
			cy: 82;
			rx: 33;
			ry: 30;
			opacity: 0.5;
		}
		95% {
			cy: 88;
			rx: 29;
			ry: 34;
			opacity: 0.2;
		}
		100% {
			cy: 88;
			rx: 29;
			ry: 34;
			opacity: 0;
		}
	}

	@keyframes blob-float-3 {
		0% {
			cy: 82;
			rx: 33;
			ry: 37;
			opacity: 0;
		}
		9% {
			cy: 75;
			rx: 37;
			ry: 33;
			opacity: 0.9;
		}
		24% {
			cy: 35;
			rx: 34;
			ry: 38;
			opacity: 0.85;
		}
		40% {
			cy: 6;
			rx: 38;
			ry: 34;
			opacity: 0.93;
		}
		/* Float */
		50% {
			cy: 2;
			rx: 36;
			ry: 40;
			opacity: 0.92;
		}
		60% {
			cy: 5;
			rx: 40;
			ry: 36;
			opacity: 0.9;
		}
		/* Fall */
		75% {
			cy: 40;
			rx: 34;
			ry: 37;
			opacity: 0.8;
		}
		90% {
			cy: 78;
			rx: 37;
			ry: 34;
			opacity: 0.55;
		}
		96% {
			cy: 82;
			rx: 33;
			ry: 37;
			opacity: 0.25;
		}
		100% {
			cy: 82;
			rx: 33;
			ry: 37;
			opacity: 0;
		}
	}

	@keyframes blob-float-4 {
		0% {
			cy: 80;
			rx: 27;
			ry: 31;
			opacity: 0;
		}
		11% {
			cy: 72;
			rx: 31;
			ry: 27;
			opacity: 0.86;
		}
		26% {
			cy: 32;
			rx: 29;
			ry: 33;
			opacity: 0.8;
		}
		42% {
			cy: 4;
			rx: 33;
			ry: 29;
			opacity: 0.91;
		}
		/* Float */
		52% {
			cy: 1;
			rx: 31;
			ry: 35;
			opacity: 0.9;
		}
		62% {
			cy: 3;
			rx: 35;
			ry: 31;
			opacity: 0.87;
		}
		/* Fall */
		77% {
			cy: 38;
			rx: 29;
			ry: 32;
			opacity: 0.76;
		}
		92% {
			cy: 75;
			rx: 31;
			ry: 28;
			opacity: 0.48;
		}
		97% {
			cy: 80;
			rx: 27;
			ry: 31;
			opacity: 0.2;
		}
		100% {
			cy: 80;
			rx: 27;
			ry: 31;
			opacity: 0;
		}
	}

	@media (max-width: 768px) {
		.lava-lamp-divider {
			height: 120px;
		}

		.lava-lamp-divider.top {
			transform: translateY(-50%);
		}

		.lava-lamp-divider.bottom {
			transform: translateY(50%) rotate(180deg);
		}
	}
</style>
