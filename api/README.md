# API — Online Technology Marketplace

Express + MongoDB backend for the marketplace: user auth, product listings (with per-type
spec schemas), PC configuration templates, cart/checkout, orders, reviews, and seller
verification.

## Tech stack

- **Express 5** — HTTP server and routing
- **Mongoose 9 / MongoDB** — data persistence
- **JWT (jsonwebtoken)** — stateless auth, verified per-request via middleware
- **bcryptjs** — password hashing
- **Backblaze B2 (S3-compatible)** via `@aws-sdk/client-s3` — image storage, accessed
  through short-lived signed URLs
- **multer** + **sharp** — multipart upload handling and image resize/recompress to WebP
- **Node ESM** (`"type": "module"`) — all imports require explicit `.js` extensions

## Architecture

Every request flows through the same layers, top to bottom:

```
HTTP request
   │
   ▼
server.js            – mounts CORS, JSON body parsing, and one router per resource
   │
   ▼
routes/*.routes.js   – maps HTTP verb + path to a controller function
   │
   ▼
middleware/          – auth.js (JWT → req.user), restrictTo.js (role check)
   │
   ▼
controllers/*.js     – business logic, validation, talks to models + s3.js
   │
   ├──────────────► models/*.model.js  (Mongoose schemas) ──► MongoDB
   │
   └──────────────► s3.js  (sign/upload/delete images) ──► Backblaze B2
```

