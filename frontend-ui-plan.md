# BankCash — Frontend UI (Mock Data) Plan

## Top-Level Overview

**Goal:** Implementar las 4 páginas principales (`DashboardPage`, `TransactionsPage`, `CategoriesPage`, `ReportsPage`) con datos mock estáticos, dejando la app completamente navegable y visualmente funcional sin depender del backend.

**Scope:** Solo las 4 páginas stub. Todo lo demás ya está implementado:
- Layout (Sidebar, Header, ProtectedRoute) ✅
- Componentes compartidos (TransactionCard, CategoryBadge, LoadingSpinner) ✅
- Componentes de charts (Doughnut, Bar, Line) ✅
- Auth pages (Login, Register) ✅
- Types, store, utils ✅

**Approach:** Cada página usará datos mock definidos localmente (arrays estáticos tipados). No se tocan servicios ni hooks de API — eso se conecta en el plan de integración backend. El `ProtectedRoute` ya existe y funciona; para navegar sin auth durante desarrollo se maneja con el store de Zustand.

**Stack relevante:** React + TypeScript · Tailwind CSS · Shadcn/ui CSS vars · Chart.js via react-chartjs-2 · Zustand (authStore ya configurado)

---

## Sub-Tasks

---

### Sub-Task 1 — DashboardPage: resumen mensual + gráfica + transacciones recientes

**Intent:** Implementar la página principal con tres secciones: tarjetas de resumen (ingresos, gastos, balance), gráfica de gastos por categoría (doughnut), y lista de transacciones recientes.

**Expected Outcomes:**
- La página muestra 3 summary cards: total ingresos, total gastos, balance neto del mes
- `ExpensesByCategoryChart` renderiza con datos mock de categorías
- Lista de las últimas 5 transacciones usando `TransactionCard`
- Layout correcto: cards arriba, chart y transacciones en grid abajo

**Mock Data needed:**
```ts
// Resumen mensual
{ income: 15000, expense: 8450, balance: 6550 }

// CategorySummary[] para el doughnut
[
  { categoryName: 'Comida', total: 3200, categoryColor: '#f97316' },
  { categoryName: 'Transporte', total: 1800, categoryColor: '#3b82f6' },
  { categoryName: 'Entretenimiento', total: 950, categoryColor: '#a855f7' },
  { categoryName: 'Salud', total: 500, categoryColor: '#22c55e' },
]

// Transaction[] recientes (5 items)
// usar tipos de transaction.types.ts
```

**Todo List:**
1. Definir los datos mock como constantes tipadas dentro del archivo de la página
2. Implementar las 3 summary cards (income/expense/balance) con iconos emoji y colores apropiados
3. Montar `ExpensesByCategoryChart` con los mock data de categorías
4. Renderizar las últimas 5 transacciones mock usando `TransactionCard`
5. Ajustar el layout con grid de Tailwind para que sea responsive

**Relevant Context:**
- [`frontend/src/pages/DashboardPage.tsx`](frontend/src/pages/DashboardPage.tsx) — stub a reemplazar
- [`frontend/src/components/charts/ExpensesByCategoryChart.tsx`](frontend/src/components/charts/ExpensesByCategoryChart.tsx) — recibe `CategorySummary[]`
- [`frontend/src/components/shared/TransactionCard.tsx`](frontend/src/components/shared/TransactionCard.tsx) — props: amount, type, description, date, categoryName, categoryColor
- [`frontend/src/lib/utils.ts`](frontend/src/lib/utils.ts) — `formatCurrency`, `formatDate` disponibles
- [`frontend/src/types/transaction.types.ts`](frontend/src/types/transaction.types.ts) — tipo `Transaction`

**Status:** [ ] pending

---

### Sub-Task 2 — TransactionsPage: listado con filtros y modal de crear transacción

**Intent:** Implementar la página de transacciones con un listado completo, barra de filtros (tipo income/expense), y un formulario modal para agregar una nueva transacción (solo UI, sin llamada API).

**Expected Outcomes:**
- Lista de ~8 transacciones mock usando `TransactionCard`
- Filtro de tipo (Todos / Ingresos / Gastos) que filtra el listado visualmente
- Botón "Nueva transacción" que abre un modal con formulario (amount, type, description, date, category)
- El modal tiene validación básica con react-hook-form + zod
- Al guardar el modal, la transacción se agrega al estado local (useState)

**Mock Data needed:**
```ts
// Transaction[] con variedad de income/expense, distintas categorías
// ~8 transacciones de los últimos 30 días
```

**Todo List:**
1. Definir array de transacciones mock (8 items) con variedad de tipos y categorías
2. Implementar la barra de filtros por tipo con botones activos/inactivos
3. Filtrar y renderizar el listado usando `TransactionCard`
4. Crear el componente modal de formulario (puede ser inline en el archivo o un componente local)
5. Formulario del modal: campos amount (number), type (select), description (text), date (date input), categoryId (select con categorías mock)
6. Al submit, agregar la transacción al estado local con `useState` y cerrar el modal

**Relevant Context:**
- [`frontend/src/pages/TransactionsPage.tsx`](frontend/src/pages/TransactionsPage.tsx) — stub a reemplazar
- [`frontend/src/components/shared/TransactionCard.tsx`](frontend/src/components/shared/TransactionCard.tsx) — componente de item
- [`frontend/src/types/transaction.types.ts`](frontend/src/types/transaction.types.ts) — `Transaction`, `TransactionType`, `CreateTransactionPayload`
- [`frontend/src/types/category.types.ts`](frontend/src/types/category.types.ts) — `Category`
- Radix UI Dialog disponible en `@radix-ui/react-dialog` para el modal

