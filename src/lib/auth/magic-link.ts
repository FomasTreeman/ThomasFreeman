import { nanoid } from 'nanoid';
import { Resend } from 'resend';
import { getDb } from '../db/init.js';
// Dynamic env, read at call time: a static import fails the build when the
// variable is missing, and `new Resend(undefined)` throws at import, which
// together took down every preview deploy. See src/lib/db/init.ts.
import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';

/**
 * Skip the magic-link flow on a local dev server.
 *
 * Every CMS gate and API route funnels through verifySession(), so this is the
 * one place the bypass needs to live. It requires BOTH `vite dev` and
 * CMS_DEV_BYPASS=true in .env: `dev` is false in any build, so the flag cannot
 * leak into a deployment even if the variable is set there.
 */
const CMS_DEV_BYPASS = dev && env.CMS_DEV_BYPASS === 'true';

/** The one address allowed into the CMS, or '' when not configured. */
export function adminEmail(): string {
	return env.CMS_ADMIN_EMAIL ?? '';
}

let resend: Resend | null = null;

function getResend(): Resend | null {
	if (!env.RESEND_API_KEY) return null;
	if (!resend) resend = new Resend(env.RESEND_API_KEY);
	return resend;
}

const MAGIC_LINK_EXPIRY_MINUTES = 15;
const SESSION_EXPIRY_DAYS = 7;

export type MagicLinkResult = { ok: true } | { ok: false; reason: 'unauthorized' | 'send_failed' };

export async function createMagicLink(email: string, baseUrl: string): Promise<MagicLinkResult> {
	// Check if email is authorized
	if (!isAuthorizedEmail(email)) {
		return { ok: false, reason: 'unauthorized' };
	}

	const mailer = getResend();
	if (!mailer) {
		console.error('RESEND_API_KEY is not set; cannot send a login link');
		return { ok: false, reason: 'send_failed' };
	}

	const token = nanoid(32);
	const expiresAt = new Date(Date.now() + MAGIC_LINK_EXPIRY_MINUTES * 60 * 1000).toISOString();

	try {
		const db = getDb();
		// Clean up expired magic links
		await db.execute('DELETE FROM magic_links WHERE expires_at < CURRENT_TIMESTAMP');

		// Create new magic link
		await db.execute({
			sql: 'INSERT INTO magic_links (token, email, expires_at) VALUES (?, ?, ?)',
			args: [token, email, expiresAt]
		});

		// Send email
		const magicUrl = `${baseUrl}/cms/auth/verify?token=${token}`;

		await mailer.emails.send({
			from: 'CMS Login <onboarding@resend.dev>',
			to: email,
			subject: 'Your CMS Login Link',
			html: `
				<h2>Login to your CMS</h2>
				<p>Click the link below to login. This link will expire in ${MAGIC_LINK_EXPIRY_MINUTES} minutes.</p>
				<p><a href="${magicUrl}">Login to CMS</a></p>
				<p>Or copy this link: ${magicUrl}</p>
				<p>If you didn't request this link, you can safely ignore this email.</p>
			`
		});

		return { ok: true };
	} catch (error) {
		console.error('Failed to create magic link:', error);
		return { ok: false, reason: 'send_failed' };
	}
}

export async function verifyMagicLink(token: string): Promise<string | null> {
	const db = getDb();
	// Get magic link
	const result = await db.execute({
		sql: 'SELECT email FROM magic_links WHERE token = ? AND expires_at > CURRENT_TIMESTAMP',
		args: [token]
	});
	const magicLink = result.rows[0] as unknown as { email: string } | undefined;

	if (!magicLink) {
		return null;
	}

	// Delete used magic link
	await db.execute({ sql: 'DELETE FROM magic_links WHERE token = ?', args: [token] });

	return magicLink.email;
}

export async function createSession(email: string): Promise<string> {
	const token = nanoid(32);
	const expiresAt = new Date(Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000).toISOString();

	const db = getDb();
	// Clean up expired sessions
	await db.execute('DELETE FROM sessions WHERE expires_at < CURRENT_TIMESTAMP');

	// Create new session
	await db.execute({
		sql: 'INSERT INTO sessions (token, email, expires_at) VALUES (?, ?, ?)',
		args: [token, email, expiresAt]
	});

	return token;
}

export async function verifySession(token: string): Promise<string | null> {
	if (CMS_DEV_BYPASS) return adminEmail();
	if (!token) return null;

	// Every page calls this, so a database that is down or not configured must
	// mean "not logged in", not a 500 for anonymous visitors.
	try {
		const db = getDb();
		const result = await db.execute({
			sql: 'SELECT email FROM sessions WHERE token = ? AND expires_at > CURRENT_TIMESTAMP',
			args: [token]
		});
		const session = result.rows[0] as unknown as { email: string } | undefined;

		return session?.email ?? null;
	} catch (error) {
		console.error('verifySession failed:', error);
		return null;
	}
}

export async function deleteSession(token: string): Promise<void> {
	if (!token) return;

	const db = getDb();
	await db.execute({ sql: 'DELETE FROM sessions WHERE token = ?', args: [token] });
}

export function isAuthorizedEmail(email: string): boolean {
	const admin = adminEmail();
	// No admin configured means nobody is authorized, not everybody
	return admin !== '' && email.toLowerCase() === admin.toLowerCase();
}
