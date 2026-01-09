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

declare module '$env/static/private' {
	export const TOKEN: string;
	export const BLOB_READ_WRITE_TOKEN: string;
	export const CMS_ADMIN_EMAIL: string;
	export const RESEND_API_KEY: string;
}

export {};
