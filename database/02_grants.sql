-- ============================================================
-- BankCash — Paso 2: Otorgar privilegios
-- Ejecutar conectado a la base de datos "bankcash" como superusuario
--
-- En psql:
--   psql -U postgres -d bankcash -f database/02_grants.sql
--
-- En pgAdmin:
--   Query Tool conectado a "bankcash" > ejecutar este archivo
-- ============================================================

GRANT ALL PRIVILEGES ON DATABASE bankcash TO bankcash_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO bankcash_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO bankcash_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO bankcash_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO bankcash_user;

-- Confirmar
DO $$
BEGIN
  RAISE NOTICE 'Privilegios otorgados a bankcash_user sobre la base de datos bankcash.';
END
$$;
