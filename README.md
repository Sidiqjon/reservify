<p align="center">
  <a href="http://3.76.216.99:3333/api/docs#/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">
  <b>Reservify</b> — Event Seat Reservation API built with <a href="https://nestjs.com/" target="_blank">NestJS</a>, <a href="https://www.prisma.io/" target="_blank">Prisma</a>, and <a href="https://www.postgresql.org/" target="_blank">PostgreSQL</a>.
</p>

<p align="center">
  <a href="https://nodejs.org/en" target="_blank"><img src="https://img.shields.io/badge/Node.js-20-green" alt="Node.js 20" /></a>
  <a href="https://nestjs.com/" target="_blank"><img src="https://img.shields.io/badge/NestJS-Framework-red" alt="NestJS" /></a>
  <a href="https://www.prisma.io/" target="_blank"><img src="https://img.shields.io/badge/ORM-Prisma-blue" alt="Prisma ORM" /></a>
  <a href="https://www.postgresql.org/" target="_blank"><img src="https://img.shields.io/badge/Database-PostgreSQL-blueviolet" alt="PostgreSQL" /></a>
  <a href="https://jestjs.io/" target="_blank"><img src="https://img.shields.io/badge/Tests-Jest-yellow" alt="Jest" /></a>
</p>

---

## 📘 Live API Documentation

**Production URL:** [http://3.76.216.99:3333/api/docs#/](http://3.76.216.99:3333/api/docs#/)

---

## 📖 Description

**Reservify** is a clean, modular backend for managing **events and seat reservations**.  
It follows **Domain-Driven Design (DDD)** principles with full CRUD APIs, validation, and end-to-end tests.  
The project is automatically deployed to **AWS Lightsail** via **GitHub Actions CI/CD pipeline**.

---

## ⚙️ Tech Stack

- **NestJS** — modular backend framework
- **Prisma ORM** — PostgreSQL schema & migrations
- **PostgreSQL** — relational database
- **Swagger** — auto-generated API documentation
- **Jest + Supertest** — for end-to-end testing
- **PM2** — process manager for production
- **GitHub Actions** — CI/CD pipeline to AWS Lightsail

---

## 🏗️ Features

- Complete Event CRUD operations
- Booking system with seat limits
- Prevents duplicate seat reservations
- DTO validation via `class-validator`
- Global error filters and unified response structure
- Auto-generated Swagger API docs
- Dedicated test database for E2E tests

---

## 🧩 Project Structure

```
src/
├── core/                # shared modules (PrismaService, filters, interceptors)
├── modules/
│   ├── events/          # event module (controller, service, DTOs)
│   └── bookings/        # booking module (controller, service, DTOs)
prisma/
├── schema.prisma        # database schema
└── migrations/          # migration files
test/
└── app.e2e-spec.ts      # end-to-end tests
```

---

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Running the App

```bash
# development
npm run start:dev

# production
npm run start:prod
```

### Environment Setup

Create a `.env` file:

```env
DATABASE_URL="postgresql://postgres:12345678@localhost:5432/reservify?schema=public"
PORT=3333
```

Initialize database:

```bash
npx prisma migrate dev
npx prisma generate
```

---

## 🧪 Testing (Local Only)

Reservify uses a dedicated test database to isolate test data.

Create `.env.test`:

```env
DATABASE_URL="postgresql://postgres:12345678@localhost:5432/reservify_test?schema=public"
NODE_ENV=test
PORT=4000
```

Run end-to-end tests:

```bash
npm run test:e2e
```

---

## 🚢 Deployment (CI/CD)

Reservify uses **GitHub Actions** for continuous integration and deployment to **AWS Lightsail**.

The pipeline performs:

- Install dependencies and build the project
- Copy build files to AWS Lightsail via SSH
- Run migrations and restart with PM2

Production server setup:

```bash
npm install --omit=dev
npx prisma migrate deploy
pm2 restart ecosystem.config.js
```

---

## 🧹 Reset Database (Server)

To safely reset production data (e.g., clear test bookings):

```bash
npx prisma migrate reset
```

Or run a custom cleanup script:

```bash
npx ts-node prisma/cleanup.ts
```

---

## 📜 API Endpoints

### 🎟️ Events

| Method | Endpoint           | Description      |
|--------|--------------------|------------------|
| POST   | /api/events        | Create event     |
| GET    | /api/events        | List all events  |
| GET    | /api/events/:id    | Get event by ID  |
| PATCH  | /api/events/:id    | Update event     |
| DELETE | /api/events/:id    | Delete event     |

### 💺 Bookings

| Method | Endpoint               | Description       |
|--------|------------------------|-------------------|
| POST   | /api/bookings/reserve  | Create booking    |
| GET    | /api/bookings          | List all bookings |
| GET    | /api/bookings/:id      | Get booking by ID |
| DELETE | /api/bookings/:id      | Delete booking    |

---

## 👤 Author

**Sidiqjon Yusufjanov**

**Reservify** — Event Seat Reservation API  
Deployed API: [http://3.76.216.99:3333/api/docs#/](http://3.76.216.99:3333/api/docs#/)

---

## 🪪 License

This project is **MIT Licensed** — free to use, modify, and distribute.

---

<p align="center"><b>"A clean, modular, and testable NestJS backend — built with production in mind."</b></p>