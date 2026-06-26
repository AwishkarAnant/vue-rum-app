# Vue RUM Test Application

A Vue.js 3 static test application for Real User Monitoring (RUM) validation using `@motadata365/browser-rum`.

## Prerequisites

- [Node.js](https://nodejs.org/) v16 or higher
- npm v7 or higher

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Run in Development Mode

```bash
npm run dev
```

The app will start and be available at:

```
http://localhost:5173
```

### 3. Build for Production

```bash
npm run build
```

The output will be in the `dist/` folder.

### 4. Preview Production Build

```bash
npm run preview
```

This serves the production build locally at `http://localhost:4173`.

## Tech Stack

| Package | Purpose |
|---|---|
| Vue 3 | Frontend framework |
| Vue Router | Client-side routing |
| Pinia | State management |
| Chart.js + vue-chartjs | Charts and data visualization |
| @motadata365/browser-rum | Real User Monitoring |
| Vite | Build tool and dev server |

## Project Structure

```
src/
├── assets/         # Global CSS
├── components/     # Reusable UI components
│   ├── common/     # Shared components (e.g. ToastContainer)
│   └── layout/     # Layout components (Navbar, Sidebar)
├── composables/    # Vue composables (useToast, useSimulatedApi)
├── mock/           # Mock data (dashboard, orders, products, user)
├── router/         # Vue Router configuration
├── stores/         # Pinia stores
├── views/          # Page-level components
├── App.vue         # Root component
└── main.js         # App entry point
```
