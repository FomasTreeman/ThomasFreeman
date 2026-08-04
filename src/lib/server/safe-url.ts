import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';

/**
 * Guards for server-side URL fetching.
 *
 * Anything that fetches a user-supplied URL from the server is an SSRF sink: the
 * request originates inside the deployment's network, so it can reach hosts the
 * caller cannot. Being admin-only limits who can aim it, but it does not stop the
 * request from hitting a cloud metadata endpoint or an internal service, so
 * resolve the host and refuse non-public addresses before fetching.
 */

export function isPrivateAddress(address: string): boolean {
	if (isIP(address) === 6) {
		const ip = address.toLowerCase();
		if (ip === '::1' || ip === '::') return true;
		// unique-local (fc00::/7) and link-local (fe80::/10)
		if (/^f[cd]/.test(ip) || /^fe[89ab]/.test(ip)) return true;
		// IPv4-mapped, e.g. ::ffff:127.0.0.1
		const mapped = ip.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
		return mapped ? isPrivateAddress(mapped[1]) : false;
	}

	const parts = address.split('.').map(Number);
	if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) return true;
	const [a, b] = parts;

	if (a === 0 || a === 10 || a === 127) return true;
	if (a === 169 && b === 254) return true; // link-local, incl. cloud metadata
	if (a === 172 && b >= 16 && b <= 31) return true;
	if (a === 192 && b === 168) return true;
	if (a === 100 && b >= 64 && b <= 127) return true; // carrier-grade NAT
	if (a >= 224) return true; // multicast and reserved
	return false;
}

export class UnsafeUrlError extends Error {}

/**
 * Parse `raw`, confirm it is an http(s) URL on a publicly routable host, and
 * return it. Throws UnsafeUrlError with a message safe to show the admin.
 */
export async function assertPublicUrl(
	raw: string,
	resolve: (host: string) => Promise<string[]> = defaultResolve
): Promise<URL> {
	let url: URL;
	try {
		url = new URL(raw);
	} catch {
		throw new UnsafeUrlError('That is not a valid URL.');
	}

	if (url.protocol !== 'http:' && url.protocol !== 'https:') {
		throw new UnsafeUrlError('Only http and https URLs are supported.');
	}

	const host = url.hostname.replace(/^\[|\]$/g, '');
	if (host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.internal')) {
		throw new UnsafeUrlError('That host is not reachable.');
	}

	const addresses = isIP(host) ? [host] : await resolve(host);

	if (addresses.length === 0 || addresses.some(isPrivateAddress)) {
		throw new UnsafeUrlError('That host is not reachable.');
	}

	return url;
}

async function defaultResolve(host: string): Promise<string[]> {
	try {
		const records = await lookup(host, { all: true });
		return records.map((record) => record.address);
	} catch {
		throw new UnsafeUrlError('Could not resolve that host.');
	}
}
