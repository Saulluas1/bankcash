-- ============================================================
-- BankCash — Script de inicialización de la base de datos
-- Compatible con pgAdmin y psql
-- Ejecutar conectado al servidor como superusuario (postgres)
-- ============================================================

-- 1. Crear el usuario de la aplicación (si no existe)
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'bankcash_user') THEN
    CREATE ROLE bankcash_user WITH LOGIN PASSWORD 'P-tech';
  END IF;
END
$$;

-- 2. Crear la base de datos (si no existe)
-- NOTA: En pgAdmin este bloque DO crea la DB dentro de una transacción.
-- Si ya existe, el bloque simplemente no hace nada.
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'bankcash') THEN
    PERFORM dblink_exec('dbname=' || current_database(), 'CREATE DATABASE bankcash OWNER bankcash_user');
  END IF;
EXCEPTION WHEN others THEN
  -- dblink puede no estar disponible; en ese caso crea la DB manualmente
  -- desde pgAdmin: click derecho en Databases > Create > Database...
  RAISE NOTICE 'No se pudo crear la base de datos automáticamente. Créala manualmente con nombre "bankcash" y owner "bankcash_user".';
END
$$;

-- ============================================================
-- PASOS MANUALES si el bloque anterior muestra el NOTICE:
--
--   1. En pgAdmin, click derecho en Databases > Create > Database
--      Name: bankcash
--      Owner: bankcash_user
--      Guardar.
--
--   2. Abre el Query Tool conectado a la base de datos "bankcash"
--      y ejecuta solo el bloque de GRANT que sigue abajo.
-- ============================================================

-- 3. Otorgar privilegios sobre la base de datos "bankcash"
--    (Ejecutar conectado a la base de datos "bankcash")
GRANT ALL PRIVILEGES ON DATABASE bankcash TO bankcash_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO bankcash_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO bankcash_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO bankcash_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO bankcash_user;

-- ============================================================
-- Las tablas serán creadas por las migraciones de TypeORM.
-- Ejecuta desde la raíz del proyecto:
--   npm run migration:run --workspace=backend
-- ============================================================
