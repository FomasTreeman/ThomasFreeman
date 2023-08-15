<div id="mouse-scroll">
	<div class="mouse">
		<div class="mouse-in" />
	</div>
	<div>
		<span class="down-arrow-1" />
		<span class="down-arrow-2" />
		<span class="down-arrow-3" />
	</div>
</div>

<style>
	#mouse-scroll {
		position: relative;
		opacity: 0.8;
		width: 10px;
		margin-inline: auto;
		margin-top: 40px;
		z-index: 100;
		transform: translateX(50%);
		-webkit-transform: translateX(-50%);
		z-index: 30;
	}
	#mouse-scroll span {
		display: block;
		width: 5px;
		height: 5px;
		-ms-transform: rotate(45deg);
		-webkit-transform: rotate(45deg);
		transform: rotate(45deg);
		transform: rotate(45deg);
		border-right: 2px solid #fff;
		border-bottom: 2px solid #fff;
		margin: 0 0 3px 5px;
	}
	#mouse-scroll .mouse {
		height: 21px;
		width: 14px;
		border-radius: 10px;
		-webkit-transform: none;
		-ms-transform: none;
		transform: none;
		border: 2px solid #ffffff;
		top: 170px;
	}
	#mouse-scroll .down-arrow-1 {
		margin-top: 6px;
	}
	#mouse-scroll .down-arrow-1,
	#mouse-scroll .down-arrow-2,
	#mouse-scroll .down-arrow-3 {
		animation: mouse-scroll 1s infinite;
		-webkit-animation: mouse-scroll 1s infinite;
		-moz-animation: mouse-scroll 1s infinite;
	}

	#mouse-scroll .down-arrow-1 {
		animation-delay: 0.1s;
		-webkit-animation-delay: 0.1s;
		-moz-animation-delay: 0.1s;
		animation-direction: alternate;
		-webkit-animation-direction: alternate;
	}
	#mouse-scroll .down-arrow-2 {
		animation-delay: 0.2s;
		-webkit-animation-delay: 0.2s;
		-moz-animation-delay: 0.2s;
		animation-direction: alternate;
		-webkit-animation-direction: alternate;
	}
	#mouse-scroll .down-arrow-3 {
		animation-delay: 0.3s;
		-webkit-animation-delay: 0.3s;
		-moz-animation-delay: 0.3s;
		animation-direction: alternate;
		-webkit-animation-direction: alternate;
	}
	#mouse-scroll .mouse-in {
		height: 5px;
		width: 2px;
		display: block;
		margin: 5px auto;
		background: #ffffff;
		position: relative;
	}
	#mouse-scroll .mouse-in {
		animation: animated-mouse 1.2s ease infinite;
		-webkit-animation: animated-mouse 1.2s ease infinite;
		-moz-animation: mouse-animated 1.2s ease infinite;
	}

	@keyframes animated-mouse {
		0% {
			opacity: 1;
			-webkit-transform: translateY(0);
			-ms-transform: translateY(0);
			transform: translateY(0);
		}
		100% {
			opacity: 0;
			-webkit-transform: translateY(6px);
			-ms-transform: translateY(6px);
			transform: translateY(6px);
		}
	}
	@keyframes mouse-scroll {
		0% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
		100% {
			opacity: 1;
		}
	}
	@keyframes mouse-scroll {
		0% {
			opacity: 0;
		}
		50% {
			opacity: 0.5;
		}
		100% {
			opacity: 1;
		}
	}
</style>
