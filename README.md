<div align="center">

# ⚙️ workos

### A modern Vite + React + TypeScript starter with shadcn-ui & Tailwind (Lovable scaffold)

![Vite](https://img.shields.io/badge/Vite-Bundler-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Utility--First-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

**A Vite + React + TypeScript template generated via Lovable — includes shadcn-ui and Tailwind CSS for building modern UIs.** :contentReference[oaicite:1]{index=1}

</div>

---

## ✨ Quick overview

This repo is a Vite TypeScript + React project scaffold (Lovable deliverable) which includes utilities and configuration for Tailwind, shadcn-ui and a modern frontend stack. The project was generated using Lovable and contains the standard configuration files you expect for a TypeScript + Vite frontend. :contentReference[oaicite:2]{index=2}

---

## 🔎 Root file & folder listing 

```

/ (repo root)
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

````

(These top-level files/folders are the ones visible in the repository view.) :contentReference[oaicite:3]{index=3}

---

## ⚙️ Tech stack (inferred from config files)

- Vite (bundler) — `vite.config.ts`  
- React + TypeScript — `tsconfig.*.json` + `.tsx` support  
- Tailwind CSS — `tailwind.config.ts`, `postcss.config.js`  
- shadcn-ui (component primitives) — mentioned in repo description from Lovable  
- ESLint config — `eslint.config.js`  
- Other config files: `package.json`, `components.json`, `bun.lockb` (optional engine lockfile). :contentReference[oaicite:5]{index=5}

---

## 🚀 How to run (quick start)

```bash
# clone
git clone https://github.com/TanayV24/workos.git
cd workos

# install
npm install

# dev server
npm run dev
````

(These steps are standard for Vite + npm projects and match the project's Lovable-generated quickstart hints.) ([GitHub][1])



```
src/
├── components/            # Reusable UI components (Buttons, Icons, Layouts)
│   ├── ui/                # shadcn/ui primitives wrappers
│   └── common/
├── hooks/                 # Custom React hooks
├── pages/                 # Page views (Home, About, etc.)
├── routes/                # Router definitions (if using React Router)
├── services/              # API clients & utilities (fetch/axios wrappers)
├── styles/                # Global CSS / tailwind entry (index.css)
├── app/                   # App root / providers / theme (optional)
├── main.tsx               # Vite/React entry
└── app.css / index.css    # Tailwind imports + global styles
```

This layout is aligned with Vite + React TypeScript conventions and fits the repo’s config. Use it as a canonical structure for organizing components and pages.

