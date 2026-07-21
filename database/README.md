# Base de datos — Instrucciones de configuración

## Requisitos
- PostgreSQL 14 o superior instalado en Windows (instalador oficial)
- Acceso al usuario `postgres` (superusuario)

---

## Por qué hay dos scripts

`CREATE DATABASE` en PostgreSQL **no puede ejecutarse dentro de una transacción**.  
Por eso el proceso se divide en dos pasos que deben correr conectados a bases de datos distintas:

| Script | Conectado a | Qué hace |
|---|---|---|
| `01_create_db.sql` | `postgres` | Crea el usuario `bankcash_user` y la base de datos `bankcash` |
| `02_grants.sql` | `bankcash` | Otorga todos los privilegios al usuario |

---

## Opción A: psql (línea de comandos) — recomendado

Abre **SQL Shell (psql)** o PowerShell y ejecuta en orden:

```powershell
# Paso 1 — Crear usuario y base de datos (conectado a "postgres")
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -f "C:/Users/TU_USUARIO/Desktop/Proyecto-banckcash/database/01_create_db.sql"

# Paso 2 — Otorgar privilegios (conectado a "bankcash")
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -d bankcash -f "C:/Users/TU_USUARIO/Desktop/Proyecto-banckcash/database/02_grants.sql"
```

> Ajusta `16` por tu versión de PostgreSQL y `TU_USUARIO` por tu nombre de usuario de Windows.

---

## Opción B: pgAdmin (interfaz gráfica)

### Paso 1 — Crear usuario y base de datos

1. Abre **pgAdmin 4** y conéctate al servidor local con el usuario `postgres`.
2. Click derecho en el servidor → **Query Tool**.
3. Asegúrate de que la conexión apunte a la base de datos **`postgres`** (se ve en la barra superior).
4. Abre el archivo `database/01_create_db.sql` (**File → Open**) y ejecuta con **F5**.

### Paso 2 — Otorgar privilegios

1. En el panel izquierdo, expande **Databases** y haz click en **`bankcash`**.
2. Abre el **Query Tool** (ahora debe decir `bankcash` en la barra superior).
3. Abre el archivo `database/02_grants.sql` y ejecuta con **F5**.

---

## Configurar las variables de entorno del backend

Copia `backend/.env.example` a `backend/.env`:

```powershell
Copy-Item backend\.env.example backend\.env
```

Edita `backend/.env` con tus credenciales:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bankcash
DB_USER=bankcash_user
DB_PASSWORD=P-tech
```

---

## Crear las tablas (migraciones de TypeORM)

Una vez instaladas las dependencias del backend y el `.env` configurado:

```powershell
npm run migration:run --workspace=backend
```

---

## Estructura de la base de datos

| Tabla | Descripción |
|---|---|
| `users` | Usuarios registrados (id, name, email, password_hash) |
| `categories` | Categorías de gasto/ingreso por usuario (name, icon, color) |
| `transactions` | Ingresos y gastos (amount, type, date, category_id, user_id) |
