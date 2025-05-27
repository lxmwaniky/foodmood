
# Food Mood 🍪

Welcome to Food Mood, an application that suggests snacks based on how you're feeling! Describe your mood, and let our AI-powered assistant find the perfect treat for you.

## ✨ Features

-   **Mood-Based Snack Suggestions:** Get personalized snack recommendations by describing your current mood.
-   **AI-Powered:** Utilizes Genkit and Google AI to understand your mood and suggest relevant snacks.
-   **Interactive UI:** Clean and user-friendly interface built with modern web technologies.
-   **Feedback Mechanism:** Let us know if you like the suggestions!

## 🛠️ Tech Stack

-   **Frontend:** Next.js (App Router), React, TypeScript
-   **Styling:** Tailwind CSS, ShadCN UI
-   **AI Integration:** Genkit, Google AI (Gemini)
-   **Development:** Node.js

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   Node.js (v20.x or later recommended)
-   npm (comes with Node.js)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/lxmwaniky/foodmood
    cd foodmood
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```
    (or `npm ci` for a cleaner install based on `package-lock.json`)

3.  **Set up Environment Variables:**
    Create a `.env` file in the root of your project and add your Google AI API key:
    ```env
    GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY
    ```
    Replace `YOUR_GOOGLE_API_KEY` with your actual API key from Google AI Studio or Google Cloud Console. Ensure the "Generative Language API" or "Vertex AI API" is enabled in your Google Cloud project and billing is active.

4.  **Run the Development Servers:**
    You need to run two development servers concurrently for the full application experience:
    *   **Next.js App (Frontend):**
        ```bash
        npm run dev
        ```
        This will typically start the frontend on `http://localhost:9002`.

    *   **Genkit AI Flows (Backend):**
        Open a new terminal window/tab and run:
        ```bash
        npm run genkit:watch
        ```
        (or `npm run genkit:dev` for a single run without watching for changes)
        This starts the Genkit development server, making your AI flows available.

5.  Open [http://localhost:9002](http://localhost:9002) in your browser to see the application.

## 📜 Available Scripts

In the project directory, you can run:

-   `npm run dev`: Runs the Next.js app in development mode with Turbopack.
-   `npm run build`: Builds the Next.js app for production.
-   `npm run start`: Starts the production Next.js server (after building).
-   `npm run lint`: Runs the ESLint linter to check for code style issues.
-   `npm run typecheck`: Runs the TypeScript compiler to check for type errors.
-   `npm run genkit:dev`: Starts the Genkit development server.
-   `npm run genkit:watch`: Starts the Genkit development server and watches for file changes.

## 🚀 Deployment

This application is configured for deployment to **Firebase App Hosting**. Connect your GitHub repository to a Firebase App Hosting backend in the Firebase console. Pushes to the connected branch will trigger automatic builds and deployments.

The `apphosting.yaml` file in the root directory contains basic configuration for App Hosting.

## CI/CD

This project includes a GitHub Actions workflow for Continuous Integration (CI) located at `.github/workflows/ci.yml`. This workflow automatically runs on every push and pull request to the `main` branch to:
- Install dependencies
- Run the linter
- Perform type checking
- Build the project

This helps ensure code quality and that the application builds successfully before deployment.

## ©️ Copyright

&copy; Alex Nyambura
