# ExpressDBViewer

A database viewer built with React, Express, and PostgreSQL. Browse, manage, and query your database through a simple web interface.

## Features

- View and browse database tables
- Add, edit, and delete records
- Execute custom SQL queries
- SQL query templates for learning
- Database statistics dashboard
- Explore table relationships

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL

## Quick Start

### Clone & Install

```bash
git clone https://github.com/AmarnathCJD/ExpressDBViewer.git
cd ExpressDBViewer
npm install
cd backend && npm install && cd ..
```

### Setup Environment

Create `.env` in root:
```env
REACT_APP_BACKEND_URL=http://localhost:5000
```

Create `backend/.env`:
```env
DATABASE_URL=postgres://user:password@localhost:5432/database
PORT=5000
```

### Run

Terminal 1 - Backend:
```bash
cd backend && node main.js
```

Terminal 2 - Frontend:
```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000)

## Commands

**Frontend**
- `npm start` - Development server
- `npm build` - Production build
- `npm run lint` - Lint code
- `npm run format` - Format code

**Backend**
- `node main.js` - Start server

## License

MIT License - see [LICENSE](LICENSE) file