**Status:** [ ] pending

---

### Sub-Task 3 — CategoriesPage: grid de categorías y modal de crear categoría

**Intent:** Implementar la página de categorías mostrando un grid de las categorías existentes con su color e ícono, y un formulario modal para crear una nueva categoría.

**Expected Outcomes:**
- Grid de ~6 categorías mock usando `CategoryBadge` expandido a tarjeta
- Cada tarjeta muestra: color (círculo), ícono emoji, nombre
- Botón "Nueva categoría" que abre modal con campos: nombre, ícono (emoji input), color (input type=color)
- Al guardar, la categoría se agrega al estado local

**Mock Data needed:**
```ts
// Category[] con 6 categorías
[
  { id: '1', name: 'Comida', icon: '🍔', color: '#f97316', userId: 'mock', createdAt: '...' },
  { id: '2', name: 'Transporte', icon: '🚗', color: '#3b82f6', ... },
  { id: '3', name: 'Entretenimiento', icon: '🎬', color: '#a855f7', ... },
  { id: '4', name: 'Salud', icon: '💊', color: '#22c55e', ... },
  { id: '5', name: 'Servicios', icon: '💡', color: '#eab308', ... },
  { id: '6', name: 'Ropa', icon: '👕', color: '#ec4899', ... },
]
```

**Todo List:**
1. Definir array de categorías mock (6 items)
2. Implementar el grid de tarjetas de categoría (usar `CategoryBadge` o construir tarjeta inline)
3. Cada tarjeta muestra color, ícono, nombre, y un botón de eliminar (solo visual, actualiza estado local)
4. Implementar modal de nueva categoría con campos: nombre (text), ícono (text/emoji), color (`<input type="color">`)
5. Al guardar, agregar la categoría al estado local con `useState`

**Relevant Context:**
- [`frontend/src/pages/CategoriesPage.tsx`](frontend/src/pages/CategoriesPage.tsx) — stub a reemplazar
- [`frontend/src/components/shared/CategoryBadge.tsx`](frontend/src/components/shared/CategoryBadge.tsx) — badge pequeño (puede usarse como referencia visual)
- [`frontend/src/types/category.types.ts`](frontend/src/types/category.types.ts) — `Category`, `CreateCategoryPayload`

**Status:** [ ] pending

---

### Sub-Task 4 — ReportsPage: tres gráficas con selector de período

**Intent:** Implementar la página de reportes mostrando las tres gráficas (doughnut, bar, line) con datos mock y un selector de período (últimos 3 meses / 6 meses / 1 año) que cambia los datos visualmente.

**Expected Outcomes:**
- Selector de período (3 botones: 3M / 6M / 1A) que activa un estado local
- `ExpensesByCategoryChart` (doughnut) con gastos por categoría del período
- `MonthlyBalanceChart` (bar) con ingresos vs gastos por mes
- `TrendLineChart` (line) con la misma data de tendencia
- Los datos mock cambian según el período seleccionado (3 conjuntos de datos distintos)

**Mock Data needed:**
```ts
// TrendPoint[] para bar y line charts (desde reports.service types)
// 3M: 3 puntos, 6M: 6 puntos, 1A: 12 puntos
// CategorySummary[] para doughnut (varía levemente por período)
```

**Todo List:**
1. Definir 3 conjuntos de datos mock (para 3M, 6M, 1A) de tipo `TrendPoint[]` y `CategorySummary[]`
2. Implementar el selector de período con estado local (`useState<'3M' | '6M' | '1A'>`)
3. Derivar los datos activos del período seleccionado
4. Renderizar `ExpensesByCategoryChart` con datos de categorías del período
5. Renderizar `MonthlyBalanceChart` con datos de tendencia del período
6. Renderizar `TrendLineChart` con los mismos datos de tendencia

**Relevant Context:**
- [`frontend/src/pages/ReportsPage.tsx`](frontend/src/pages/ReportsPage.tsx) — stub a reemplazar
- [`frontend/src/components/charts/ExpensesByCategoryChart.tsx`](frontend/src/components/charts/ExpensesByCategoryChart.tsx) — prop `data: CategorySummary[]`
- [`frontend/src/components/charts/MonthlyBalanceChart.tsx`](frontend/src/components/charts/MonthlyBalanceChart.tsx) — prop `data: TrendPoint[]`
- [`frontend/src/components/charts/TrendLineChart.tsx`](frontend/src/components/charts/TrendLineChart.tsx) — prop `data: TrendPoint[]`
- Los tipos `CategorySummary` y `TrendPoint` están en `frontend/src/services/reports.service.ts`

**Status:** [ ] pending

---

## Orden de ejecución

```
Sub-Task 1 → Sub-Task 2 → Sub-Task 3 → Sub-Task 4
(Dashboard)   (Transactions) (Categories)  (Reports)
```

Cada página es independiente — se puede implementar en cualquier orden. El orden propuesto va de más simple a más complejo en términos de interactividad.

## Notas de implementación

- **Sin servicios:** Todos los datos son constantes locales en cada página. No importar ni usar `hooks/` ni `services/` en este plan.
- **Estado local:** Usar `useState` para las mutaciones (agregar transacción, agregar categoría). No tocar el store global de Zustand.
- **Auth mock:** El `ProtectedRoute` redirige a `/login` si `isAuthenticated` es false. Para probar las páginas directamente, el `authStore` persiste en localStorage — loguear una vez manualmente establece `isAuthenticated: true` hasta que se haga logout.
- **Estilos:** Usar solo clases de Tailwind y las CSS variables del sistema de diseño ya definido en `index.css`. No añadir estilos inline salvo para colores dinámicos (backgroundColor de categorías).
