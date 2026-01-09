import { nanoid } from 'nanoid';
import { Resend } from 'resend';
import { getDb } from '../db/init.js';
import { RESEND_API_KEY, CMS_ADMIN_EMAIL } from '$env/static/private';

const resend = new Resend(RESEND_API_KEY);

const MAGIC_LINK_EXPIRY_MINUTES = 15;
const SESSION_EXPIRY_DAYS = 7;

interface MagicLink {
	token: string;
	email: string;
	expires_at: string;
}

interface Session {
	token: string;
	email: string;
	expires_at: string;
}

export async function createMagicLink(email: string, baseUrl: string): Promise<boolean> {
	// Check if email is authorized
	if (email.toLowerCase() !== CMS_ADMIN_EMAIL.toLowerCase()) {
		return false;
	}

	const token = nanoid(32);
	const expiresAt = new Date(Date.now() + MAGIC_LINK_EXPIRY_MINUTES * 60 * 1000).toISOString();

	const db = getDb();
	try {
		// Clean up expired magic links
		db.prepare('DELETE FROM magic_links WHERE expires_at < CURRENT_TIMESTAMP').run();

		// Create new magic link
		db.prepare(`
			INSERT INTO magic_links (token, email, expires_at)
			VALUES (?, ?, ?)
		`).run(token, email, expiresAt);

		// Send email
		const magicUrl = `${baseUrl}/cms/auth/verify?token=${token}`;
		
		await resend.emails.send({
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

		return true;
	} catch (error) {
		console.error('Error creating magic link:', error);
		return false;
	} finally {
		db.close();
	}
}

export function verifyMagicLink(token: string): string | null {
	const db = getDb();
	try {
		// Get magic link
		const stmt = db.prepare(`
			SELECT email FROM magic_links
			WHERE token = ? AND expires_at > CURRENT_TIMESTAMP
		`);
		const magicLink = stmt.get(token) as { email: string } | undefined;

		if (!magicLink) {
			return null;
		}

		// Delete used magic link
		db.prepare('DELETE FROM magic_links WHERE token = ?').run(token);

		return magicLink.email;
	} finally {
		db.close();
	}
}

export function createSession(email: string): string {
	const token = nanoid(32);
	const expiresAt = new Date(Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000).toISOString();

	const db = getDb();
	try {
		// Clean up expired sessions
		db.prepare('DELETE FROM sessions WHERE expires_at < CURRENT_TIMESTAMP').run();

		// Create new session
		db.prepare(`
			INSERT INTO sessions (token, email, expires_at)
			VALUES (?, ?, ?)
		`).run(token, email, expiresAt);

		return token;
	} finally {
		db.close();
	}
}

export function verifySession(token: string): string | null {
	if (!token) return null;

	const db = getDb();
	try {
		const stmt = db.prepare(`
			SELECT email FROM sessions
			WHERE token = ? AND expires_at > CURRENT_TIMESTAMP
		`);
		const session = stmt.get(token) as { email: string } | undefined;

		return session?.email ?? null;
	} finally {
		db.close();
	}
}

export function deleteSession(token: string): void {
	if (!token) return;

	const db = getDb();
	try {
		db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
	} finally {
		db.close();
	}
}

export function isAuthorizedEmail(email: string): boolean {
	return email.toLowerCase() === CMS_ADMIN_EMAIL.toLowerCase();
}
