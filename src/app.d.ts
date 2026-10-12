// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}

// Private env is read through `$env/dynamic/private` everywhere (see
// src/lib/db/init.ts), so there is no static module to declare here.

export {};
