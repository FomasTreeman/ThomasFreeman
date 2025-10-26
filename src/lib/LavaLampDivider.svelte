<script lang="ts">
	export let position: 'top' | 'bottom' = 'top';
	export let color: string = 'rgb(5, 4, 5)';
</script>

<div class="lava-lamp-divider {position}">
	<svg
		class="lava-svg"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 1200 200"
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

			<!-- Enhanced goo filter for blob merging -->
			<filter id="goo-{position}" x="-50%" y="-50%" width="200%" height="200%">
				<feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
				<feColorMatrix
					in="blur"
					mode="matrix"
					values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -10"
					result="goo"
				/>
				<feComposite in="SourceGraphic" in2="goo" operator="atop" />
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

			<!-- Gradients for colorful blobs -->
			<radialGradient id="blob-gradient-1-{position}">
				<stop offset="0%" style="stop-color: rgba(255, 165, 0, 0.9)" />
				<stop offset="50%" style="stop-color: rgba(255, 100, 150, 0.7)" />
				<stop offset="100%" style="stop-color: rgba(255, 165, 0, 0.5)" />
			</radialGradient>

			<radialGradient id="blob-gradient-2-{position}">
				<stop offset="0%" style="stop-color: rgba(100, 150, 255, 0.9)" />
				<stop offset="50%" style="stop-color: rgba(180, 80, 255, 0.7)" />
				<stop offset="100%" style="stop-color: rgba(100, 150, 255, 0.5)" />
			</radialGradient>

			<radialGradient id="blob-gradient-3-{position}">
				<stop offset="0%" style="stop-color: rgba(255, 220, 50, 0.9)" />
				<stop offset="50%" style="stop-color: rgba(255, 165, 0, 0.7)" />
				<stop offset="100%" style="stop-color: rgba(255, 220, 50, 0.5)" />
			</radialGradient>

			<radialGradient id="blob-gradient-4-{position}">
				<stop offset="0%" style="stop-color: rgba(255, 100, 150, 0.9)" />
				<stop offset="50%" style="stop-color: rgba(180, 80, 255, 0.7)" />
				<stop offset="100%" style="stop-color: rgba(255, 100, 150, 0.5)" />
			</radialGradient>
		</defs>

		<!-- Main wave base (solid color) -->
		<path
			class="wave-base"
			d="M0,80 L1200,80 L1200,200 L0,200 Z"
			fill={color}
		/>

		<!-- Organic gooey layer with blobs and waves -->
		<g filter="url(#goo-{position})">
			<!-- Wave surface that blobs emerge from -->
			<ellipse class="wave-blob wave-blob-1" cx="150" cy="85" rx="120" ry="45" fill="url(#blob-gradient-1-{position})" opacity="0.85" />
			<ellipse class="wave-blob wave-blob-2" cx="400" cy="90" rx="100" ry="50" fill="url(#blob-gradient-2-{position})" opacity="0.85" />
			<ellipse class="wave-blob wave-blob-3" cx="650" cy="82" rx="130" ry="48" fill="url(#blob-gradient-3-{position})" opacity="0.85" />
			<ellipse class="wave-blob wave-blob-4" cx="900" cy="88" rx="110" ry="52" fill="url(#blob-gradient-4-{position})" opacity="0.85" />
			<ellipse class="wave-blob wave-blob-5" cx="1100" cy="85" rx="105" ry="46" fill="url(#blob-gradient-1-{position})" opacity="0.85" />

			<!-- Rising organic blobs -->
			<ellipse class="rising-blob blob-1" cx="200" cy="80" rx="35" ry="40" fill="url(#blob-gradient-1-{position})" />
			<ellipse class="rising-blob blob-2" cx="500" cy="80" rx="28" ry="32" fill="url(#blob-gradient-2-{position})" />
			<ellipse class="rising-blob blob-3" cx="750" cy="80" rx="32" ry="38" fill="url(#blob-gradient-3-{position})" />
			<ellipse class="rising-blob blob-4" cx="320" cy="80" rx="30" ry="35" fill="url(#blob-gradient-4-{position})" />
			<ellipse class="rising-blob blob-5" cx="600" cy="80" rx="26" ry="30" fill="url(#blob-gradient-1-{position})" />
			<ellipse class="rising-blob blob-6" cx="850" cy="80" rx="29" ry="34" fill="url(#blob-gradient-2-{position})" />
			<ellipse class="rising-blob blob-7" cx="1000" cy="80" rx="33" ry="37" fill="url(#blob-gradient-3-{position})" />
			<ellipse class="rising-blob blob-8" cx="100" cy="80" rx="27" ry="31" fill="url(#blob-gradient-4-{position})" />
		</g>

		<!-- Organic distortion overlay -->
		<g filter="url(#organic-{position})" opacity="0.6">
			<path
				class="organic-wave"
				d="M0,70 C200,90 400,85 600,75 C800,88 1000,82 1200,78 L1200,200 L0,200 Z"
				fill={color}
				opacity="0.3"
			/>
		</g>
	</svg>
