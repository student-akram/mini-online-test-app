# Online Test Platform – MERN Stack

A full-stack online examination platform built using the **MERN stack** (MongoDB, Express.js, React.js, and Node.js). It provides separate student and administrator dashboards, randomized multiple-choice examinations, automatic submission, detailed results, and exam history.

## 🚀 Features

### 👨‍🎓 Student Features
- Student registration and login.
- Secure authentication using JWT.
- Student dashboard with examination statistics.
- Start an examination with 10 randomly selected active questions.
- 10-minute countdown timer.
- Automatic exam submission when the timer expires.
- Save answers during an active examination.
- Resume an examination after refreshing the page.
- View detailed examination results.
- Review correct, incorrect, and unanswered questions.
- View previous examination attempts and scores.

### 🛠️ Admin Features
- Secure administrator login.
- Admin dashboard with examination and question statistics.
- Add new multiple-choice questions.
- Edit existing questions.
- Delete questions using soft deletion.
- Activate or deactivate questions.
- Manage questions by subject and difficulty.
- Search and filter questions.

## 🧰 Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, Vite, JavaScript |
| Styling | CSS |
| Routing | React Router |
| Icons | Lucide React |
| API Communication | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Authentication | JWT, bcryptjs |
| Deployment | Vercel, Render |

## 🏗️ Project Structure

```text
online-test-platform/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   └── student/
│   │   ├── context/
│   │   ├── pages/
│   │   │   └── admin/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/student-akram/mini-online-test-app/
cd online-test-platform
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
FRONTEND_URL=http://localhost:5173
```

Replace the example values with your actual configuration.

Start the backend development server:

```bash
npm run dev
```

The backend will run at:

```text
http://localhost:5000
```

### 3. Frontend setup

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The frontend will run at:

```text
http://localhost:5173
```

## 🔐 Authentication and Authorization

The application uses JWT-based authentication.

- Passwords are hashed using bcryptjs.
- JWT tokens are used to authenticate protected API requests.
- Role-based authorization separates student and administrator access.
- Public registration creates student accounts.
- Administrator accounts are created through the backend seed process.

## 📝 Examination Workflow

1. A student logs into the application.
2. The student starts an examination.
3. The backend randomly selects 10 active questions from MongoDB.
4. The selected questions are saved as an examination snapshot.
5. A 10-minute timer begins.
6. Student answers are saved through the backend.
7. The examination is submitted manually or automatically when time expires.
8. The backend calculates the result.
9. The student can view detailed results and examination history.

**Important:** Correct answers are not exposed to students while they are taking the examination. They are used by the backend to calculate the final result.

## 🔌 Main API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a student |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get logged-in user |
| POST | `/api/auth/logout` | Logout |

### Admin – Question Management

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/admin/questions` | Add a question |
| GET | `/api/admin/questions` | Get questions |
| GET | `/api/admin/questions/:id` | Get a question |
| PUT | `/api/admin/questions/:id` | Update a question |
| PATCH | `/api/admin/questions/:id/status` | Change question status |
| DELETE | `/api/admin/questions/:id` | Delete a question |

### Student – Examination

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/exam/current` | Get current examination |
| PATCH | `/api/answers/:attemptId` | Save an answer |
| POST | `/api/submissions/:attemptId/submit` | Submit examination |
| GET | `/api/submissions/:attemptId/result` | Get examination result |
| GET | `/api/history` | Get examination history |

All protected endpoints require appropriate authentication and authorization.

## 🗄️ Database Collections

The application uses MongoDB with Mongoose.

| Collection | Purpose |
|---|---|
| Users | Stores student and administrator accounts |
| Questions | Stores examination questions, options, answers, subjects, and difficulty |
| Attempts | Stores examination attempts, selected answers, results, and timestamps |

## 🌐 Deployment

The application is designed for deployment using:

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas

Production URLs will be added after successful deployment.

| Service | URL |
|---|---|
| Live Application | https://mini-online-test-app-eta.vercel.app |
| Backend API | 
VITE_API_URL=https://mini-online-test-app.onrender.com/api
 |
| GitHub Repository | https://github.com/student-akram/mini-online-test-app/ |

## 🔒 Security Considerations

- Password hashing with bcryptjs.
- JWT-based authentication.
- Role-based access control.
- Protected backend routes.
- Correct answers hidden during active examinations.
- Environment variables used for sensitive configuration.
- `.env` files should never be committed to GitHub.

## 📸 Screenshots

Add screenshots of the following application pages after deployment:

- Login Page
- Student Dashboard
- Examination Page
- Examination Result Page
- Examination History
- Admin Dashboard
- Question Management

## 👨‍💻 Developer

**Shaik Akram**

- GitHub: https://github.com/student-akram
- LinkedIn:  https://www.linkedin.com/in/shaik-akram-408535343/

---

*Developed as a full-stack web application to demonstrate practical skills in React.js, Node.js, Express.js, MongoDB, authentication, REST APIs, and application deployment.*