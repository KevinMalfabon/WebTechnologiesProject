# Bookstore Management System

A full-stack bookstore management app built with **NestJS** and **React**. Follows domain-driven organization, layered architecture, and a strict zero-`any` TypeScript policy.

> Developed for the Web Technologies course at JUNIA.

---

## Tech Stack

| Layer | Technologies |
| --- | --- |
| **Back-end** | TypeScript · NestJS · TypeORM · SQLite · class-validator |
| **Front-end** | TypeScript · React 19 (Vite) · Ant Design · @tanstack/react-router · Axios |

---

## Architecture

### Domain-Driven Modules

Both back-end and front-end are organized by business domain: **Books**, **Clients**, **Authors**, **Sales**. Each module is self-contained.

### Back-end Layers

```
Controller → Service → Repository → Entity
```

| Layer | Role |
| --- | --- |
| **Controller** | HTTP routes, DTO validation |
| **Service** | Business logic, model transformation |
| **Repository** | TypeORM queries, joins, pagination |
| **Entity** | Database schema (`@Entity`, `@ManyToOne`, branded IDs) |
| **DTO / Model** | Input validation / clean API output |

### Front-end Structure

Each domain contains: **Model** (TypeScript interfaces) · **Components** (UI) · **Providers** (API hooks) · **Pages** (route wrappers). Routing uses `@tanstack/react-router` file-based convention with type-safe params.

---

## Key Features

### Books

- **List** — responsive card grid with cover image, author, year, and **sales count** (computed via `loadRelationCountAndMap`)
- **Details** — bento-grid layout: cover on the left, title/author/year cards on the right, description below, embedded sales list with a **"Record Sale"** button
- **Inline editing** — toggle edit mode to modify any field; author reassignment via searchable dropdown
- **Delete** — confirmation modal with cascade deletion of related sales

### Clients

- **List** — avatar, name, email, purchased books count; inline editing directly in the row
- **Details** — bento-grid with picture, name, email cards; per-field inline editing with live image preview
- **Purchase history** — modal listing all books bought, with links to book details
- **Create / Delete** — modal form for creation; confirmation dialog for deletion with cascade

### Authors

- Back-end CRUD module (controller, service, repository, entity)
- Surfaced in the front-end through book creation/editing author dropdown

### Sales & Transactions

Records that **Client X bought Book Y on Date Z**.

- **Two entry points** — from the Sales page (pick client + book + date) or from a Book detail page (book pre-selected, pick client + date)
- **Searchable selectors** — Ant Design `Select` with `showSearch` for clients and books, `DatePicker` for dates
- **Sale list** — icon-labeled cards (client, book, date); inline editing with dropdowns and date picker
- **Relational integrity** — `@ManyToOne` with `CASCADE` delete; existence validation before insert

### Navigation & UX

- **Menu** — horizontal nav bar: Home, Books, Clients, Sales, About (with icons)
- **Breadcrumbs** — route-aware `AppBreadcrumb` via `useMatches()`
- **Responsive** — `Grid.useBreakpoint()` + CSS media queries (768px / 480px)
- **Loading states** — `Skeleton` placeholders, `Alert` for missing records, toast notifications

---

## Installation & Setup

### Back-end

```bash
cd nest-api
npm install
npm run start:dev        # → http://localhost:3000
```

### Front-end

```bash
cd react-app
npm install
npm run dev              # → http://localhost:5173
```

---

## Project Structure

```
WebTechnologiesProject/
├── nest-api/
│   └── src/modules/
│       ├── authors/        # controller, service, repo, entity, dto, model
│       ├── books/          # controller, service, repo, entity, dto, model
│       ├── clients/        # controller, service, repo, entity, dto, model
│       ├── sales/          # controller, service, repo, entity, dto, model
│       └── database/
│
├── react-app/
│   └── src/
│       ├── books/          # model, components, pages, providers
│       ├── clients/        # model, components, pages, providers
│       ├── sales/          # model, components, pages, providers
│       ├── domains/        # Extended views (BookDetails bento-grid)
│       ├── routes/         # File-based routing
│       └── shared/         # AppBreadcrumb
│
└── README.md
```