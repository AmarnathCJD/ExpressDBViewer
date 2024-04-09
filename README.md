# Database Dashboard

This project is a database dashboard built with React for the frontend and Express.js for the backend, utilizing PostgreSQL as the database.

## Features

- View database data in a tabular format
- Explore database relations
- Edit data
- Execute raw SQL queries
- Delete entities
- Add entities

## Technologies Used

- **Frontend:** React.js with Node.js and TypeScript
- **Backend:** Express.js with Node.js
- **Database:** PostgreSQL
- **Deployment:** Vercel (frontend) and Render (backend)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/AmarnathCJD/ExpressDBViewer.git

   cd ExpressDBViewer
   ```

2. Install the dependencies:

   ```bash
    npm install
    cd backend && npm install
   ```

3. DB URL is sample data so public access is allowed. You can change the DB URL in the `backend/main.js` file.

4. Start the backend server:

   ```bash
   cd backend && node main.js
   ```

5. Start the frontend server:

   ```bash
    npm start
   ```

6. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Live Demo

You can view the live demo [here](https://db-view.vercel.app/).
<b>Backend is hosted on Render and it may take a few seconds to load (It's free tier).</b>
BACKEND_URL: https://db-express.onrender.com

## Screenshots

![Screenshot 1](https://envs.sh/tUI.png)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