</div>

<style>
	.lava-lamp-divider {
		position: absolute;
		left: 0;
		width: 100%;
		height: 200px;
		overflow: visible;
		pointer-events: none;
		z-index: 2;
	}

	.lava-lamp-divider.top {
		top: 0;
		transform: translateY(-60%);
	}

	.lava-lamp-divider.bottom {
		bottom: 0;
		transform: translateY(60%) rotate(180deg);
	}

	.lava-svg {
		width: 100%;
		height: 100%;
		display: block;
	}

	/* Wave surface blobs that create organic undulating surface */
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

	.blob-5 {
		animation: blob-rise-5 9.5s ease-in-out infinite 2.2s;
	}

	.blob-6 {
		animation: blob-rise-6 8.2s ease-in-out infinite 4s;
	}

	.blob-7 {
		animation: blob-rise-7 7.8s ease-in-out infinite 1.2s;
	}

	.blob-8 {
		animation: blob-rise-8 9.2s ease-in-out infinite 3.5s;
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
			cy: 85;
			rx: 105;
			ry: 46;
		}
		40% {
			cy: 78;
			rx: 115;
			ry: 40;
		}
		75% {
			cy: 90;
			rx: 100;
			ry: 52;
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

	@keyframes blob-rise-5 {
		0% {
			cy: 85;
			rx: 26;
			ry: 30;
			opacity: 0;
		}
		20% {
			cy: 78;
			rx: 30;
			ry: 26;
			opacity: 0.82;
		}
		48% {
			cy: 45;
			rx: 24;
			ry: 33;
			opacity: 0.72;
		}
		76% {
			cy: 12;
			rx: 20;
			ry: 28;
			opacity: 0.32;
		}
		100% {
			cy: -18;
			rx: 16;
			ry: 22;
			opacity: 0;
		}
	}

	@keyframes blob-rise-6 {
		0% {
			cy: 88;
			rx: 29;
			ry: 34;
			opacity: 0;
		}
		14% {
			cy: 82;
			rx: 33;
			ry: 29;
			opacity: 0.86;
		}
		40% {
			cy: 53;
			rx: 27;
			ry: 36;
			opacity: 0.76;
		}
		70% {
			cy: 20;
			rx: 23;
			ry: 31;
			opacity: 0.36;
		}
		100% {
			cy: -10;
			rx: 18;
			ry: 25;
			opacity: 0;
		}
	}

	@keyframes blob-rise-7 {
		0% {
			cy: 85;
			rx: 33;
			ry: 37;
			opacity: 0;
		}
		17% {
			cy: 77;
			rx: 37;
			ry: 33;
			opacity: 0.9;
		}
		44% {
			cy: 47;
			rx: 31;
			ry: 40;
			opacity: 0.8;
		}
		74% {
			cy: 16;
			rx: 27;
			ry: 35;
			opacity: 0.4;
		}
		100% {
			cy: -14;
			rx: 21;
			ry: 28;
			opacity: 0;
		}
	}

	@keyframes blob-rise-8 {
		0% {
			cy: 80;
			rx: 27;
			ry: 31;
			opacity: 0;
		}
		19% {
			cy: 75;
			rx: 31;
			ry: 27;
			opacity: 0.84;
		}
		46% {
			cy: 46;
			rx: 25;
			ry: 34;
			opacity: 0.74;
		}
		73% {
			cy: 14;
			rx: 21;
			ry: 29;
			opacity: 0.34;
		}
		100% {
			cy: -16;
			rx: 17;
			ry: 23;
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
