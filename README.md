<div align="center">

# ⚙️ WorkOS

### Modern Workforce Management Platform — Built with React, Django, TypeScript & Tailwind

![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Django](https://img.shields.io/badge/Django-Backend-092E20?style=for-the-badge&logo=django&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Bundler-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-Utility_First-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

**A full-stack HR & workforce operating system featuring dashboards, attendance analytics, task tracking, user authentication, and beautiful UI using shadcn-ui.**

[📖 Documentation](#features) • [🐛 Report Bug](https://github.com/TanayV24/workos/issues) • [💡 Request Feature](https://github.com/TanayV24/workos/issues)

</div>

---

## ✨ Features

### 👩‍💼 Workforce Management  
- 📊 **Admin Dashboard** with KPIs & analytics  
- 🕒 **Attendance Visualization**  
- 📅 **Leave Balance Tracking**  
- 📘 **Task Progress Monitoring**  
- 🧾 **Recent Activity Feed**  

### 🔐 Authentication  
- Secure **Django-based auth system**  
- Context-based **Auth Provider** in React  
- Protected pages & redirect logic  

### 🎨 UI/UX  
- shadcn-ui component library  
- Fully responsive dashboards  
- Clean, minimal design  
- Reusable layouts & components  

### ⚙️ Developer-Friendly  
- Vite + TypeScript for blazing fast DX  
- Modular Django architecture  
- API-ready backend for future expansion  
- Scalable component structure in React  

---

## 🛠 Tech Stack

<table>
<tr>
<td width="50%" valign="top">

### Frontend  
- React 18  
- TypeScript  
- Vite  
- TailwindCSS  
- shadcn-ui  
- Context API  
- Chart.js (for analytics)

</td>
<td width="50%" valign="top">

### Backend  
- Django  
- Django REST-friendly architecture  
- Python 3.x  
- Modular apps: users, companies  
- Database via Django ORM  

</td>
</tr>
</table>

---

## 📁 **Project Structure (Exact — from your repository)**  

### 🔷 **Root Directory**
```

/workos-main
├── backend/
├── public/
├── src/
├── .gitignore
├── README.md
├── bun.lockb
├── components.json
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts

```

---

## 🟩 **Backend — Django Structure**
```

backend/
├── manage.py
├── requirements.txt
│
├── companies/
│   ├── migrations/
│   │   └── **init**.py
│   ├── **init**.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── serializers.py
│   ├── tests.py
│   ├── urls.py
│   └── views.py
│
├── users/
│   ├── migrations/
│   │   └── **init**.py
│   ├── **init**.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── tests.py
│   └── views.py
│
└── workos/
├── **init**.py
├── asgi.py
├── middleware.py
├── settings.py
├── urls.py
└── wsgi.py

```

---

## 🟦 **Frontend — React + Vite + TS Structure**  
```

src/
├── App.css
├── App.tsx
├── index.css
├── main.tsx
├── vite-env.d.ts
│
├── components/
│   ├── NavLink.tsx
│   │
│   ├── dashboard/
│   │   ├── AttendanceChart.tsx
│   │   ├── KPICard.tsx
│   │   ├── LeaveBalance.tsx
│   │   ├── RecentActivity.tsx
│   │   └── TaskProgress.tsx
│   │
│   ├── landing/
│   │   ├── CTASection.tsx
│   │   ├── DeepDiveAttendance.tsx
│   │   ├── FeatureHighlights.tsx
│   │   ├── PoweredBySection.tsx
│   │   ├── WhyWorkOSSection.tsx
│   │   └── WorkflowSection.tsx
│   │
│   ├── layout/
│   │   ├── DashboardLayout.tsx
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   │
│   └── ui/   # shadcn-ui components
│       ├── accordion.tsx
│       ├── alert-dialog.tsx
│       ├── alert.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── progress.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       ├── toast.tsx
│       ├── toggle-group.tsx
│       ├── toggle.tsx
│       ├── tooltip.tsx
│       └── use-toast.ts
│
├── contexts/
│   └── AuthContext.tsx
│
├── hooks/
│   ├── use-mobile.tsx
│   └── use-toast.ts
│
├── lib/
│   └── utils.ts
│
├── pages/
│   ├── AdminDashboard.tsx
│   ├── Attendance.tsx
│   ├── Dashboard.tsx
│   ├── Employee.tsx
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── NotFound.tsx
│   ├── Settings.tsx
│   └── Tasks.tsx
│
└── types/
└── workos.ts

````

---

## ⚙️ Installation & Setup

### 🔧 Backend (Django)
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
````

Backend runs at:

```
http://127.0.0.1:8000
```

---

### 🎨 Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```
