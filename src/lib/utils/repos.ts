import type { IPinnedData } from '$lib/types.js';

const PINNED: { [key: string]: IPinnedData } = {
    'DID': {
		summary: 'A decentralized identity service using blockchain technology.',
		stack: ['Go'],
		description: 'The service enables the creation and management of DIDs, storing them in a blockchain structure. It primarily explores the advantages and disadvantages of PoW, PoS, and ZKP. Additionally, it pairs with Kubernetes to simulate more realistic performance.'
	},
	'Trade-o-matic': {
        summary: 'A trading bot testing different strategies across various markets',
        stack: ['Java'],
        description: 'A trading bot in Java testing different strategies across various markets. The bot uses a variety of indicators to make decisions, such as moving averages, RSI, and MACD.'
    },
    'Comms': {
        production: 'https://comm-a.vercel.app/',
        summary: 'My quick rough messaging app for testing new frameworks',
        stack: ['react', 'supabase'],
        description: 'A messaging app using react, (version 2) the current feature in development is introducing Supabases DB and login/auth tools. where originally there wasnt session management'
    },
    'Rich_System_Site': {
        summary: 'A betting bot dashboard',
        stack: ['Node.js', 'Docker', 'Cypress', 'PM2', 'Svelte', 'shell'],
        description: `<h2>🤖  __My automated betting bot  📈 </h2>
	<p>
		For this project, we had a pretty big task on our hands. Our client had a betting system that was
		a bit sluggish due to manual input, so we decided to automate it to make things smoother. On top
		of that, I designed a custom logging system. At first, I had it set up on my NAS in a Docker container,
		but I ran into a few hiccups with one of the tools I was using. Eventually, I managed to eliminate
		the need for end-to-end testing tools for scraping, which also meant we could ditch the Docker container.
	</p>
	<h3>🔍 How it works:</h3>
	<p>
		I scrape data from a tips website and then check it against the system, which consists of a set
		of rules we've created to decide if a bet is worth placing. If it meets the criteria, I open a
		WebSocket to Betfair and wait for the odds to fall within the 'system's' range. As soon as they
		do, it places a bet.
	</p>
	<h3>🖌️ The User Interface:</h3>
	<p>
		The client, need visibility of the automated system. It needed to track the bot&lsquo;s
		progress. I created a website using svelte-kit and a react-native app. They provided graphs,
		trade history, and fun stats. I also created a developer page secured by password to manage app
		settings and git branch/tag updates.
	</p>
	<h3>🕰️ What&lsquo;s next:</h3>
	<p>
		Taking this further, I plan to explore a more algorithmic approach aimed at generating profits
		by laying all trades within a market.
	</p>
	<h3>🔧 Skills and tools:</h3>
	<p>
		I've implemented advanced shell scripting tools like pm2, Docker, vi, CI scripts, and GitHub
		Actions to establish a robust CI/CD pipeline. The app now allows for seamless configuration
		management, and changes can be applied without any need to restart the bot. Ensuring the
		automated bot runs smoothly 24/7 without any crashes is of utmost importance, and I've set up
		notifications to keep me informed about any occurrences or issues promptly.
	</p>
	<h3>✂️ Twists:</h3>
	<p>
		Initially, I implemented the scraping of the tips website using Nightmarejs. However, I later
		rewrote the process using Cypress and jQuery due to the logging benefits it offered. To improve
		performance, I decided to parallelize the scraping service, but this required a Cypress Cloud
		subscription, which my client was not willing to pay for. As a result, I re-implemented it using
		asynchronous Cypress processes, which, unfortunately, led to login cookie conflicts. In my quest
		for a more efficient solution, I discovered that making fetch requests to obtain the raw HTML of
		the page and then parsing it with cheerio.js was a quicker and simpler approach.
	</p>`
    },
    'KodiTV': {
        summary: 'My kodi auto-play plugin',
        stack: ['python'],
        description: 'A Kodi plug-in. A program that automatically recorded TV show episodes you were watching to create a queue for things to watch next. Also using Alexa skills to stop, start and skip.'

    },
    'home-page': {
        summary: 'My responsive home page for chrome',
        stack: ['Svelte-Kit'],
        description: 'A new Chrome extension for power users. Faster access to your GitHub repos. Integrating my progress tracker, with a shortcut for the projects status Customise and save notes with the sticky note feature and fun widgets like BTC and ETH prices, an age widget, and a clock.Currently building a Rust LLM chatbot to replace my current phind.com hotline.'
    },
    'boids': {
        summary: "My BOID's simulation",
        stack: ['python'],
        description: 'This is a simulation to replicate the behaviour of flocks of birds. It follows three rules; separation, alignment, cohesion. Separation - each bird attempts to maintain even spacing among its neighbouring birds. Alignment - each bird tries to gradually follow the same vector as neighbouring birds. Cohesion - each bird ties to move towards the average position of other neighbouring birds (countering separation to create an average position).',
    },
    'renude': {
        summary: "My Vinted inspired clothing app",
        stack: ['React Native', 'Stripe', 'Clerk', 'Prisma', 'tRPC', 'PlanetScale', 'Cloudflare R2 + Express'],
        description: `**Project Idea: Fun E-Commerce Clothing App Showcase**
 --- 
**1. Objective and Purpose:**
Develop a mobile application that showcases your expertise in creating an e-commerce platform for clothing. The app's primary purpose is to demonstrate your skills in UI/UX design, backend integration, and overall app development.

**2. Concept and Features:**
Create an engaging clothing e-commerce app that allows users to browse, view, and "purchase" virtual clothes. Users won't make real purchases, but the app will mimic the shopping experience. Here are some features to consider:

- **User Registration and Login:** Allow users to create accounts and log in securely.
- **Product Catalog:** Display a variety of clothing items, each with images, descriptions, prices, and sizes.
- **Shopping Cart:** Enable users to add items to their cart and view the total cost.
- **Checkout Simulation:** Simulate a checkout process where users can "purchase" items and see a confirmation.
- **User Profile:** Let users view their order history and manage their account settings.
- **Search and Filters:** Implement search functionality and filters to help users find specific clothing items.
- **Responsive Design:** Ensure the app's UI is responsive and suitable for different screen sizes.

**3. Tools and Technologies:**
Demonstrate your proficiency in various tools and technologies relevant to mobile app development and e-commerce:

- **Frontend Development:** Use a modern framework like React Native to build the app's frontend.
- **UI Design:** Utilize tools like Adobe XD or Figma for designing the app's user interface.
- **API Integration:** Integrate with mock APIs to fetch clothing data. JSONPlaceholder could be used to simulate API calls.
- **State Management:** Showcase state management using tools like Redux or React Context API.
- **Backend Integration:** Set up a mock backend using tools like JSON Server to handle cart management and order history.
- **Authentication:** Implement user authentication using Firebase Authentication or similar services.
- **Payment Simulation:** Simulate a payment process without actual transactions.
- **Testing:** Conduct unit tests for critical components using tools like Jest.
- **Deployment:** Deploy the app on emulators or physical devices for demonstration.

**4. App Flow:**
Define the flow of the app to ensure a smooth user experience:

- **Login/Registration:** Users can create accounts or log in.
- **Product Listing:** Showcase clothing items with images, descriptions, and prices.
- **Product Details:** Show detailed information about each clothing item.
- **Shopping Cart:** Display added items, their quantities, and a total cost.
- **Checkout Simulation:** Simulate a checkout process and display a confirmation message.
- **User Profile:** Allow users to view their order history and manage their account.
- **Search and Filters:** Implement search and filtering options for clothing items.

**5. Project Management:**
Organize tasks, track progress, and manage the project using tools like Trello or GitHub Projects.

**6. Documentation and Presentation:**
Create documentation detailing your design decisions, challenges faced, and how you overcame them. Craft a presentation or portfolio page to showcase the app's features, design, and the tools you utilized.

**7. Learning Opportunities:**
Take advantage of learning opportunities throughout the project. Experiment with different UI/UX concepts, explore responsive design principles, and practice effective state management.

By creating this fun e-commerce clothing app, you'll not only have a creative portfolio piece but also gain practical experience in developing a mobile app with real-world features.`
    }

};

export default PINNED;