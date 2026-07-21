-- ============================================================
-- BankCash — Paso 1: Crear usuario y base de datos
-- Ejecutar conectado a la base de datos "postgres" como superusuario
--
-- En psql:
--   psql -U postgres -f database/01_create_db.sql
--
-- En pgAdmin:
--   Query Tool conectado a "postgres" > ejecutar este archivo
-- ============================================================

-- 1. Crear el usuario de la aplicación (si no existe)
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'bankcash_user') THEN
    CREATE ROLE bankcash_user WITH LOGIN PASSWORD 'Tu_contraseña';
    RAISE NOTICE 'Usuario bankcash_user creado correctamente.';
  ELSE
    RAISE NOTICE 'El usuario bankcash_user ya existe, se omite.';
  END IF;
END
$$;

-- 2. Crear la base de datos
-- IMPORTANTE: Esta sentencia NO puede estar dentro de un bloque DO.
-- Si ya existe, PostgreSQL mostrará un error que puedes ignorar.
CREATE DATABASE bankcash OWNER bankcash_user;
