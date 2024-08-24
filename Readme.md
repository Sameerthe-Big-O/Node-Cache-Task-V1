Node Cache Task
Description <br>
A simple Node.js task that handles caching using Redis. This application demonstrates how to use Redis to cache API responses and reduce redundant data fetching. The server is built using Express, and the caching is implemented with Redis. The project includes testing with Jest and Supertest.

Features <br>
Caching with Redis: Store and retrieve API responses to improve performance.
Error Handling: Custom error handling.
Testing: tests with Jest and Supertest.
API Endpoint: Example endpoint to demonstrate caching functionality.
Getting Started

# Install dependencies:

# npm install

Set up environment variables:

Create a .env file in the root of the project with the following content:

env
PORT=3000
API_URL=<Your API URL>
SECRET_KEY=<Your API Key>
TTL_TIME=60 // Time to live in seconds

# npm run dev

# npm test for the test
