# LeadFlow Mini CRM — Future Interns Task 2

A full-stack Client Lead Management System built with the **MERN stack** (MongoDB, Express, React, Node.js).

---

## Features

- **Secure Admin Login** — JWT-based authentication with bcrypt password hashing
- **Lead Management** — Add, edit, delete, and view leads
- **Lead Status Tracking** — new → contacted → converted → lost
- **Follow-up Notes** — Add and delete notes per lead
- **Search & Filter** — Filter by status, source, or keyword
- **CSV Export** — Download all leads as a spreadsheet
- **Dashboard Analytics** — Stats cards with conversion rate

---

## Tech Stack

| Layer     | Technology                  |
|-----------|-----------------------------|
| Frontend  | React 18, React Router v6   |
| Backend   | Node.js, Express.js         |
| Database  | MongoDB + Mongoose          |
| Auth      | JWT + bcryptjs              |
| HTTP      | Axios                       |

---

## Project Structure

```
mini-crm/
├── backend/
│   ├── models/         # Mongoose schemas (User, Lead)
│   ├── routes/         # Express routes (auth, leads)
│   ├── middleware/      # JWT protect middleware
│   ├── server.js       # Entry point
│   ├── .env.example    # Environment variables template
│   └── package.json
└── frontend/
    ├── public/
    └── src/
        ├── api/        # Axios instance
        ├── context/    # Auth context (React)
        ├── components/ # Layout, Sidebar
        ├── pages/      # Login, Register, Dashboard, Leads
        ├── App.js
        └── index.js
```

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB running locally (`mongod`) OR a MongoDB Atlas URI

---

### 1. Clone / Extract the project

```bash
cd mini-crm
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create your `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/mini-crm
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRE=7d
```

Start the backend:

```bash
npm run dev      # development (nodemon)
# or
npm start        # production
```

Backend runs at: **http://localhost:5000**

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm start
```

Frontend runs at: **http://localhost:3000**

---

### 4. First Use

1. Open **http://localhost:3000/register**
2. Create your admin account
3. Log in and start managing leads!

---

## API Endpoints

### Auth
| Method | Endpoint            | Description       |
|--------|---------------------|-------------------|
| POST   | /api/auth/register  | Register admin    |
| POST   | /api/auth/login     | Login             |
| GET    | /api/auth/me        | Get current user  |

### Leads *(all protected — requires Bearer token)*
| Method | Endpoint                        | Description         |
|--------|---------------------------------|---------------------|
| GET    | /api/leads                      | List leads (+ stats)|
| GET    | /api/leads/:id                  | Get single lead     |
| POST   | /api/leads                      | Create lead         |
| PUT    | /api/leads/:id                  | Update lead         |
| DELETE | /api/leads/:id                  | Delete lead         |
| POST   | /api/leads/:id/notes            | Add note to lead    |
| DELETE | /api/leads/:id/notes/:noteId    | Delete note         |

### Query Params for GET /api/leads
- `search` — search by name, email, or company
- `status` — filter by status (new / contacted / converted / lost)
- `source` — filter by source
- `page` — pagination page number
- `limit` — results per page (default: 20)

---

## Deployment Tips

- **Backend**: Deploy to Railway, Render, or Heroku. Set environment variables in the dashboard.
- **Frontend**: Run `npm run build` then deploy the `build/` folder to Vercel or Netlify.
- **Database**: Use [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier) for a cloud DB.

---

## Skills Demonstrated

- CRUD operations with REST API
- JWT authentication & protected routes
- React state management & Context API
- MongoDB schema design with Mongoose
- Frontend-backend integration via Axios

---

*Built for Future Interns Full Stack Web Development — Task 2 (2026)*
