# BankCash — Database Setup & Migrations Plan

## Top-Level Overview

**Goal:** Levantar PostgreSQL localmente, ejecutar los scripts de inicialización, verificar la conexión TypeORM, y generar + correr las migraciones iniciales para que las tablas `users`, `categories`, y `transactions` existan en la base de datos.

**Approach:** Paso a paso: primero la DB y el usuario en PostgreSQL, luego el `.env` local configurado, luego verificar que TypeORM se conecta, y finalmente generar y correr las migraciones desde las entidades existentes.

**Stack relevante:** PostgreSQL 14+ (instalado en Windows) · TypeORM · ts-node · `backend/package.json` scripts

---

## Sub-Tasks

---

### Sub-Task 1 — Ejecutar scripts SQL de inicialización en PostgreSQL

**Intent:** Crear el usuario `bankcash_user` y la base de datos `bankcash` en PostgreSQL local usando los scripts ya existentes en `database/`.

**Expected Outcomes:**
- Usuario `bankcash_user` existe en PostgreSQL con contraseña
- Base de datos `bankcash` existe y tiene como owner al usuario correcto
- Privilegios sobre tablas y secuencias otorgados

**Todo List:**
1. Abrir pgAdmin 4 y conectarse al servidor local con el usuario `postgres`
2. Abrir el Query Tool (clic derecho en el servidor → Query Tool)
3. Abrir y ejecutar el contenido de `database/01_create_db.sql` — crea el rol `bankcash_user` y la base de datos `bankcash`
4. Cambiar la conexión al database `bankcash` y ejecutar el contenido de `database/02_grants.sql` — otorga privilegios
5. Verificar en el panel izquierdo de pgAdmin que la DB `bankcash` aparece bajo el servidor

**Relevant Context:**
- [`database/01_create_db.sql`](database/01_create_db.sql) — crea rol y base de datos
- [`database/02_grants.sql`](database/02_grants.sql) — otorga privilegios
- [`database/README.md`](database/README.md) — instrucciones detalladas con alternativa pgAdmin
- La contraseña del usuario está en `database/init.sql` como referencia

**Status:** [x] done

---

### Sub-Task 2 — Configurar el archivo `.env` local del backend

**Intent:** Crear `backend/.env` con las credenciales reales de la instancia local de PostgreSQL y los secrets JWT, para que TypeORM pueda conectarse.

**Expected Outcomes:**
- `backend/.env` existe (ya no está vacío o ausente)
- Todas las variables requeridas por [`backend/src/config/env.ts`](backend/src/config/env.ts) tienen valor
- El archivo NO está en git (ya está en `.gitignore`)

**Todo List:**
1. El `backend/.env` ya existe con las credenciales correctas — verificar que contiene:
   - `DB_HOST=localhost`, `DB_PORT=5432`, `DB_NAME=bankcash`, `DB_USER=bankcash_user`, `DB_PASSWORD` con el valor correcto
   - `JWT_SECRET` y `JWT_REFRESH_SECRET` con valores definidos
   - `PORT=3000`, `NODE_ENV=development`
2. No es necesario crear ni modificar el archivo — solo confirmar visualmente que los valores coinciden con los usados en Sub-Task 1

**Relevant Context:**
- [`backend/.env.example`](backend/.env.example) — plantilla con todas las variables
- [`backend/src/config/env.ts`](backend/src/config/env.ts) — define qué variables se leen y sus defaults
- [`database/01_create_db.sql`](database/01_create_db.sql) — tiene la contraseña del usuario `bankcash_user`

**Status:** [x] done

---

### Sub-Task 3 — Instalar dependencias del backend

**Intent:** Asegurarse de que `node_modules` del backend está instalado antes de intentar correr TypeORM o el servidor.

**Expected Outcomes:**
- `backend/node_modules/` existe con todos los paquetes listados en `backend/package.json`
- `npm install` no lanza errores de peer dependencies bloqueantes

**Todo List:**
1. Desde la raíz del repo, ejecutar `npm install --workspace=backend`
2. Verificar que no hay errores críticos en la salida
3. Confirmar que `typeorm` y `ts-node` están disponibles en `backend/node_modules/.bin/`

