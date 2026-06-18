# Quantum AI IIT-JEE Mock Tests - Complete Setup Guide

## 🚀 Features Implemented

This document outlines all the features that have been implemented for a fully functional dashboard with user authentication, activity tracking, and virtual teaching.

### 1. **User Authentication**
- ✅ Sign-up with email, password, name, class level, and target exam
- ✅ Login with email and password
- ✅ JWT token-based authentication
- ✅ Secure password hashing with bcrypt
- ✅ User data persistence in database

### 2. **User Profile Management**
- ✅ View all stored user details
- ✅ Display user's name, email, class level, target exam
- ✅ Account status and subscription information

### 3. **Dashboard with Real Data**
- ✅ Dynamic greeting based on time of day
- ✅ Real-time progress statistics (tests completed, average score, best score)
- ✅ User's study plan based on activities
- ✅ Weekly performance visualization

### 4. **Virtual Teacher**
- ✅ Interactive explanation of topics for Physics, Chemistry, and Mathematics
- ✅ Text-to-speech for audio explanations
- ✅ Real-world examples with expandable content
- ✅ Key formulas display
- ✅ Pro tips section
- ✅ Related topics suggestions

### 5. **Activity Tracking**
- ✅ Log user activities (exams, courses, doubts, videos, practice)
- ✅ Store activities in database
- ✅ Display user's activity history
- ✅ Track activity timestamp, duration, and scores

### 6. **Course Management**
- ✅ View active courses with progress
- ✅ Click on courses to access Virtual Teacher
- ✅ Course information with mentor details
- ✅ Progress tracking for each course

### 7. **API Service Layer**
- ✅ Centralized API client for frontend
- ✅ Token management
- ✅ Error handling with fallbacks
- ✅ Support for both backend and localStorage

---

## 🛠️ Installation & Setup

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create `.env` file:**
   ```env
   SECRET_KEY=your-secret-key-here-min-32-chars
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=60
   DATABASE_URL=sqlite:///database.db
   ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173
   ```

5. **Run the backend:**
   ```bash
   python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. **Navigate to frontend/web directory:**
   ```bash
   cd frontend/web
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```env
   VITE_API_URL=http://localhost:8000/api
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

---

## 📚 API Endpoints

### Authentication Endpoints

- `POST /api/auth/signup` - Sign up a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Student Endpoints

- `POST /api/student/selection` - Save subject/topic selection
- `GET /api/student/selection` - Get current selection
- `POST /api/student/activity` - Log a user activity
- `GET /api/student/activities` - Get user activities history

### Exam Endpoints

- `GET /api/exams/questions` - Get questions (with filters)
- `POST /api/exams/submit` - Submit exam answers
- `GET /api/exams/history` - Get exam history
- `GET /api/exams/leaderboard` - Get leaderboard

### Progress Endpoints

- `GET /api/progress/summary` - Get progress summary

---

## 🎯 User Flow

### 1. **Sign-Up/Login Flow**
```
1. User visits /login
2. Fill in signup/login form
3. Submit form → API call to backend
4. Backend validates and returns JWT token
5. Token stored in localStorage
6. User redirected to /dashboard
```

### 2. **Dashboard Flow**
```
1. User views dashboard
2. Dashboard fetches:
   - Current user data (/api/auth/me)
   - Progress summary (/api/progress/summary)
   - Activity history (/api/student/activities)
3. Display real-time data
4. Show buttons for actions (Continue Learning, View Plan, etc.)
```

### 3. **Virtual Teacher Flow**
```
1. User clicks "Watch Class" on a course
2. Activity is logged (/api/student/activity)
3. Virtual Teacher modal opens
4. User can:
   - Read explanation
   - Listen to audio (text-to-speech)
   - View formulas
   - Expand examples
   - See pro tips
   - Explore related topics