There's no separate service layer — controllers own validation and orchestration directly,
and ownership/authorization checks (e.g. "only the seller who created this listing can edit
it") live in the controller, not in middleware or model hooks.

## Project structure

```
api/
├── server.js                 # app bootstrap: middleware, router mounting, DB connect
├── loadEnvironments.js        # dotenv loader
├── s3.js                      # Backblaze B2 client: signFiles/uploadFiles/deleteFiles
├── middleware/
│   ├── auth.js                 # `protect` — verifies JWT, attaches req.user
│   └── restrictTo.js           # `restrictTo(...roles)` — role-based route guard
├── models/
│   ├── User.model.js
│   ├── Seller.model.js         # seller profile: address, warranty terms, verified flag
│   ├── Product.model.js        # generic listing + polymorphic `specs` (see below)
│   ├── product_types/          # one Mongoose sub-schema per product `type`
│   ├── Configuration.model.js  # a named bundle of Product refs (a "PC build")
│   ├── Cart.model.js
│   ├── Order.model.js
│   └── Review.model.js
├── controllers/                # one file per resource, mirrors routes/
├── routes/                     # one Express Router per resource
└── scripts/
    ├── seedDemoProducts.js        # idempotent: seeds ~80 demo listings (one per type)
    └── seedDemoConfigurations.js  # idempotent: seeds demo Configuration templates
```

## Getting started

```bash
cp .env.example .env   # fill in the values below
npm install
npm start               # nodemon server.js
```

| Variable         | Description                                          |
| ---------------- | ----------------------------------------------------- |
| `PORT`           | HTTP port (defaults to 8000)                          |
| `DB_URI`         | MongoDB connection string                             |
| `JWT_SECRET`     | Secret used to sign/verify JWTs                       |
| `JWT_EXP_TIME`   | Token lifetime (defaults to `7d`)                     |
| `B2_KEY_ID`      | Backblaze application key ID                          |
| `B2_APP_KEY`     | Backblaze application key                             |
| `B2_BUCKET_NAME` | Backblaze bucket name                                 |
| `B2_ENDPOINT`    | Backblaze B2 S3-compatible endpoint URL               |
| `B2_REGION`      | Backblaze B2 bucket region                            |

Seed sample data once the DB is reachable:

```bash
node scripts/seedDemoProducts.js          # creates a demo_seller + ~80 listings
node scripts/seedDemoConfigurations.js    # creates 8 Configuration templates + 1 fork
```

## Data model

```
User ──< Seller (1:1 profile, verification + warranty terms)
User ──< Product (seller ref)
User ──< Configuration (author ref)
User ──< Cart (1:1)
User ──< Order (buyer ref)
User ──< Review (author ref)

Product ──< Review (product ref)
Product ──< Cart.items[] / Order.items[] (ref, qty)

Configuration.parts: {
  processor, motherboard, psu        → Product ref (required)
  gpu, case                          → Product ref (optional)
  ram[], storage[]                   → Product ref[] (non-empty)
}
Configuration.clonedFrom → Configuration ref (set when a user forks someone else's build)
```

### Product type system

`Product` is one generic Mongoose model shared by every listing. The `type` field (enum:
`smartphone`, `processor`, `motherboard`, `ram`, `storage`, `psu`, `gpu`, `cooling`, `case`)
selects which sub-schema in `models/product_types/` validates the freeform `specs` object —
e.g. a `gpu` listing's `specs` is checked against `product_types/Gpu.model.js`'s fields
(memory, clock speeds, power connectors, dimensions, etc.). This keeps one collection and one
set of CRUD routes/controllers for every hardware category instead of a model per type.

### Configuration templates

A `Configuration` is a named, shareable bundle of existing `Product` listings (a "build").
Key behaviors, all in `Configuration.controller.js`:

- **Type-matching validation** — on create/update, every referenced part id is batch-fetched
  and checked against its slot (`parts.psu` must reference a `type: "psu"` product, etc.)
  before the configuration is saved.
- **Price is computed, not stored** — `totalPrice` is summed from the live part prices at
  read time (cheaply, via a batched price-only query for list views) rather than persisted,
  so it can't drift when a seller edits a part's price later.
- **Clone = fork** — `POST /configurations/:id/clone` copies the parts into a new document
  owned by the cloning user (`clonedFrom` tracks lineage); the original is never mutated.
- **Buy = bulk add-to-cart** — `POST /configurations/:id/buy` adds every part to the buyer's
  cart in one call, reusing the same stock-clamping logic as the regular single-item
  add-to-cart (`Cart.controller.js`'s `addItemToCart` helper).

## API reference

All paths are relative to the API root (default `http://localhost:8000`). 🔒 = requires
`Authorization: Bearer <token>`. Roles in parentheses are enforced via `restrictTo`.

### Auth — `/auth`
| Method | Path | Description |
| --- | --- | --- |
| POST | `/register` | Create an account |
| POST | `/login` | Get a JWT |
| GET 🔒 | `/me` | Current user |

### Users — `/users`
| Method | Path | Description |
| --- | --- | --- |
| GET 🔒 (admin) | `/` | List all users |
| GET 🔒 | `/delivery` | List delivery-role users |
| GET | `/:id` | Get a user |
| PATCH 🔒 (admin) | `/:id/roles` | Update a user's roles |

### Sellers — `/sellers`
| Method | Path | Description |
| --- | --- | --- |
| POST 🔒 | `/` | Create/update your seller profile |
| GET 🔒 (seller) | `/me` | Your seller profile |
| GET 🔒 (admin) | `/unverified` | Pending verification queue |
| GET | `/:id` | Get a seller profile |
| PATCH 🔒 (admin) | `/:id/verify` | Approve a seller |
| DELETE 🔒 (admin) | `/:id/reject` | Reject a seller application |

### Products — `/products`
| Method | Path | Description |
| --- | --- | --- |
| GET | `/` | List/search/filter (`type`, `brand`, `condition`, `minPrice`, `maxPrice`, `search`, `seller`, `page`, `limit`) |
| GET | `/:id` | Get one, with reviews + average rating |
| POST 🔒 | `/` | Create a listing (multipart, `images[]`) |
| PATCH 🔒 | `/:id` | Update (owner only) |
| DELETE 🔒 | `/:id` | Delete (owner only) |

### Configurations — `/configurations`
| Method | Path | Description |
| --- | --- | --- |
| GET | `/` | List/search (`search`, `hasGpu`, `hasCase`, `page`, `limit`) |
| GET | `/:id` | Get one, fully populated |
| POST 🔒 | `/` | Create |
| PATCH 🔒 | `/:id` | Update (author only) |
| DELETE 🔒 | `/:id` | Delete (author only) |
| POST 🔒 | `/:id/clone` | Fork into your own editable copy |
| POST 🔒 | `/:id/buy` | Add every part to your cart |

### Reviews — `/reviews`
| Method | Path | Description |
| --- | --- | --- |
| GET | `/` | List reviews for a product |
| POST 🔒 | `/` | Create |
| PATCH 🔒 | `/:id` | Update (author only) |
| DELETE 🔒 | `/:id` | Delete (author only) |

### Cart — `/cart`
| Method | Path | Description |
| --- | --- | --- |
| GET 🔒 | `/` | Your cart |
| POST 🔒 | `/` | Add an item (`productId`, `quantity`) |
| PATCH 🔒 | `/:id` | Update an item's quantity |
| DELETE 🔒 | `/:id` | Remove an item |

### Orders — `/orders`
| Method | Path | Description |
| --- | --- | --- |
| GET 🔒 | `/` | Your orders |
| GET 🔒 | `/:id` | Get one |
| POST 🔒 | `/` | Checkout (creates an order from your cart) |
| PATCH 🔒 | `/:id/status` | Update order status |
| PATCH 🔒 (delivery) | `/:id/items/:itemId/status` | Update a single item's delivery status |
| DELETE 🔒 | `/:id` | Cancel/delete an order |

### Dashboard — `/dashboard`
| Method | Path | Description |
| --- | --- | --- |
| GET 🔒 | `/orders` | Orders for your listings (seller view) |
| GET 🔒 | `/deliveries` | Orders assigned to you (delivery view) |
| GET 🔒 | `/stats` | Aggregate stats for the dashboard |

## Auth & authorization

- `middleware/auth.js` (`protect`) verifies the JWT from the `Authorization` header and
  attaches the corresponding `User` document (minus `password`) to `req.user`.
- `middleware/restrictTo.js` is a second guard for role-gated routes (e.g. admin-only,
  delivery-only) — it runs after `protect` and checks `req.user.roles`.
- Resource ownership (e.g. "only the product's seller can edit it") is **not** middleware —
  it's checked explicitly in each controller against `req.user._id`.

## File storage

`s3.js` wraps the Backblaze B2 S3-compatible API:

- `uploadFiles` — resizes/recompresses images to WebP via `sharp`, uploads, returns storage
  keys (not URLs)
- `signProduct(s)` / `signOrder(s)` — turn stored keys into short-lived signed URLs
  (1 hour) just before a response is sent, so nothing public-facing is ever a raw bucket URL
- `deleteFiles` — removes an object and all its versions/delete-markers on B2

Only **keys** are persisted in MongoDB; signed URLs are generated fresh on every read.