**Relevant Context:**
- [`backend/package.json`](backend/package.json) — lista completa de dependencias (express, typeorm, pg, bcryptjs, jsonwebtoken, etc.)
- [`backend/tsconfig.json`](backend/tsconfig.json) — configuración TS con decoradores habilitados (requerido por TypeORM)

**Status:** [x] done

---

### Sub-Task 4 — Crear la carpeta de migraciones y verificar conexión TypeORM

**Intent:** Crear el directorio `backend/src/migrations/` que el `DataSource` referencia, y probar que TypeORM puede conectarse a la base de datos correctamente.

**Expected Outcomes:**
- `backend/src/migrations/` existe (aunque vacío)
- `npm run migration:run` corre sin error de conexión y responde "No migrations are pending"
- Si hay error, se documenta y se resuelve antes de continuar

**Todo List:**
1. Crear la carpeta `backend/src/migrations/` (puede estar vacía, solo necesita existir para que TypeORM no falle al buscar migraciones)
2. Desde `backend/`, ejecutar `npm run migration:run` para verificar que la conexión funciona
3. Si la conexión falla, diagnosticar: revisar `.env`, verificar que PostgreSQL está corriendo con `Get-Service postgresql*` en PowerShell

**Nota sobre comandos TypeORM:** Los scripts en `package.json` ya incluyen `-d src/data-source.ts` internamente. Usar siempre `npm run migration:run` / `npm run migration:generate` — **nunca** pasar `dataSource=` como argumento suelto (sintaxis incorrecta). Si se necesita invocar `typeorm` directamente, el flag va después del subcomando: `npm run typeorm -- migration:show -d src/data-source.ts`.

**Relevant Context:**
- [`backend/src/data-source.ts`](backend/src/data-source.ts) — referencia `src/migrations/**/*.{ts,js}`
- [`backend/package.json`](backend/package.json) — scripts `migration:run`, `migration:generate`, `migration:revert` ya configurados con `-d src/data-source.ts`
- En Windows, PostgreSQL corre como servicio — verificar con `Get-Service postgresql*` en PowerShell

**Status:** [x] done

---

### Sub-Task 5 — Generar y correr la migración inicial

**Intent:** Generar una migración a partir de las entidades existentes (`User`, `Category`, `Transaction`) y ejecutarla para que las tres tablas sean creadas en la base de datos `bankcash`.

**Expected Outcomes:**
- Un archivo de migración existe en `backend/src/migrations/` (e.g., `1234567890-InitialSchema.ts`)
- Las tablas `users`, `categories`, y `transactions` existen en PostgreSQL
- La tabla `migrations` de TypeORM registra la migración como aplicada
- `psql -U bankcash_user -d bankcash -c "\dt"` muestra las 3 tablas

**Todo List:**
1. Desde `backend/`, ejecutar el script de generación:
   ```
   npm run migration:generate -- src/migrations/InitialSchema
   ```
2. Revisar el archivo generado en `backend/src/migrations/` y confirmar que el SQL de `up()` crea las 3 tablas con las columnas correctas
3. Ejecutar la migración:
   ```
   npm run migration:run
   ```
4. Verificar en pgAdmin que las tablas `users`, `categories`, `transactions` y `migrations` aparecen bajo `bankcash → Schemas → public → Tables`

**Relevant Context:**
- [`backend/src/modules/users/user.entity.ts`](backend/src/modules/users/user.entity.ts) — entidad User con UUID, email único, timestamps
- [`backend/src/modules/categories/category.entity.ts`](backend/src/modules/categories/category.entity.ts) — entidad Category con FK a User
- [`backend/src/modules/transactions/transaction.entity.ts`](backend/src/modules/transactions/transaction.entity.ts) — entidad Transaction con enum type, FK a User y Category
- [`backend/src/data-source.ts`](backend/src/data-source.ts) — `synchronize: false`, migrations apuntan a `src/migrations/**`
- [`backend/package.json`](backend/package.json) — scripts `migration:generate` y `migration:run` ya definidos

**Status:** [x] done

---

## Orden de ejecución

```
Sub-Task 1 → Sub-Task 2 → Sub-Task 3 → Sub-Task 4 → Sub-Task 5
(PostgreSQL)   (.env)      (npm install)  (conexión)   (migraciones)
```

Cada sub-task depende de la anterior. No se puede generar migraciones sin conexión, y no hay conexión sin `.env` correcto.
