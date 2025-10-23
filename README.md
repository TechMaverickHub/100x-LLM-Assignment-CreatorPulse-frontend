# 🎨 Creator Pulse Frontend – AI-Powered Newsletter Dashboard (LLM Assignment)

Creator Pulse Frontend is a **React-based user interface** for the *Creator Pulse AI Newsletter System*.  
It allows users and superadmins to manage topics, sources, newsletters, and templates with an elegant, responsive design.

> 🧩 Built as part of the **100x GenAI Cohort – LLM Engineering Module**

---

## 🧭 Overview

The frontend provides a seamless interface that connects to the **Django REST API backend** of Creator Pulse.  
It helps users personalize their newsletter experience while superadmins manage analytics and content sources.

---

## 📌 Core Features

### 👤 **User Dashboard**
- Displays **credits remaining**, **topics selected**, **newsletter count**, and **reading streak**
- Quick view of **latest newsletters** and personalized stats

### 🧠 **Topic Management**
- Browse and select preferred topics for AI-curated newsletters
- Instantly update preferences synced with backend APIs

### 📰 **Sources**
- View all content sources related to selected topics
- Filter by name, URL, or source type

### ✍️ **Style Sample Upload**
- Upload short writing snippets to influence newsletter voice and tone

### 💌 **Newsletter Generator**
- Generate AI newsletters with live HTML preview
- Send newsletters via integrated backend (Resend API)
- Supports saving newsletters as templates and creating multiple drafts
- Inline diff comparison between two drafts

### 🧾 **Templates and Drafts**
- View and manage all saved templates
- Access all drafts for a selected template
- Send or schedule newsletters with chosen frequency

### 📅 **Newsletter History**
- Displays sent and scheduled newsletters with timestamps and statuses

### 🧑‍💼 **Superadmin Panel**
- Access analytics: user growth, newsletter trends, and source metrics
- Manage users and sources directly from the admin dashboard

---

## ⚙️ Tech Stack

| Tool / Library | Description |
|----------------|-------------|
| **React 19** | Frontend library |
| **Redux Toolkit** | State management |
| **React Router DOM** | Client-side routing |
| **Axios** | API communication with Django backend |
| **TailwindCSS** | Styling and layout |
| **Lucide React** | Icon components |
| **Recharts** | Data visualization |
| **Vite** | Fast build tool and development server |

---

## 🚀 Getting Started

### 🔁 1. Clone the Repository

```bash
git clone https://github.com/TechMaverickHub/100x-LLM-Assignment-CreatorPulse-frontend.git
cd 100x-LLM-Assignment-CreatorPulse-frontend
```

---

### 📦 2. Install Dependencies

```bash
yarn install
```

---

### 🧪 3. Run Development Server

```bash
yarn dev
```

Access the app at:  
👉 `http://localhost:5173/`

---

### 🏗️ 4. Build for Production

```bash
yarn build
```

Preview the production build:

```bash
yarn preview
```

---

## 🔌 Backend Integration

This frontend connects to the **Django REST API backend**:  
👉 [Creator Pulse Backend Repo](https://github.com/TechMaverickHub/100x-LLM-Assignment-CreatorPulse)

- JWT-based Authentication  
- Newsletter Generation APIs  
- Template Management  
- Analytics and Dashboard APIs  

---

## 🎥 Demo Recording

Loom Demo: [https://www.loom.com/share/c00678288d824f999cf4f1507232346f](https://www.loom.com/share/c00678288d824f999cf4f1507232346f)

---

## 🧠 Assignment Context

Developed as part of the **100x GenAI Cohort – LLM Engineering Module** to demonstrate the integration of:  
- AI personalization workflows  
- REST API-based newsletter automation  
- Modern UI/UX practices with Tailwind and React  

---

## 🚧 Future Enhancements

- 🌙 Dark mode support  
- 📈 More detailed analytics charts  
- 🧩 Improved WYSIWYG editor for newsletter drafts  
- 🗓️ Enhanced scheduling and reminder UI  

---

## 🧾 License

This project is part of an educational module and is not licensed for commercial use.  
For learning purposes only under the **100x GenAI Cohort**.
