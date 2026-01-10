<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let allRepos: any[] = [];
	let selectedProjects: any[] = [];
	let loading = true;
	let saving = false;
	let saveMessage = '';
	let errorMessage = '';
	let availableImages: string[] = [];
	let showImageManager = false;
	let uploadingImage = false;
	let currentProjectIndex: number | null = null;
	let isDragging = false;

	onMount(async () => {
		await loadData();
	});

	async function loadData() {
		loading = true;
		try {
			// Load all repos
			const reposResponse = await fetch('/api/repos');
			if (reposResponse.ok) {
				const data = await reposResponse.json();
				allRepos = data.repos;
			} else {
				const error = await reposResponse.json();
				alert(`Failed to load repositories: ${error.error || 'Unknown error'}`);
			}
			
			// Load available images
			await loadImages();

			// Load saved projects configuration
			const configResponse = await fetch('/api/cms/content?key=projects.config');
			if (configResponse.ok) {
				const configData = await configResponse.json();
				if (configData.value) {
					selectedProjects = JSON.parse(configData.value);
				} else {
					// Initialize with default projects from PINNED
					selectedProjects = [
						{ name: 'DID', summary: 'A decentralized identity service using blockchain technology.', image: 'did.webp' },
						{ name: 'Trade-o-matic', summary: 'A trading bot testing different strategies across various markets', image: 'trade-o-matic.webp' },
						{ name: 'Comms', summary: 'My quick rough messaging app for testing new frameworks', image: 'comms.webp' },
						{ name: 'Rich_System_Site', summary: 'A betting bot dashboard', image: 'rich_system_site.webp' },
						{ name: 'KodiTV', summary: 'My kodi auto-play plugin', image: 'koditv.webp' },
						{ name: 'home-page', summary: 'My responsive home page for chrome', image: 'home-page.webp' },
						{ name: 'boids', summary: "My BOID's simulation", image: 'boids.webp' },
						{ name: 'renude', summary: 'My Vinted inspired clothing app', image: 'renude.webp' }
					];
				}
			} else {
				// Initialize with default projects from PINNED
				selectedProjects = [
					{ name: 'DID', summary: 'A decentralized identity service using blockchain technology.', image: 'did.webp' },
					{ name: 'Trade-o-matic', summary: 'A trading bot testing different strategies across various markets', image: 'trade-o-matic.webp' },
					{ name: 'Comms', summary: 'My quick rough messaging app for testing new frameworks', image: 'comms.webp' },
					{ name: 'Rich_System_Site', summary: 'A betting bot dashboard', image: 'rich_system_site.webp' },
					{ name: 'KodiTV', summary: 'My kodi auto-play plugin', image: 'koditv.webp' },
					{ name: 'home-page', summary: 'My responsive home page for chrome', image: 'home-page.webp' },
					{ name: 'boids', summary: "My BOID's simulation", image: 'boids.webp' },
					{ name: 'renude', summary: 'My Vinted inspired clothing app', image: 'renude.webp' }
				];
			}
		} catch (error) {
		} finally {
			loading = false;
		}
	}
	
	async function loadImages() {
		try {
			const response = await fetch('/api/images');
			if (response.ok) {
				const data = await response.json();
				availableImages = data.images;
			}
		} catch (error) {
		}
	}
	
	async function uploadImageFile(file: File) {
		uploadingImage = true;
		
		try {
			const formData = new FormData();
			formData.append('file', file);
			
			const response = await fetch('/api/upload-image', {
				method: 'POST',
				body: formData
			});
			
			if (response.ok) {
				await loadImages();
				alert('Image uploaded successfully!');
			} else {
				const error = await response.json();
				alert('Error uploading image: ' + error.error);
			}
		} catch (error) {
			alert('Error uploading image');
		} finally {
			uploadingImage = false;
		}
	}
	
	async function uploadImage(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		
		await uploadImageFile(file);
		input.value = ''; // Reset input
	}
	
	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		isDragging = true;
	}
	
	function handleDragLeave(event: DragEvent) {
		event.preventDefault();
		isDragging = false;
	}
	
	async function handleDrop(event: DragEvent) {
		event.preventDefault();
		isDragging = false;
		
		const files = event.dataTransfer?.files;
		if (!files || files.length === 0) return;
		
		const file = files[0];
		
		// Validate it's an image
		if (!file.type.startsWith('image/')) {
			alert('Please drop an image file');
			return;
		}
		
		await uploadImageFile(file);
	}
	
	async function deleteImage(fileName: string) {
		if (!confirm(`Delete "${fileName}"?`)) return;
		
		try {
			const response = await fetch(`/api/images?file=${encodeURIComponent(fileName)}`, {
				method: 'DELETE'
			});
			
			if (response.ok) {
				await loadImages();
			} else {
				alert('Error deleting image');
			}
		} catch (error) {
			alert('Error deleting image');
		}
	}
	
	function openImageManager(projectIndex: number) {
		currentProjectIndex = projectIndex;
		showImageManager = true;
	}
	
	function selectImage(fileName: string) {
		if (currentProjectIndex !== null) {
			selectedProjects[currentProjectIndex].image = fileName;
		}
		showImageManager = false;
		currentProjectIndex = null;
	}

	function addProject() {
		selectedProjects = [
			...selectedProjects,
			{
				name: '',
				customTitle: '',
				summary: '',
				image: ''
			}
		];
	}

	function removeProject(index: number) {
		const project = selectedProjects[index];
		const projectName = project.name || 'this project';
		if (!confirm(`Are you sure you want to remove "${projectName}"?`)) return;
		selectedProjects = selectedProjects.filter((_, i) => i !== index);
	}

	function moveUp(index: number) {
		if (index === 0) return;
		const temp = selectedProjects[index];
		selectedProjects[index] = selectedProjects[index - 1];
		selectedProjects[index - 1] = temp;
		selectedProjects = [...selectedProjects];
	}

	function moveDown(index: number) {
		if (index === selectedProjects.length - 1) return;
		const temp = selectedProjects[index];
		selectedProjects[index] = selectedProjects[index + 1];
		selectedProjects[index + 1] = temp;
		selectedProjects = [...selectedProjects];
	}

	async function saveProjects() {
		saving = true;
		saveMessage = '';
		errorMessage = '';

		// Validate all required fields
		const errors: string[] = [];
		selectedProjects.forEach((project, index) => {
			const projectNum = index + 1;
			if (!project.name || project.name.trim() === '') {
				errors.push(`Project #${projectNum}: Repository is required`);
			}
			if (!project.summary || project.summary.trim() === '') {
				errors.push(`Project #${projectNum}: Summary is required`);
			}
			if (!project.image || project.image.trim() === '') {
				errors.push(`Project #${projectNum}: Image is required`);
			}
		});

		if (errors.length > 0) {
			errorMessage = errors.join(', ');
			saving = false;
			return;
		}

		try {
			const response = await fetch('/api/cms/content', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					key: 'projects.config',
					value: JSON.stringify(selectedProjects, null, 2),
					isDraft: false
				})
			});

			if (response.ok) {
				saveMessage = '✓ Saved successfully!';
				setTimeout(() => (saveMessage = ''), 3000);
			} else {
				alert('Error saving projects');
			}
		} catch (error) {
			alert('Error saving projects');
		} finally {
			saving = false;
		}
	}
