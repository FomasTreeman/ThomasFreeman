export const DEFAULT_JOURNEY = {
	header: {
		title: 'My Journey',
		subtitle: 'From bootcamp to blockchain'
	},
	experiences: [
		{
			company: 'Founders and Coders',
			role: 'Full Stack Developer Training',
			period: '10 months',
			year: '2021-2022',
			description:
				'Intensive full-stack JavaScript bootcamp focusing on test-driven development, pair programming, and agile methodologies. Built full-stack applications using modern web technologies and collaborative development practices.',
			skills: ['JavaScript', 'React', 'Node.js', 'PostgreSQL', 'TDD', 'Git', 'Express'],
			achievements: [
				'Completed 16-week intensive coding bootcamp',
				'Built 4 full-stack applications using agile methodologies',
				'Mentored junior developers in pair programming'
			],
			color: { primary: 'var(--primary-color1)', secondary: 'var(--primary-color2)' },
			link: 'https://www.foundersandcoders.com/',
			current: false
		},
		{
			company: 'Rubber Cheese',
			role: 'Full Stack Developer',
			period: '2022 - 2025',
			year: '2022-2025',
			description:
				'Built and maintained production PHP/Laravel applications for enterprise clients. Implemented new features, optimized performance, and modernized legacy codebases with Docker containerization.',
			skills: ['PHP', 'Laravel', 'Docker', 'MySQL', 'JavaScript', 'C#', 'Bash', 'Linux'],
			achievements: [
				'Reduced deployment time by 70% through Docker containerization',
				'Built and maintained 8+ production Laravel applications',
				'Implemented CI/CD pipelines for automated testing and deployment'
			],
			color: { primary: 'var(--primary-color1)', secondary: 'var(--primary-color2)' },
			link: 'https://www.rubbercheese.com',
			current: false
		},
		{
			company: 'BSV Blockchain',
			role: 'Open Source Contributor',
			period: 'Present',
			year: '2024-Present',
			description:
				'Contributing to TypeScript SDK development and blockchain infrastructure. Building developer tools, writing comprehensive documentation, and implementing advanced cryptographic features for the BSV ecosystem.',
			skills: [
				'TypeScript',
				'Blockchain',
				'Testing',
				'Documentation',
				'Cryptography',
				'SDK Development'
			],
			achievements: [
				'Contributed to core TypeScript SDK for BSV blockchain',
				'Authored technical documentation and developer guides',
				'Implemented wallet and transaction management features'
			],
			color: { primary: 'var(--primary-color1)', secondary: 'var(--secondary-color1)' },
			link: 'https://bsvblockchain.org',
			current: true
		}
	]
};

export const DEFAULT_HERO = {
	title: "Hi, I'm Tom Freeman 🖖",
	subtitle: 'Software Dev.',
	bio: "I'm a developer with a passion for creating beautiful and efficient applications.",
	resumeUrl: '/Tom_Freeman.pdf',
	resumeLabel: 'Resume'
};

export const DEFAULT_SOCIAL_LINKS = [
	{ name: 'FAC', url: 'https://www.foundersandcoders.com/', icon: '/contact/fac.webp', type: 'image' },
	{ name: 'GitHub', url: 'https://github.com/FomasTreeman', type: 'icon_github' },
	{ name: 'LinkedIn', url: 'https://www.linkedin.com/in/fomas-treeman/', type: 'icon_linkedin' },
	{ name: 'Email', url: 'mailto:tom@team-freeman.com', type: 'icon_email' }
];
