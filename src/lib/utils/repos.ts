import type { IPinnedData } from '$lib/types.js';

const PINNED: { [key: string]: IPinnedData } = {
    'Comms': {
        production: 'https://comm-a.vercel.app/',
        imageExt: '.webp',
        summary: 'My quick rough messaging app for testing new frameworks',
        stack: ['react', 'supabase'],
        description: 'A messaging app using react, (version 2) the current feature in development is introducing Supabases DB and login/auth tools. where originally there wasnt session management'

    },
    'Rich_System_Site': {
        imageExt: '.webp',
        summary: 'A betting bot dashboard',
        stack: ['Node.js', 'Docker', 'Cypress', 'PM2', 'Svelte', 'shell'],
        description: 'I assisted clients in automating their betting system by utilising web scraping techniques and placing necessary bets accordingly. In the initial version, I used a docker container with Cypress, but it became increasingly complicated and heavy due to the need for headless video buffers to run the test in a browser. In the second revision, I simply made a request for the HTML with a valid cookie that I refreshed on each request to avoid conflicts. Additionally, I developed a user-friendly interface that allows clients to view their open, closed, and live bets for the day, as well as all historical data, represented in various graphs with customisable filters. To ensure secure operation, I implemented a minimal login feature that allows me to change settings and preset configurations for the bot, such as turning it on/off or increasing the maximum stake.'
    },
    'KodiTV': {
        imageExt: '.webp',
        summary: 'My kodi auto-play plugin',
        stack: ['python'],
        description: 'A Kodi plug-in. A program that automatically recorded TV show episodes you were watching to create a queue for things to watch next. Also using Alexa skills to stop, start and skip.'

    },
    'home-page': {
        imageExt: '.webp',
        summary: 'My responsive home page for chrome',
        stack: ['Svelte-Kit'],
        description: 'A new Chrome extension for power users. Faster access to your GitHub repos. Integrating my progress tracker, with a shortcut for the projects status Customise and save notes with the sticky note feature and fun widgets like BTC and ETH prices, an age widget, and a clock.Currently building a Rust LLM chatbot to replace my current phind.com hotline.'
    },
    'boids': {
        imageExt: '.webp',
        summary: "My BOID's simulation",
        stack: ['python'],
        description: 'This is a simulation to replicate the behaviour of flocks of birds. It follows three rules; separation, alignment, cohesion. Separation - each bird attempts to maintain even spacing among its neighbouring birds. Alignment - each bird tries to gradually follow the same vector as neighbouring birds. Cohesion - each bird ties to move towards the average position of other neighbouring birds (countering separation to create an average position).',
    },
    'renude': {
        summary: 'Coming soon!',
        stack: ['React Native', 'Stripe', 'AWS: S3, RDS', 'Clerk', 'Prisma', 'tRPC + Express'],
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