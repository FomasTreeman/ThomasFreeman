<div class="scroll-parent">
	<div class="scroll-element primary icons">
		<i class="devicon-react-original colored" />
		<i class="devicon-git-plain colored" />
		<i class="devicon-bash-plain colored" />
		<i class="devicon-svelte-plain colored" />
		<i class="devicon-postgresql-plain colored" />
		<i class="devicon-linux-plain colored" />
		<i class="devicon-docker-plain colored" />
		<i class="devicon-electron-original colored" />
		<i class="devicon-express-original colored" />
		<i class="devicon-heroku-original colored" />
		<i class="devicon-html5-plain colored" />
		<i class="devicon-css3-plain colored" />
		<i class="devicon-jetbrains-plain colored" />
		<i class="devicon-jquery-plain colored" />
		<i class="devicon-linux-plain colored" />
		<i class="devicon-nodejs-plain colored" />
		<i class="devicon-python-plain colored" />
		<i class="devicon-ssh-original colored" />
		<i class="devicon-threejs-original colored" />
		<i class="devicon-vim-plain colored" />
		<i class="devicon-bootstrap-plain colored" />
		<i class="devicon-figma-plain colored" />
	</div>
	<div class="scroll-element secondary icons">
		<i class="devicon-react-original colored colored" />
		<i class="devicon-git-plain colored" />
		<i class="devicon-bash-plain colored" />
		<i class="devicon-svelte-plain colored" />
		<i class="devicon-postgresql-plain colored" />
		<i class="devicon-linux-plain colored" />
		<i class="devicon-docker-plain colored" />
		<i class="devicon-electron-original colored" />
		<i class="devicon-express-original colored" />
		<i class="devicon-heroku-original colored" />
		<i class="devicon-html5-plain colored" />
		<i class="devicon-css3-plain colored" />
		<i class="devicon-jetbrains-plain colored" />
		<i class="devicon-jquery-plain colored" />
		<i class="devicon-linux-plain colored" />
		<i class="devicon-nodejs-plain colored" />
		<i class="devicon-python-plain colored" />
		<i class="devicon-ssh-original colored" />
		<i class="devicon-threejs-original colored" />
		<i class="devicon-vim-plain colored" />
		<i class="devicon-bootstrap-plain colored" />
		<i class="devicon-figma-plain colored" />
	</div>
</div>

<style>
	:global(:root) {
		--icon-width: 4rem;
		--icon-margin: 2rem;
		/* 22 is number of imgs */
		/* breaks at 900px width */
		/* --stack-width: calc(100vw - 110vw + 22 * var(--img-width)); */
		--stack-width: calc(22 * (var(--icon-width) + var(--icon-margin)));
	}
	.scroll-parent {
		position: relative;
		width: var(--stack-width);
		height: 5rem;
		overflow-x: hidden;
	}

	.scroll-element {
		width: inherit;
		height: inherit;
		position: absolute;
		display: flex;
	}

	.scroll-element i {
		width: calc(var(--icon-width) + var(--icon-width));
		font-size: var(--icon-width);
	}

	.primary {
		animation: primary 20s linear infinite;
	}

	.secondary {
		animation: secondary 20s linear infinite;
	}

	@keyframes primary {
		from {
			left: 0px;
		}
		to {
			left: calc(var(--stack-width) * -1);
		}
	}

	@keyframes secondary {
		from {
			left: var(--stack-width);
		}
		to {
			left: 0px;
		}
	}
</style>
