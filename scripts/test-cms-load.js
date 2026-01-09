import Database from 'better-sqlite3';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '..', 'data', 'dashboard.db');
const db = new Database(dbPath);

console.log('Testing CMS Data Load\n' + '='.repeat(50));

// Simulate getContent function
function getContent(key, isLoggedIn = false) {
	const query = isLoggedIn
		? 'SELECT value FROM content WHERE key = ?'
		: 'SELECT value FROM content WHERE key = ? AND is_draft = 0';
	
	const stmt = db.prepare(query);
	const result = stmt.get(key);
	return result?.value ?? null;
}

// Simulate what layout.server.ts does
function loadCMSContent(isLoggedIn) {
	console.log(`\nLoading as ${isLoggedIn ? 'LOGGED IN' : 'PUBLIC'}:\n`);
	
	try {
		const data = {
			hero: {
				title: getContent('homepage.hero.title', isLoggedIn) || 'DEFAULT TITLE',
				subtitle: getContent('homepage.hero.subtitle', isLoggedIn) || 'DEFAULT SUBTITLE',
				bio: getContent('about.bio', isLoggedIn) || 'DEFAULT BIO',
				resumeUrl: getContent('about.resume_url', isLoggedIn) || '/Tom_Freeman.pdf',
				resumeLabel: getContent('about.resume_label', isLoggedIn) || 'Resume',
				birthdate: getContent('about.birthdate', isLoggedIn) || '2001-04-13'
			},
			contact: {
				email: getContent('contact.email', isLoggedIn) || 'tom@team-freeman.com'
			},
			socialLinks: JSON.parse(getContent('about.social_links', isLoggedIn) || '[]'),
			journey: {
				header: JSON.parse(getContent('journey.header', isLoggedIn) || '{}'),
				experiences: JSON.parse(getContent('journey.experiences', isLoggedIn) || '[]').length + ' experiences'
			},
			footer: JSON.parse(getContent('footer.content', isLoggedIn) || '{}')
		};

		console.log('HERO:');
		console.log('  title:', data.hero.title);
		console.log('  subtitle:', data.hero.subtitle);
		console.log('  bio:', data.hero.bio);
		console.log('  resumeUrl:', data.hero.resumeUrl);
		console.log('  resumeLabel:', data.hero.resumeLabel);
		console.log('  birthdate:', data.hero.birthdate);
		
		console.log('\nCONTACT:');
		console.log('  email:', data.contact.email);
		
		console.log('\nSOCIAL LINKS:');
		console.log('  count:', data.socialLinks.length);
		data.socialLinks.forEach(link => {
			console.log(`  - ${link.name}: ${link.url}`);
		});
		
		console.log('\nJOURNEY:');
		console.log('  header.title:', data.journey.header.title);
		console.log('  header.subtitle:', data.journey.header.subtitle);
		console.log('  experiences:', data.journey.experiences);
		
		console.log('\nFOOTER:');
		console.log('  heading:', data.footer.heading);
		console.log('  emoji:', data.footer.emoji);
		
	} catch (error) {
		console.error('ERROR:', error.message);
	}
}

// Test both logged in and logged out
loadCMSContent(true);
loadCMSContent(false);

db.close();
console.log('\n' + '='.repeat(50));
console.log('Test complete!');
