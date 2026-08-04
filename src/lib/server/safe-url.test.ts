import { describe, it, expect } from 'vitest';
import { assertPublicUrl, isPrivateAddress, UnsafeUrlError } from './safe-url.js';

// Pretend DNS so the tests never touch the network
const resolvesTo = (address: string) => async () => [address];

describe('isPrivateAddress', () => {
	it.each([
		['127.0.0.1', 'loopback'],
		['10.1.2.3', 'private class A'],
		['172.16.0.1', 'private class B, lower bound'],
		['172.31.255.255', 'private class B, upper bound'],
		['192.168.1.1', 'private class C'],
		['169.254.169.254', 'cloud metadata endpoint'],
		['100.64.0.1', 'carrier-grade NAT'],
		['0.0.0.0', 'unspecified'],
		['239.255.255.250', 'multicast'],
		['::1', 'IPv6 loopback'],
		['fd00::1', 'IPv6 unique-local'],
		['fe80::1', 'IPv6 link-local'],
		['::ffff:127.0.0.1', 'IPv4-mapped loopback']
	])('rejects %s (%s)', (address) => {
		expect(isPrivateAddress(address)).toBe(true);
	});

	it.each([['1.1.1.1'], ['8.8.8.8'], ['172.32.0.1'], ['192.169.0.1'], ['2606:4700:4700::1111']])(
		'allows public address %s',
		(address) => {
			expect(isPrivateAddress(address)).toBe(false);
		}
	);
});

describe('assertPublicUrl', () => {
	it('accepts a public https URL', async () => {
		const url = await assertPublicUrl('https://example.com/post', resolvesTo('93.184.216.34'));
		expect(url.hostname).toBe('example.com');
	});

	it('rejects a hostname that resolves into the private range', async () => {
		await expect(
			assertPublicUrl('https://sneaky.example/', resolvesTo('169.254.169.254'))
		).rejects.toBeInstanceOf(UnsafeUrlError);
	});

	it('rejects localhost without needing DNS', async () => {
		await expect(assertPublicUrl('http://localhost:5173/')).rejects.toBeInstanceOf(UnsafeUrlError);
	});

	it('rejects a literal private IP without needing DNS', async () => {
		await expect(assertPublicUrl('http://192.168.0.10/')).rejects.toBeInstanceOf(UnsafeUrlError);
	});

	it.each([['file:///etc/passwd'], ['ftp://example.com/'], ['not a url at all']])(
		'rejects %s',
		async (raw) => {
			await expect(assertPublicUrl(raw, resolvesTo('1.1.1.1'))).rejects.toBeInstanceOf(
				UnsafeUrlError
			);
		}
	);

	it('rejects a host that does not resolve', async () => {
		await expect(assertPublicUrl('https://nope.example/', async () => [])).rejects.toBeInstanceOf(
			UnsafeUrlError
		);
	});
});
