# Vue RUM Test Application

A Vue.js 3 single-page admin dashboard built to validate **Real User Monitoring (RUM)** using the `@motadata365/browser-rum` SDK. The app simulates a real-world admin panel with multiple pages, user interactions, and API calls so that RUM metrics (page views, session tracking, resource timing, long tasks) can be captured and verified.

---

## Application Overview

The app contains **6 navigable pages** served through Vue Router:

| Page | Route | Description |
|---|---|---|
| Dashboard | `/dashboard` | Overview cards and charts |
| Products | `/products` | Product listing with mock data |
| Orders | `/orders` | Order table with status filters |
| Reports | `/reports` | Charts and data visualizations |
| Profile | `/profile` | User profile information |
| Settings | `/settings` | App configuration options |

The RUM SDK is initialized in `src/main.js` and automatically tracks:
- Page views and navigation events
- User interactions (clicks, inputs)
- Resource loading performance
- Long tasks and session data

---

## Tech Stack

| Package | Purpose |
|---|---|
| Vue 3 | Frontend framework |
| Vue Router | Client-side routing |
| Pinia | State management |
| Chart.js + vue-chartjs | Charts and data visualization |
| @motadata365/browser-rum | Real User Monitoring SDK |
| Vite | Build tool and dev server |

---

## Project Structure

```
vue-rum-app/
├── src/
│   ├── assets/             # Global CSS
│   ├── components/
│   │   ├── common/         # Shared components (ToastContainer)
│   │   └── layout/         # Navbar, Sidebar
│   ├── composables/        # useToast, useSimulatedApi
│   ├── mock/               # Mock data (dashboard, orders, products, user)
│   ├── router/             # Vue Router config (all 6 routes)
│   ├── stores/             # Pinia store (appStore)
│   ├── views/              # Page components
│   ├── App.vue             # Root component
│   └── main.js             # App entry point + RUM init
├── selenium_tests/
│   ├── navigate_pages.py   # Selenium automation script
│   └── requirements.txt    # Python dependencies
├── public/
├── index.html
├── vite.config.js
└── package.json
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v16 or higher
- npm v7 or higher
- Python 3.8 or higher (for Selenium automation)
- Google Chrome browser

---

## Running the Application

### 1. Install dependencies

```bash
npm install
```

### 2. Start development server

```bash
npm run dev
```

App runs at **http://localhost:5173**

### 3. Build for production

```bash
npm run build
```

Output is placed in the `dist/` folder.

### 4. Preview production build

```bash
npm run preview
```

Serves the production build at **http://localhost:4173**

---

## Selenium Automation

### Overview

The Selenium script (`selenium_tests/navigate_pages.py`) automates a real browser to cycle through all 6 pages of the application — simulating genuine user navigation so the RUM SDK captures real session data at scale.

**What it does:**
- Opens Google Chrome and loads the app
- Clicks each sidebar nav link in order: Dashboard → Products → Orders → Reports → Profile → Settings
- Pauses **2 seconds** on each page to allow RUM events to fire
- After completing all 6 pages (**1 cycle**), waits **60 seconds** before starting the next cycle
- Repeats for **1000 cycles** total
- Falls back to direct URL navigation if a sidebar click fails
- Writes a timestamped log to `selenium_tests/selenium_run.log`

**Cycle summary:**

| Setting | Value |
|---|---|
| Total cycles | 1000 |
| Pages per cycle | 6 |
| Pause per page | 2 seconds |
| Wait between cycles | 60 seconds (1 minute) |
| Log file | `selenium_tests/selenium_run.log` |

---

### Running the Selenium Script

#### Step 1 — Start the app (in terminal 1)

```bash
npm run dev
```

Make sure the app is running at `http://localhost:5173` before starting the script.

#### Step 2 — Install Python dependencies (one-time setup)

```bash
cd selenium_tests
pip install -r requirements.txt
```

This installs:
- `selenium` — browser automation library
- `webdriver-manager` — automatically downloads the matching ChromeDriver

#### Step 3 — Run the script (in terminal 2)

```bash
cd selenium_tests
python navigate_pages.py
```

A Chrome window will open and begin navigating automatically.

#### Step 4 — Monitor progress

```bash
# Windows
type selenium_tests\selenium_run.log

# macOS / Linux
tail -f selenium_tests/selenium_run.log
```

---

### Selenium Script Configuration

You can adjust these constants at the top of `navigate_pages.py`:

```python
BASE_URL             = "http://localhost:5173"  # App URL
TOTAL_CYCLES         = 1000                     # Number of full cycles
WAIT_BETWEEN_PAGES   = 2                        # Seconds on each page
WAIT_BETWEEN_CYCLES  = 60                       # Seconds between cycles
PAGE_LOAD_TIMEOUT    = 15                       # Max wait for element
```

To run headless (no visible Chrome window), uncomment this line in `build_driver()`:

```python
# options.add_argument("--headless=new")
```

---

## Developed BY

Anant Awishkar