</script>

<div class="cms-container">
	<header>
		<div class="header-content">
			<h1>🎨 Manage Projects</h1>
			<div class="header-actions">
				<button class="back-btn" on:click={() => goto('/cms')}>← Back to CMS</button>
			</div>
		</div>
	</header>

	<main>
		{#if loading}
			<div class="loading">Loading...</div>
		{:else}
			<div class="controls">
				<button class="add-btn" on:click={addProject}>+ Add Project</button>
				<button class="save-btn" on:click={saveProjects} disabled={saving}>
					{saving ? 'Saving...' : '💾 Save Projects'}
				</button>
				{#if saveMessage}
					<span class="save-message">{saveMessage}</span>
				{/if}
				{#if errorMessage}
					<span class="error-message">⚠️ {errorMessage}</span>
				{/if}
			</div>

			<div class="projects-list">
				{#each selectedProjects as project, index (index)}
					<div class="project-item">
						<div class="project-header">
							<span class="project-number">#{index + 1}</span>
							<div class="order-buttons">
								<button
									class="order-btn"
									on:click={() => moveUp(index)}
									disabled={index === 0}
									title="Move up"
								>
									↑
								</button>
								<button
									class="order-btn"
									on:click={() => moveDown(index)}
									disabled={index === selectedProjects.length - 1}
									title="Move down"
								>
									↓
								</button>
								<button class="remove-btn" on:click={() => removeProject(index)}>
									🗑️ Remove
								</button>
							</div>
						</div>

						<div class="project-fields">
							<div class="field">
								<label for="repo-{i}">Repository <span class="required">*</span></label>
								<select id="repo-{i}" bind:value={project.name} required>
									<option value="">Select a repository...</option>
									{#each allRepos as repo}
										<option value={repo.name}>{repo.name}</option>
									{/each}
								</select>
							</div>

							<div class="field">
								<label for="title-{i}">Custom Title (optional)</label>
								<input
									id="title-{i}"
									type="text"
									bind:value={project.customTitle}
									placeholder="Leave empty to use repo name"
								/>
							</div>

							<div class="field">
								<label for="summary-{i}">Summary <span class="required">*</span></label>
								<input id="summary-{i}" type="text" bind:value={project.summary} placeholder="Brief summary" required />
							</div>

							<div class="field">
								<label for="image-{i}">Project Image <span class="required">*</span></label>
								<div class="image-selector">
									{#if project.image}
										<div class="selected-image">
											<img src="/repos/{project.image}" alt="Selected" />
											<span>{project.image}</span>
										</div>
									{:else}
										<div class="no-image">No image selected</div>
									{/if}
									<button class="select-image-btn" on:click={() => openImageManager(index)}>
										Choose Image
									</button>
								</div>
							</div>
						</div>
					</div>
				{/each}

				{#if selectedProjects.length === 0}
					<div class="empty-state">
						<p>No projects added yet. Click "Add Project" to get started.</p>
					</div>
				{/if}
			</div>
		{/if}
	</main>
</div>

{#if showImageManager}
	<div class="modal-overlay" on:click={() => (showImageManager = false)} on:keydown={(e) => e.key === 'Escape' && (showImageManager = false)} role="button" tabindex="0">
		<div class="modal-content image-manager-modal" on:click|stopPropagation on:keydown={(e) => e.stopPropagation()} role="dialog" aria-modal="true" tabindex="-1">
			<div class="modal-header">
				<h2>🖼️ Manage Images</h2>
				<button class="close-btn" on:click={() => (showImageManager = false)}>✕</button>
			</div>
			<div class="modal-body">
				<div
					class="upload-section"
					class:dragging={isDragging}
					on:dragover={handleDragOver}
					on:dragleave={handleDragLeave}
					on:drop={handleDrop}
					role="region"
					aria-label="Image upload area"
				>
					<div class="upload-icon">🖼️</div>
					<h3>Drop image here or</h3>
					<label class="upload-btn">
						<input type="file" accept="image/*" on:change={uploadImage} style="display: none;" />
						{uploadingImage ? 'Uploading...' : '⬆️ Choose File'}
					</label>
					<small>Supports JPG, PNG, WEBP • Recommended: .webp for best performance</small>
				</div>
				
				<div class="images-grid">
					{#each availableImages as imageName}
						<div class="image-item">
							<button class="image-button" on:click={() => selectImage(imageName)} type="button">
								<img src="/repos/{imageName}" alt={imageName} />
							</button>
							<div class="image-actions">
								<span class="image-name">{imageName}</span>
								<button class="delete-image-btn" on:click={() => deleteImage(imageName)}>🗑️</button>
							</div>
						</div>
					{/each}
					{#if availableImages.length === 0}
						<div class="no-images">No images uploaded yet. Upload one to get started!</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.cms-container {
		min-height: 100vh;
		background: #f5f7fa;
	}

	header {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		padding: 1.5rem 2rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.header-content {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	h1 {
		margin: 0;
		font-size: 1.75rem;
	}

	.back-btn {
		padding: 0.5rem 1rem;
		background: rgba(255, 255, 255, 0.2);
		color: white;
		border: 1px solid rgba(255, 255, 255, 0.3);
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.875rem;
		transition: background 0.2s;
	}

	.back-btn:hover {
		background: rgba(255, 255, 255, 0.3);
	}

	main {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	.loading {
		text-align: center;
		padding: 3rem;
		color: #666;
	}

	.controls {
		display: flex;
		gap: 1rem;
		align-items: center;
		margin-bottom: 2rem;
	}

	.add-btn,
	.save-btn {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-weight: 600;
		font-size: 1rem;
		transition: all 0.2s;
	}

	.add-btn {
		background: #667eea;
		color: white;
	}

	.add-btn:hover {
		background: #5568d3;
		transform: translateY(-1px);
	}

	.save-btn {
		background: #28a745;
		color: white;
	}

	.save-btn:hover:not(:disabled) {
		background: #218838;
		transform: translateY(-1px);
	}

	.save-btn:disabled {
		background: #ccc;
		cursor: not-allowed;
	}

	.save-message {
		color: #28a745;
		font-weight: 600;
	}

	.error-message {
		color: #dc3545;
		font-weight: 600;
		background: #f8d7da;
		border: 1px solid #f5c6cb;
		padding: 0.5rem 1rem;
		border-radius: 6px;
	}

	.projects-list {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.project-item {
		background: white;
		border-radius: 12px;
		padding: 1.5rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.project-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
		padding-bottom: 1rem;
		border-bottom: 2px solid #f0f0f0;
	}

	.project-number {
		font-size: 1.5rem;
		font-weight: 700;
		color: #667eea;
	}

	.order-buttons {
		display: flex;
		gap: 0.5rem;
	}

	.order-btn,
	.remove-btn {
		padding: 0.5rem 0.75rem;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.875rem;
		transition: all 0.2s;
	}

	.order-btn {
		background: #667eea;
		color: white;
		font-size: 1rem;
		font-weight: 700;
	}

	.order-btn:hover:not(:disabled) {
		background: #5568d3;
		transform: translateY(-1px);
	}

	.order-btn:disabled {
		background: #ccc;
		cursor: not-allowed;
	}

	.remove-btn {
		background: #dc3545;
		color: white;
	}

	.remove-btn:hover {
		background: #c82333;
		transform: translateY(-1px);
	}

	.project-fields {
		display: grid;
		gap: 1.25rem;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.field label {
		font-weight: 600;
		color: #333;
		font-size: 0.9rem;
	}

	.field label .required {
		color: #dc3545;
		margin-left: 0.25rem;
	}

	.field input,
	.field select {
		padding: 0.75rem;
		border: 2px solid #e0e0e0;
		border-radius: 6px;
		font-size: 1rem;
		font-family: inherit;
	}

	.field input:focus,
	.field select:focus {
		outline: none;
		border-color: #667eea;
	}

	.field small {
		color: #999;
		font-size: 0.85rem;
	}

	.empty-state {
		background: white;
		padding: 3rem;
		text-align: center;
		border-radius: 12px;
		color: #666;
	}
	
	.image-selector {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	
	.selected-image {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		background: #f8f9fa;
		border: 2px solid #e0e0e0;
		border-radius: 8px;
		transition: all 0.2s;
	}
	
	.selected-image:hover {
		border-color: #667eea;
	}
	
	.selected-image img {
		width: 100px;
		height: 100px;
		object-fit: cover;
		border-radius: 8px;
		border: 2px solid #667eea;
		box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
	}
	
	.selected-image span {
		font-family: 'Courier New', monospace;
		color: #666;
		font-size: 0.9rem;
	}
	
	.no-image {
		padding: 3rem 1rem;
		background: #f8f9fa;
		border: 2px dashed #e0e0e0;
		border-radius: 8px;
		text-align: center;
		color: #999;
		font-size: 0.9rem;
	}
	
	.select-image-btn {
		padding: 0.75rem 1.5rem;
		background: #667eea;
		color: white;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-weight: 600;
		font-size: 0.9rem;
		transition: all 0.2s;
		box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
		align-self: flex-start;
	}
	
	.select-image-btn:hover {
		background: #5568d3;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
	}
	
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.7);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}
	
	.modal-content {
		background: white;
		border-radius: 12px;
		max-width: 900px;
		width: 90%;
		max-height: 80vh;
		display: flex;
		flex-direction: column;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
	}
	
	.image-manager-modal {
		max-width: 1000px;
	}
	
	.modal-header {
		padding: 1.5rem;
		border-bottom: 1px solid #e0e0e0;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.modal-header h2 {
		margin: 0;
		font-size: 1.5rem;
	}
	
	.close-btn {
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		color: #999;
		transition: color 0.2s;
	}
	
	.close-btn:hover {
		color: #333;
	}
	
	.modal-body {
		padding: 1.5rem;
		overflow-y: auto;
	}
	
	.upload-section {
		margin-bottom: 2rem;
		padding: 3rem 1.5rem;
		background: #f8f9fa;
		border-radius: 12px;
		text-align: center;
		border: 3px dashed #d0d0d0;
		transition: all 0.3s ease;
	}
	
	.upload-section.dragging {
		background: #e8ecff;
		border-color: #667eea;
		border-width: 3px;
		transform: scale(1.02);
		box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2);
	}
	
	.upload-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
		opacity: 0.7;
	}
	
	.upload-section.dragging .upload-icon {
		opacity: 1;
		animation: bounce 0.5s ease infinite;
	}
	
	@keyframes bounce {
		0%, 100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-10px);
		}
	}
	
	.upload-section h3 {
		margin: 0 0 1rem 0;
		font-size: 1.1rem;
		color: #666;
		font-weight: 500;
	}
	
	.upload-section.dragging h3 {
		color: #667eea;
	}
	
	.upload-section small {
		display: block;
		margin-top: 1rem;
		color: #999;
		font-size: 0.85rem;
	}
	
	.upload-btn {
		display: inline-block;
		padding: 0.875rem 2rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border-radius: 8px;
		font-weight: 600;
		font-size: 1rem;
		cursor: pointer;
		transition: all 0.2s;
		box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
	}
	
	.upload-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
	}
	
	.images-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
		gap: 1.25rem;
		margin-top: 1.5rem;
	}
	
	.image-item {
		border: 3px solid #e0e0e0;
		border-radius: 12px;
		overflow: hidden;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		background: white;
		position: relative;
	}

	.image-button {
		all: unset;
		display: block;
		width: 100%;
		cursor: pointer;
	}

	.image-item:hover {
		border-color: #667eea;
		transform: translateY(-4px);
		box-shadow: 0 8px 24px rgba(102, 126, 234, 0.25);
	}

	.image-item img {
		width: 100%;
		height: 180px;
		object-fit: cover;
		display: block;
		transition: transform 0.3s;
	}

	.image-item:hover img {
		transform: scale(1.05);
	}
	
	.image-actions {
		padding: 0.75rem;
		background: white;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem;
	}
	
	.image-name {
		font-size: 0.8rem;
		color: #666;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		flex: 1;
		font-family: 'Courier New', monospace;
		font-weight: 500;
	}
	
	.delete-image-btn {
		background: #dc3545;
		color: white;
		border: none;
		width: 32px;
		height: 32px;
		border-radius: 6px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.2s;
		font-size: 1rem;
	}
	
	.delete-image-btn:hover {
		background: #c82333;
		transform: scale(1.1);
	}
	
	.no-images {
		grid-column: 1 / -1;
		text-align: center;
		padding: 4rem 2rem;
		color: #999;
		background: #f8f9fa;
		border: 2px dashed #e0e0e0;
		border-radius: 12px;
		font-size: 1rem;
	}

	@media (max-width: 768px) {
		header {
			padding: 1rem;
		}

		.header-content {
			flex-direction: column;
			gap: 1rem;
			align-items: flex-start;
		}

		main {
			padding: 1rem;
		}

		.controls {
			flex-direction: column;
			align-items: stretch;
		}

		.add-btn,
		.save-btn {
			width: 100%;
		}
	}
</style>
