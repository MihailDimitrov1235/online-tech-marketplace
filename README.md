# Online Technology Marketplace

A full-stack marketplace application built with the MERN stack — MongoDB, Express, React, and Node.js.

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)

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

---

## Configuration

Before running the API, fill in the required fields in your `.env` file:

| Variable | Description |
|---|---|
| `DB_URI` | Your MongoDB connection string |
| `JWT_SECRET` | Secret key used to sign and verify JSON Web Tokens |
| `B2_KEY_ID` | Backblaze application key ID |
| `B2_APP_KEY` | Backblaze application key |
| `B2_BUCKET_NAME` | Backblaze bucket name |
| `S3_ENDPOINT` | Backblaze B2 endpoint URL |

---

## File Storage

This app uses **Backblaze B2** for file storage by default. To switch to a different cloud provider (e.g. AWS S3, Cloudflare R2), update the relevant credentials in your `.env` file and modify the storage client in `api/s3.js`.
