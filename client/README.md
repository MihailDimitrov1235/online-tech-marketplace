# Client — Online Technology Marketplace

React + Vite frontend for the marketplace: browsing/listing tech products, building and
sharing PC configuration templates, cart/checkout, and seller/admin dashboards.

## Tech stack

- **React 19 + Vite** — app shell and dev server
- **React Router 7** — routing, nested layouts, route guards
- **Redux Toolkit** — global state (`auth`, `cart`); most page-level data is local `useState`
  fed by direct API calls, not Redux
- **React Hook Form + Yup** — all forms, via a small `RHF*` wrapper component set
- **Axios** — HTTP client, with a request interceptor that attaches the stored JWT
- **Tailwind CSS** — styling, with a light/dark `ThemeProvider`
- **Vitest + React Testing Library** — test runner

## Architecture

```
main.tsx
  └─ Redux <Provider>
       └─ ThemeProvider
            └─ RouterProvider (router.tsx)
                 ├─ MainLayout      (public site shell: navbar, cart drawer, footer)
                 │    ├─ Home, Listings, Detail, Configurations/*, Cart, Checkout, Orders/*
                 │    └─ wrapped in <AuthGuard> where login is required
                 ├─ DashboardLayout (seller/admin shell)
                 │    └─ MyListings, Orders, Deliveries, Data/*, Verification
                 └─ AuthLayout      (Login, Register) — wrapped in <GuestGuard>
```

Pages talk to the API directly through the shared `api/axiosInstance.ts` instance — there's
no data-fetching abstraction layer; each page's `useEffect` calls `api.get/post/...` and
holds the result in local state. Redux is reserved for state that genuinely needs to be
global: the logged-in user (`authSlice`) and the cart drawer's contents/open-state
(`cartSlice`), both of which are read from multiple unrelated components (navbar, product
cards, checkout).

## Project structure

```
src/
├── api/
│   ├── axiosInstance.ts     # axios instance, baseURL
│   └── interceptors.ts      # attaches `Authorization: Bearer <token>` from localStorage
├── store/
│   ├── index.ts              # Redux store (auth, cart reducers)
│   ├── authSlice.ts          # user session: login/register/fetchMe thunks
│   └── cartSlice.ts          # cart drawer open/closed + items
├── guards/                  # AuthGuard (require login), GuestGuard (require logged-out)
├── layouts/                 # MainLayout, DashboardLayout, AuthLayout
├── router.tsx               # route tree + the `paths` helper object used everywhere
├── pages/                   # one folder/file per route (see router.tsx for the tree)
│   ├── listings/              # browse/create/edit/view product listings
│   ├── Configurations/        # browse/build/edit/view PC configuration templates
│   ├── dashboard/              # seller & admin views
│   └── auth/                  # Login, Register
├── components/
│   ├── common/                # Button, Card, TextField, Pagination, Dropdown, ...
│   ├── form/                  # FormProvider + RHFTextField/RHFDropdown/RHFFileUpload
│   ├── listings/               # spec rendering/editing per product type
│   └── configurations/         # PartPicker, shared part-type icon/label maps
├── types/                   # shared TS types (mirrors API response shapes)
└── theme/                   # light/dark ThemeProvider + toggle
```

## Getting started

```bash
npm install
npm run dev          # http://localhost:5173, expects the API on :8000
```

Other scripts: `npm run build` (type-check + production build), `npm run lint`,
`npm run test`, `npm run format`.

## Routing & guards

`router.tsx` exports both the `createBrowserRouter` tree and a `paths` object — always
navigate via `paths.x.y(...)` rather than hand-writing route strings, so a path change only
needs updating in one place. Two guard components gate access:

- **`AuthGuard`** — redirects to `/auth/login` (preserving `returnTo`) if no user is loaded
- **`GuestGuard`** — redirects logged-in users away from `/auth/*`

Auth/guest state is loaded once on app start via `fetchMe` in `authSlice`, so `AuthGuard`
shows a loading state until that resolves rather than redirecting prematurely.

## Forms

Every form follows the same pattern: a Yup `schema`, a `useForm` + `yupResolver(schema)`,
wrapped in `<FormProvider methods={methods} onSubmit={...}>` (a thin wrapper around RHF's
`FormProvider` that also renders the `<form>` tag), with fields as `<RHFTextField>` /
`<RHFDropdown>` / `<RHFFileUpload>` reading `errors` off form context automatically. See
`pages/listings/NewListing.tsx` for the most complete example (including the per-product-type
dynamic spec form via `SpecFormRenderer`).

## Key features

- **Listings** (`pages/listings/`) — CRUD for product listings across 9 hardware types
  (smartphone, processor, motherboard, ram, storage, psu, gpu, cooling, case), each with its
  own spec schema/fields (`components/listings/types/*`).
- **Configuration templates** (`pages/Configurations/`) — build a named bundle of existing
  listings (`NewConfiguration`/`EditConfiguration` share one component via an optional
  `configurationId` prop), browse/filter others' builds, clone (fork) someone else's build
  into your own editable copy, or add every part to your cart in one click from the detail
  page. The builder enforces basic compatibility (RAM stick count vs. motherboard memory
  slots, storage drive count vs. M.2/SATA slots) client-side before submitting.
- **Cart & checkout** (`pages/Cart.tsx`, `pages/Checkout.tsx`) — global cart state in
  `cartSlice`, opened as a drawer from anywhere "add to cart" is clicked.
- **Dashboards** (`pages/dashboard/`) — seller listing/order management and admin
  user/listing data views, gated behind `DashboardLayout` + `AuthGuard`.
