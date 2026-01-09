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
		await db.execute('DELETE FROM magic_links WHERE expires_at < CURRENT_TIMESTAMP');

		// Create new magic link
		await db.execute({
			sql: 'INSERT INTO magic_links (token, email, expires_at) VALUES (?, ?, ?)',
			args: [token, email, expiresAt]
		});

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
		return false;
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
	if (!token) return null;

	const db = getDb();
	const result = await db.execute({
		sql: 'SELECT email FROM sessions WHERE token = ? AND expires_at > CURRENT_TIMESTAMP',
		args: [token]
	});
	const session = result.rows[0] as unknown as { email: string } | undefined;

	return session?.email ?? null;
}

export async function deleteSession(token: string): Promise<void> {
	if (!token) return;

	const db = getDb();
	await db.execute({ sql: 'DELETE FROM sessions WHERE token = ?', args: [token] });
}

export function isAuthorizedEmail(email: string): boolean {
	return email.toLowerCase() === CMS_ADMIN_EMAIL.toLowerCase();
}
