<!-- EFFECT: Multiple reveal transforms showcasing different animation styles -->
<section data-scroll-section style="padding: 10rem 0;">
	<div style="max-width: 64rem; margin: 0 auto; padding-inline: 2rem;">
		<h2 data-scroll class="reveal-up" style="text-align: center; margin-bottom: 3rem;">
			Transform Effects
		</h2>

		<div
			style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem;"
		>
			<!-- Scale effect -->
			<div
				data-scroll
				class="reveal-scale gpu"
				style="background: #191919; border-radius: 12px; padding: 1.25rem;"
			>
				<h3 style="margin: 0 0 0.5rem 0;">Scale In</h3>
				<p style="margin: 0; opacity: 0.8; font-size: 0.9rem;">Scales from 92% to 100%</p>
			</div>

			<!-- Rotate effect -->
			<div
				data-scroll
				class="reveal-rotate gpu"
				style="background: #191919; border-radius: 12px; padding: 1.25rem;"
			>
				<h3 style="margin: 0 0 0.5rem 0;">Rotate + Lift</h3>
				<p style="margin: 0; opacity: 0.8; font-size: 0.9rem;">Subtle rotation with translateY</p>
			</div>

			<!-- Speed variant -->
			<div
				data-scroll
				data-scroll-speed="1"
				class="reveal-up gpu"
				style="background: #191919; border-radius: 12px; padding: 1.25rem;"
			>
				<h3 style="margin: 0 0 0.5rem 0;">Speed Parallax</h3>
				<p style="margin: 0; opacity: 0.8; font-size: 0.9rem;">Moves faster than scroll</p>
			</div>
		</div>
	</div>
</section>
