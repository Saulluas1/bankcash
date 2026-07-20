# BankCash 💳

Aplicación de banca personal para el control y registro de ingresos y gastos, con categorización automática para detectar patrones de gasto innecesario.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + Vite + TypeScript |
| UI | Shadcn/ui + Tailwind CSS |
| Gráficas | Chart.js + react-chartjs-2 |
| Backend | Node.js + Express + TypeScript |
| ORM | TypeORM |
| Base de datos | PostgreSQL |
| Autenticación | JWT (registro + login propio) |

---

## Estructura del proyecto

```
Proyecto-banckcash/
├── backend/          # API REST (Node.js + Express + TypeORM)
├── frontend/         # App web (React + Vite)
├── database/         # Scripts SQL de inicialización
└── package.json      # Workspace raíz
```

---

## Requisitos previos

- Node.js >= 18
- npm >= 9
- PostgreSQL >= 14 (instalado localmente)

---

## Configuración inicial

### 1. Clonar e instalar dependencias

```bash
git clone <repo-url>
cd Proyecto-banckcash
npm install
```

### 2. Crear la base de datos

Sigue las instrucciones en [`database/README.md`](database/README.md).

### 3. Configurar variables de entorno

```bash
# Backend
cp backend/.env.example backend/.env
# Edita backend/.env con tus credenciales de PostgreSQL

# Frontend
cp frontend/.env.example frontend/.env
```

### 4. Iniciar en modo desarrollo

```bash
# Terminal 1 — Backend (puerto 3000)
npm run dev:backend

# Terminal 2 — Frontend (puerto 5173)
npm run dev:frontend
```

---

## Módulos de la aplicación

- **Auth** — Registro e inicio de sesión con JWT
- **Dashboard** — Resumen de ingresos, gastos y balance mensual
- **Transacciones** — Registro de ingresos y gastos con categoría
- **Categorías** — CRUD de categorías personalizadas (con ícono y color)
- **Reportes** — Gráficas de gasto por categoría, tendencias y comparativas mensuales
