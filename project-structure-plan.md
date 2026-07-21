# BankCash — Project Structure Plan

## Top-Level Overview

**Goal:** Scaffold the complete folder and file structure for a personal expense-tracking banking app.  
**Stack:** React + Vite + TypeScript (frontend) · Node.js + Express + TypeScript (backend) · PostgreSQL + TypeORM (database) · JWT auth · Shadcn/ui + Tailwind CSS · Chart.js + react-chartjs-2  
**Approach:** Create all directories and base configuration files (package.json, tsconfig.json, env examples, etc.) so both the frontend and backend are ready to install dependencies and start development immediately. No business logic is implemented in this plan — only structure.

---

## Sub-Tasks

---

### Sub-Task 1 — Root-level configuration files

**Intent:** Set up shared tooling and documentation at the repo root so both packages follow consistent conventions.  
**Expected Outcomes:**
- `README.md` updated with project description and commands
- `.gitignore` covers Node, TypeScript, env files, and build outputs
- `package.json` (root) configured as a workspace with `frontend` and `backend` as packages

**Todo List:**
1. Update `.gitignore` with Node, TS, dist, .env patterns
2. Create root `package.json` with `workspaces: ["frontend", "backend"]` and useful scripts (`dev`, `build`)
3. Update `README.md` with project description, stack, and how to run

**Relevant Context:** `.gitignore` already exists at root (currently empty). `README.md` exists with minimal content.

**Status:** [x] done

---

### Sub-Task 2 — Backend: folder structure and configuration

**Intent:** Create all backend directories and base config files so Express + TypeScript + TypeORM can be bootstrapped without any structural decisions left open.

**Expected Outcomes:**
- `backend/` contains `src/` with module-based folder structure
- `tsconfig.json`, `package.json`, `.env.example` are present and valid
- All module folders exist: `auth`, `users`, `categories`, `transactions`, `reports`

**Todo List:**
1. Create `backend/package.json` with scripts (`dev`, `build`, `start`) and dependencies list (express, typeorm, pg, jsonwebtoken, bcryptjs, dotenv, cors — all with @types)
2. Create `backend/tsconfig.json` (target ES2020, module CommonJS, outDir `dist/`, decorators enabled for TypeORM)
3. Create `backend/.env.example` with: `PORT`, `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`
4. Create `backend/src/` with the following structure:
   ```
   src/
   ├── app.ts              # Express app setup (middlewares, routes)
   ├── server.ts           # Entry point (starts HTTP server)
   ├── data-source.ts      # TypeORM DataSource configuration
   ├── config/
   │   └── env.ts          # Typed env variable loader
   ├── middlewares/
   │   ├── auth.middleware.ts    # JWT verification middleware
   │   └── error.middleware.ts   # Global error handler
   ├── modules/
   │   ├── auth/
   │   │   ├── auth.controller.ts
   │   │   ├── auth.service.ts
   │   │   ├── auth.routes.ts
   │   │   └── dto/
   │   │       ├── register.dto.ts
   │   │       └── login.dto.ts
   │   ├── users/
   │   │   ├── user.entity.ts
   │   │   ├── user.controller.ts
   │   │   ├── user.service.ts
   │   │   └── user.routes.ts
   │   ├── categories/
   │   │   ├── category.entity.ts
   │   │   ├── category.controller.ts
   │   │   ├── category.service.ts
   │   │   └── category.routes.ts
   │   ├── transactions/
   │   │   ├── transaction.entity.ts
   │   │   ├── transaction.controller.ts
   │   │   ├── transaction.service.ts
   │   │   └── transaction.routes.ts
   │   └── reports/
   │       ├── reports.controller.ts
   │       ├── reports.service.ts
   │       └── reports.routes.ts
   └── shared/
       ├── types/
       │   └── express.d.ts    # Augment Request with user payload
       └── utils/
           └── response.ts     # Standardized API response helper
   ```
5. Create each file listed above with a minimal stub (no logic, just exports / TODO comments)

**Relevant Context:** `backend/` directory exists but is empty.

**Status:** [x] done

---

### Sub-Task 3 — Database: entity design reference file

**Intent:** Document the three core entities and their relationships in a single reference file inside the backend so developers have a clear data model to implement.

**Expected Outcomes:**
- `backend/src/shared/types/entities.md` describes all entities, fields, and relationships
- Entity stub files (`user.entity.ts`, `category.entity.ts`, `transaction.entity.ts`) contain TypeORM `@Entity` class skeletons with all column names as comments

**Entity Definitions:**

| Entity | Key Fields |
|--------|-----------|
| `users` | id (uuid), name, email (unique), password_hash, created_at |
| `categories` | id (uuid), name, icon, color, user_id (FK), created_at |
| `transactions` | id (uuid), amount (decimal), type (enum: income/expense), description, date, category_id (FK), user_id (FK), created_at |

**Todo List:**
1. Add TypeORM column skeletons to `user.entity.ts`
2. Add TypeORM column skeletons to `category.entity.ts` with `ManyToOne` relation to User
3. Add TypeORM column skeletons to `transaction.entity.ts` with `ManyToOne` to User and Category, and `type` enum
4. Create `backend/src/shared/types/entities.md` with entity diagram and field descriptions

**Relevant Context:** Entity files are created in Sub-Task 2 as stubs; this task fills in the column skeleton.

**Status:** [x] done

---

### Sub-Task 4 — Frontend: folder structure and configuration

