# Multi-Tenant Messaging API

A **Node.js + TypeScript + Sequelize** project for a multi-tenant messaging system with **dedicated tenant databases** and a **shared central database**. Each organization (tenant) has its own isolated schema, while global information like orgs and credits are stored centrally.

---

## Table of Contents

- [Architecture](#architecture)  
- [Features](#features)  
- [Prerequisites](#prerequisites)  
- [Installation](#installation)  
- [Environment Variables](#environment-variables)  
- [Database Setup](#database-setup)  
- [Running the Project](#running-the-project)  
- [API Endpoints](#api-endpoints)  
- [Multi-Tenant Flow](#multi-tenant-flow)  
- [Project Structure](#project-structure)  

---

## Architecture

```
                 ┌───────────────────────┐
                 │    Shared DB          │
                 │ (orgs, credits)       │
                 └─────────┬─────────────┘
                           │
          Middleware injects │ tenantSequelize
                           │
                 ┌─────────▼─────────────┐
                 │  Tenant DB (org_1)    │
                 │ (messages table)      │
                 └─────────┬─────────────┘
                           │
                 ┌─────────▼─────────────┐
                 │  Tenant DB (org_2)    │
                 │ (messages table)      │
                 └───────────────────────┘
```

- **Shared DB**: contains central tables `orgs`, global credits, optional aggregated messages.  
- **Tenant DB**: each org has a separate database (`org_1`, `org_2`, …) containing the `messages` table.  

---

## Features

- Multi-tenant architecture with **dedicated tenant databases**.  
- Centralized `orgs` table for global organization management.  
- Tenant-specific `messages` table for isolation.  
- Async message delivery simulation.  
- Credit management per org.  
- Middleware automatically resolves tenant DB based on `X-Org-Id` header.  

---

## Prerequisites

- Node.js v20+  
- MySQL / MariaDB  
- npm  

---

## Installation

```bash
# Clone the repo
git clone <repo-url>
cd multi-tenant-messaging

# Install dependencies
npm install
```

---

## Environment Variables

Create a `.env` file at the root:

```env
PORT=4000
DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=shared_db   # central/shared database
```

---

## Database Setup

1. Create the shared DB manually or it will be auto-created:
```sql
CREATE DATABASE IF NOT EXISTS shared_db;
```

2. Tenant databases are created dynamically when a new org is added.

---

## Running the Project

```bash
# Start in development mode
npm run dev
```

Server will run on `http://localhost:4000`.

---

## API Endpoints

### 1. Create Org

**Request**

```http
POST /orgs
Content-Type: application/json

{
  "name": "Org 1"
}
```

**Response**

```json
{
  "success": true,
  "org": {
    "id": 1,
    "name": "Org 1",
    "creditBalance": 100,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

- Creates entry in **shared DB `orgs` table**.  
- Initializes a **tenant database** `org_1` with a `messages` table.  

---

### 2. Send Message

**Headers**

```
X-Org-Id: 1
Content-Type: application/json
```

**Request**

```http
POST /messages
{
  "to": "+1234567890",
  "channel": "sms",
  "body": "Hello World"
}
```

**Response**

```json
{
  "success": true,
  "message": {
    "id": 1,
    "to": "+1234567890",
    "channel": "sms",
    "body": "Hello World",
    "status": "QUEUED",
    "createdAt": "..."
  }
}
```

- Message is stored in **tenant DB `org_1.messages`**.  
- Async gateway updates `status` to `SENT` or `FAILED`.  
- Credits are deducted in the **shared DB**.  

---

### 3. Get Messages

**Headers**

```
X-Org-Id: 1
```

**Request**

```http
GET /messages
```

**Response**

```json
[
  {
    "id": 1,
    "to": "+1234567890",
    "channel": "sms",
    "body": "Hello World",
    "status": "SENT",
    "createdAt": "..."
  }
]
```

- Reads from **tenant DB messages table**.  

---

## Multi-Tenant Flow

1. Client includes `X-Org-Id` header in requests.  
2. `tenantResolver` middleware:
   - Validates org exists in **shared DB**.
   - Initializes tenant DB if not already connected.  
   - Attaches tenant Sequelize instance to `req`.  
3. Controller uses **tenant DB model** for all CRUD operations.  
4. Shared DB used for **global operations** (credits, org metadata).  

---

## Project Structure

```
src/
├─ config/
│  ├─ db.ts              # Shared DB connection
│  ├─ tenantManager.ts   # Multi-tenant logic
├─ controllers/
│  ├─ org.controller.ts
│  ├─ message.controller.ts
├─ middlewares/
│  ├─ tenantResolver.ts
├─ models/
│  ├─ org.model.ts
│  ├─ message.model.ts
├─ routes/
│  ├─ org.routes.ts
│  ├─ message.routes.ts
├─ services/
│  ├─ credit.service.ts
│  ├─ gateway.service.ts
├─ app.ts
└─ server.ts
```

---
## Rate Limiting

To prevent abuse and ensure fair usage, this project includes **rate limiting** on API endpoints using the `express-rate-limit` middleware.

### How it works

- Each client (by IP or tenant org) is limited to a certain number of requests per time window.
- Example configuration:
  ```ts
  import rateLimit from 'express-rate-limit';

  export const apiRateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5,                 // max 5 requests per window
    message: { error: 'Too many requests, please try again later.' },
  });

## Notes

- All **tenant data is isolated** — each org has its own DB.  
- Shared DB stores only **global info** (orgs, credits, optional analytics).  
- Async message sending ensures the API responds quickly.  
- Adding a new org automatically creates t
