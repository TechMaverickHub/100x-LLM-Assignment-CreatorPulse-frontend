# 🧠 AI Newsletter Frontend — PRD (for Cursor React App Generation)

## 1. Overview
The **AI Newsletter Frontend** is a React-based web app that interfaces with the Django REST API backend.  
It enables users to register/login, select AI-related topics, and receive personalized newsletters automatically generated daily.

---

## 2. Tech Stack

| Layer | Technology |
|-------|-------------|
| **Framework** | React 18 / Next.js (optional) |
| **State Management** | Redux Toolkit or Zustand |
| **UI Components** | Tailwind CSS + shadcn/ui |
| **Routing** | React Router DOM |
| **Auth** | JWT (stored in localStorage) |
| **API Layer** | Axios-based service abstraction |
| **Build Tool** | Vite (or CRA) |
| **Deployment** | Static hosting (e.g. Netlify/Vercel) |

---

## 3. Goals & Objectives

### ✅ MVP Goals
- JWT-based login/logout and registration
- Role-based access (User / Superadmin)
- User dashboard to select preferred topics
- Superadmin dashboard for managing sources
- Daily newsletter view (fetched from backend)
- Reusable components and clean modular structure

### 🎯 Future Enhancements
- Email analytics dashboard (open rates, topic popularity)
- OAuth login (Google)
- Real-time newsletter generation progress

---

## 4. User Roles & Experiences

| Role | Access Level | Key Screens |
|------|---------------|-------------|
| **User** | Standard | Login, Topic Selection, Newsletter Feed |
| **Superadmin** | Full CRUD | Source Management, Topic Overview |

---

## 5. Application Routes

| Route | Role | Description |
|-------|------|-------------|
| `/login` | Public | JWT login page |
| `/register` | Public (optional) | Registration page |
| `/dashboard` | User | Main landing page post-login |
| `/topics` | User | Topic selection interface |
| `/newsletter` | User | View latest newsletter (auto-generated) |
| `/admin/sources` | Superadmin | Manage content sources (CRUD) |
| `/admin/topics` | Superadmin | View/edit topic list (optional) |

---

## 6. UI Components

- **LoginPage.jsx** – handles login and JWT storage  
- **Dashboard.jsx** – shows selected topics and CTA to newsletter  
- **TopicsPage.jsx** – fetches and updates topics  
- **NewsletterPage.jsx** – displays newsletter feed  
- **SourcesList.jsx / SourceForm.jsx** – CRUD for admin  
- **Navbar / Sidebar / ProtectedRoute** – shared layout and route protection

---

## 7. API Integration (Axios)

```js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

---

## 8. State Management (Redux Toolkit)

**Slices:**
- `authSlice.js`: handles login/logout, user info
- `topicSlice.js`: stores topics and preferences
- `sourceSlice.js`: CRUD for sources (superadmin)

---

## 9. UI Styling Guidelines
- Tailwind + shadcn/ui
- Rounded cards, soft shadows
- Warm neutral palette (earthy tones)
- Lucide icons

---

## 10. Folder Structure

```
src/
 ├── assets/
 ├── components/
 ├── pages/
 ├── services/
 ├── store/
 ├── hooks/
 ├── App.jsx
 └── main.jsx
```

---

## 11. Build Commands

```bash
npm install
npm run dev
npm run build
```

---

## 12. Deliverables
✅ Fully functional React web app integrated with DRF backend  
✅ JWT-secured routes  
✅ Role-based dashboard views  
✅ Modular, scalable architecture
