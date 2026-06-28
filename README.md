# Online Technology Marketplace

A full-stack marketplace application built with the MERN stack — MongoDB, Express, React, and Node.js.

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)

---

## Features

- **Marketplace listings** — buy/sell tech hardware across 9 categories (smartphones,
  processors, motherboards, RAM, storage, PSUs, GPUs, cooling, cases), each with its own
  structured spec sheet.
- **PC configuration templates** — build a named bundle of existing listings into a full PC
  build, browse other users' builds, clone (fork) one into your own editable copy, or add
  every part to your cart in a single click.
- **Cart, checkout & orders** — standard cart/checkout flow with per-seller warranty terms
  and delivery tracking.
- **Seller & admin dashboards** — listing/order management, seller verification, and
  aggregate stats.

---

## Architecture

```
client/ (React + Vite)
   │  HTTPS / JSON, Bearer token
   ▼
api/ (Express + JWT)
   │
   ├──► MongoDB        — all persisted data (Mongoose)
   └──► Backblaze B2    — listing images, served via short-lived signed URLs
```

The client never talks to MongoDB or Backblaze directly — every read/write goes through the
API, which is the only thing holding credentials for either. See **[`api/README.md`](api/README.md)**
and **[`client/README.md`](client/README.md)** for each side's internal architecture,
directory layout, and (for the API) the full route reference.

---

## Getting Started

### 1. Start the client

```bash
cd ./client
npm i
npm run dev
```

### 2. Start the API server

```bash
cd ./api
cp .env.example .env
npm i
npm start
```

### 3. (Optional) seed sample data

```bash
cd ./api
node scripts/seedDemoProducts.js          # ~80 demo listings across all categories
node scripts/seedDemoConfigurations.js    # 8 demo configuration templates + 1 fork
```

---

## Configuration

Before running the API, fill in the required fields in your `.env` file (see
[`api/README.md`](api/README.md#getting-started) for the full table):

| Variable         | Description                                        |
| ---------------- | -------------------------------------------------- |
| `DB_URI`         | Your MongoDB connection string                     |
| `JWT_SECRET`     | Secret key used to sign and verify JSON Web Tokens |
| `B2_KEY_ID`      | Backblaze application key ID                       |
| `B2_APP_KEY`     | Backblaze application key                          |
| `B2_BUCKET_NAME` | Backblaze bucket name                              |
| `B2_ENDPOINT`    | Backblaze B2 endpoint URL                          |
| `B2_REGION`      | Backblaze B2 bucket region                         |

---

## File Storage

This app uses **Backblaze B2** for file storage by default. Only storage keys are persisted
in MongoDB — signed, short-lived URLs are generated on every read (see `api/s3.js`). To
switch to a different S3-compatible provider (e.g. AWS S3, Cloudflare R2), update the
credentials in your `.env` file; no code changes should be needed since B2's S3-compatible
API is used throughout.

---

## Learn more

- [`api/README.md`](api/README.md) — backend architecture, data model, full API reference
- [`client/README.md`](client/README.md) — frontend architecture, routing, state management
