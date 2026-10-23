# 🔗 LinkVault — URL Shortener & Analytics

LinkVault is a full-stack web application built using the MERN stack. It transforms long URLs into short, shareable links and provides click analytics.

## Features

* Generate unique shortened URLs
* Redirect users to original websites
* Track total link clicks
* View analytics through a dashboard
* Copy shortened links instantly
* Responsive, modern user interface

## Tech Stack

* Frontend: React.js, CSS, Vite
* Backend: Node.js, Express.js
* Database: MongoDB Atlas
* Deployment: Render

## How It Works

1. The user enters a long URL.
2. The backend generates a unique short code.
3. MongoDB stores the original URL and short code.
4. Visiting the shortened URL redirects to the original website.
5. Every visit increments the click counter.
6. The dashboard displays updated click statistics.

## Local Setup

1. Clone the GitHub repository.
2. Run `npm install` inside both the `client` and `server` folders.
3. Create `server/.env` containing `MONGO_URI` with your MongoDB connection string.
4. Run `node index.js` inside `server`.
5. Run `npm run dev` inside `client`.
6. Open the local Vite URL in your browser.

## Author

Shreenidhi M A
First-Year Computer Science Engineering Student