5. Close modal to continue
```

### 4. **Profile View Flow**
```
1. User navigates to /dashboard/profile
2. Fetch current user data (/api/auth/me)
3. Display user information
4. Show account settings options
```

---

## 📝 Data Models

### User Model
```
- id: UUID
- name: String
- email: Email (unique)
- hashed_password: String
- class_level: String
- target_exam: String
- role: String (default: "student")
- is_active: Boolean
- is_verified: Boolean
- selected_subject: Optional[String]
- selected_topic: Optional[String]
- created_at: DateTime
```

### UserActivity Model
```
- id: UUID
- user_id: UUID (FK to User)
- activity_type: String (exam, course, doubt, video, practice)
- title: String
- subject: String
- duration_seconds: Optional[Integer]
- score: Optional[Float]
- metadata: Optional[JSON]
- created_at: DateTime
```

### ExamAttempt Model
```
- id: UUID
- user_id: UUID (FK to User)
- subject: String
- topic: String
- total_questions: Integer
- correct_answers: Integer
- score: Float
- duration_seconds: Integer
- details: JSON (array of answer details)
- created_at: DateTime
```

---

## 🔐 Security Features

1. **Password Hashing**: Passwords are hashed using bcrypt
2. **JWT Authentication**: Secure token-based authentication
3. **CORS Configuration**: Configured to accept requests from frontend
4. **Email Validation**: Using pydantic EmailStr
5. **Token Expiration**: Access tokens expire after configured time

---

## ✨ Virtual Teacher Topics

The Virtual Teacher currently supports:

### Physics
- Modern Physics (Photoelectric Effect)
- Rotational Dynamics

### Chemistry
- Coordination Compounds

### Mathematics
- Definite Integration
- Probability

Topics can be easily extended by adding more content to the `topicContent` object in `VirtualTeacher.tsx`.

---

## 🧪 Testing the System

### 1. Test Sign-Up
```bash
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Student",
    "email": "test@example.com",
    "password": "password123",
    "class_level": "12",
    "target_exam": "JEE Advanced"
  }'
```

### 2. Test Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Test Get Current User
```bash
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Test Log Activity
```bash
curl -X POST http://localhost:8000/api/student/activity \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "activity_type": "course",
    "title": "Modern Physics Lecture",
    "subject": "Physics"
  }'
```

---

## 📦 Frontend Components

### Pages
- **Login.tsx** - Authentication page (signup/login)
- **Dashboard.tsx** - Main dashboard with stats and activity
- **Profile.tsx** - User profile page
- **Courses.tsx** - Course list and management

### Components
- **VirtualTeacher.tsx** - Interactive virtual teacher modal
- **DashboardNavbar.tsx** - Navigation bar for dashboard
- **Navbar.tsx** - Main navigation bar

### Services
- **api.ts** - Centralized API client service

---

## 🔄 Data Persistence

### Stored in Database
- User accounts and profiles
- Exam attempts and scores
- User activities
- Question bank

### Stored in localStorage (Fallback)
- JWT token
- Current user data
- User activities (if backend unavailable)

---

## 🎓 How to Extend

### Add New Topic to Virtual Teacher
1. Open `VirtualTeacher.tsx`
2. Add topic content to `topicContent` object:
```typescript
"New Subject": {
  "New Topic": {
    title: "...",
    explanation: "...",
    examples: [...],
    formulas: [...],
    tips: [...],
    relatedTopics: [...]
  }
}
```

### Add New Activity Type
1. Update `StudentActivity` interface in `api.ts`
2. Add activity type to backend `UserActivity` model
3. Log activities using `api.logActivity()`

### Add New Progress Metric
1. Update `ProgressSummary` schema in backend
2. Implement calculation in `get_progress_summary()` function
3. Display in Dashboard component

---

## 🐛 Troubleshooting

### Frontend can't connect to backend
1. Verify backend is running on http://localhost:8000
2. Check `.env` file has correct `VITE_API_URL`
3. Check CORS configuration in `main.py`

### Login fails
1. Verify user email and password
2. Check database is created (SQLite file exists)
3. Check JWT secret in `.env`

### Activities not saving
1. Check backend is running
2. Verify API token is valid
3. Check localStorage has the token

### Virtual Teacher audio not working
1. Check browser supports Web Speech API
2. Verify audio permissions are granted
3. Check browser console for errors

---

## 📊 Performance Considerations

- Activities are cached with pagination (max 50)
- Dashboard loads 5 recent activities for performance
- Progress summary uses aggregation for fast calculation
- JWT tokens expire for security

---

## 🚀 Future Enhancements

- [ ] Offline mode support
- [ ] Advanced analytics dashboard
- [ ] Peer learning features
- [ ] AI-powered doubt resolution
- [ ] Mobile app integration
- [ ] Video streaming for courses
- [ ] Real-time leaderboard
- [ ] Custom quiz generation

---

## 📞 Support

For issues or questions, please check:
1. Backend logs in terminal
2. Browser console for frontend errors
3. Network tab in browser DevTools
4. SQLite database for data integrity

---

## ✅ Implementation Checklist

- ✅ User authentication with signup/login
- ✅ JWT token management
- ✅ User profile display
- ✅ Dashboard with real data
- ✅ Activity tracking and logging
- ✅ Virtual teacher with explanations
- ✅ Course management
- ✅ Progress tracking
- ✅ API service layer
- ✅ Database models
- ✅ CORS configuration
- ✅ Error handling
- ✅ Fallback to localStorage

---

**Last Updated**: June 2026
**Version**: 1.0.0