**Intent:** Scaffold the React + Vite + TypeScript frontend with Tailwind CSS and Shadcn/ui configured, Chart.js installed, and all page/component directories in place.

**Expected Outcomes:**
- `frontend/` is a valid Vite + React + TypeScript project (via `create vite`)
- Tailwind CSS and Shadcn/ui are configured (`tailwind.config.ts`, `components.json`)
- Chart.js and react-chartjs-2 are listed as dependencies
- All page, component, and utility folders exist

**Todo List:**
1. Create `frontend/package.json` with all dependencies: react, react-dom, react-router-dom, chart.js, react-chartjs-2, tailwindcss, postcss, autoprefixer, shadcn/ui, axios, zustand (state), react-hook-form, zod
2. Create `frontend/tsconfig.json` and `frontend/tsconfig.node.json`
3. Create `frontend/vite.config.ts` with path alias `@/` pointing to `src/`
4. Create `frontend/tailwind.config.ts` with content paths for src
5. Create `frontend/postcss.config.js`
6. Create `frontend/index.html` (Vite entry HTML)
7. Create `frontend/.env.example` with `VITE_API_URL`
8. Create `frontend/src/` with the following structure:
   ```
   src/
   ├── main.tsx                  # React entry point
   ├── App.tsx                   # Router setup
   ├── index.css                 # Tailwind directives
   ├── assets/                   # Static assets (logo, icons)
   ├── components/
   │   ├── ui/                   # Shadcn/ui generated components go here
   │   ├── layout/
   │   │   ├── Sidebar.tsx
   │   │   ├── Header.tsx
   │   │   └── ProtectedRoute.tsx
   │   ├── charts/
   │   │   ├── ExpensesByCategoryChart.tsx   # Pie/Doughnut chart
   │   │   ├── MonthlyBalanceChart.tsx       # Bar chart income vs expense
   │   │   └── TrendLineChart.tsx            # Line chart over time
   │   └── shared/
   │       ├── TransactionCard.tsx
   │       ├── CategoryBadge.tsx
   │       └── LoadingSpinner.tsx
   ├── pages/
   │   ├── auth/
   │   │   ├── LoginPage.tsx
   │   │   └── RegisterPage.tsx
   │   ├── DashboardPage.tsx
   │   ├── TransactionsPage.tsx
   │   ├── CategoriesPage.tsx
   │   └── ReportsPage.tsx
   ├── hooks/
   │   ├── useAuth.ts
   │   ├── useTransactions.ts
   │   └── useCategories.ts
   ├── store/
   │   └── authStore.ts          # Zustand auth store (user, token)
   ├── services/
   │   ├── api.ts                # Axios instance with base URL + interceptors
   │   ├── auth.service.ts
   │   ├── transactions.service.ts
   │   ├── categories.service.ts
   │   └── reports.service.ts
   ├── types/
   │   ├── user.types.ts
   │   ├── transaction.types.ts
   │   ├── category.types.ts
   │   └── api.types.ts          # Generic ApiResponse<T> type
   └── lib/
       └── utils.ts              # cn() helper for Shadcn
   ```
9. Create each file as a minimal stub with correct imports and TODO comments

**Relevant Context:** `frontend/` directory exists but is empty.

**Status:** [x] done

---

### Sub-Task 5 — Local PostgreSQL connection and database setup files

**Intent:** Configure the TypeORM `DataSource` to connect to a locally installed PostgreSQL instance on Windows, and provide a SQL initialization script so the developer can create the database with one command — no Docker required.

**Expected Outcomes:**
- `backend/src/data-source.ts` is fully configured with TypeORM `DataSource` reading from env variables
- `backend/.env.example` includes individual connection variables: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `database/init.sql` script creates the `bankcash` database and role
- `database/README.md` explains how to run the script using `psql` on Windows (pgAdmin alternative also mentioned)

**Todo List:**
1. Create `database/` folder at root with `init.sql` — SQL script that creates the database and user role
2. Create `database/README.md` with step-by-step instructions to run the script via `psql` on Windows, plus pgAdmin alternative
3. Update `backend/.env.example` to use individual variables: `DB_HOST=localhost`, `DB_PORT=5432`, `DB_NAME=bankcash`, `DB_USER`, `DB_PASSWORD`
4. Fill in `backend/src/data-source.ts` with TypeORM `DataSource` configuration using individual env variables, entities glob pointing to all `*.entity.ts` files, `synchronize: false`, and `migrations` folder path

**Relevant Context:** `data-source.ts` stub created in Sub-Task 2; this task fills in real TypeORM config. PostgreSQL is installed directly on Windows via the official installer.

**Status:** [x] pending

---

## Final Directory Tree (Expected Result)

```
Proyecto-banckcash/
├── package.json              # root workspace
├── .gitignore
├── README.md
├── project-structure-plan.md
├── database/
│   ├── init.sql              # Script SQL para crear DB y usuario
│   └── README.md             # Instrucciones para ejecutar con psql o pgAdmin
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── src/
│       ├── app.ts
│       ├── server.ts
│       ├── data-source.ts
│       ├── config/env.ts
│       ├── middlewares/
│       ├── modules/
│       │   ├── auth/
│       │   ├── users/
│       │   ├── categories/
│       │   ├── transactions/
│       │   └── reports/
│       └── shared/
└── frontend/
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── tailwind.config.ts
    ├── postcss.config.js
    ├── index.html
    ├── .env.example
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── components/
        ├── pages/
        ├── hooks/
        ├── store/
        ├── services/
        ├── types/
        └── lib/
```
