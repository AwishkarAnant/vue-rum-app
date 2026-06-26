"""
Selenium navigation script for Vue RUM Test Application.
Cycles through all 6 pages 1000 times, waiting 1 minute between each cycle.
"""

import time
import logging
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

# ── Configuration ────────────────────────────────────────────────────────────

BASE_URL        = "http://localhost:5173"
TOTAL_CYCLES    = 1000
WAIT_BETWEEN_PAGES   = 2    # seconds to pause on each page
WAIT_BETWEEN_CYCLES  = 60   # seconds to wait after each full cycle
PAGE_LOAD_TIMEOUT    = 15   # seconds to wait for an element to appear

# Pages in navigation order (label, path, sidebar link text)
PAGES = [
    {"name": "Dashboard", "path": "/dashboard", "link_text": "Dashboard"},
    {"name": "Products",  "path": "/products",  "link_text": "Products"},
    {"name": "Orders",    "path": "/orders",    "link_text": "Orders"},
    {"name": "Reports",   "path": "/reports",   "link_text": "Reports"},
    {"name": "Profile",   "path": "/profile",   "link_text": "Profile"},
    {"name": "Settings",  "path": "/settings",  "link_text": "Settings"},
]

# ── Logging ──────────────────────────────────────────────────────────────────

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler("selenium_run.log", encoding="utf-8"),
    ],
)
log = logging.getLogger(__name__)

# ── Driver setup ─────────────────────────────────────────────────────────────

def build_driver() -> webdriver.Chrome:
    options = Options()
    options.add_argument("--start-maximized")
    options.add_argument("--disable-notifications")
    options.add_argument("--disable-infobars")
    # Keep the browser visible so RUM can track real interactions.
    # Remove the next line if you want a headless run instead.
    # options.add_argument("--headless=new")

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    driver.set_page_load_timeout(PAGE_LOAD_TIMEOUT)
    return driver

# ── Navigation helpers ────────────────────────────────────────────────────────

def wait_for_sidebar(driver: webdriver.Chrome, wait: WebDriverWait) -> None:
    """Block until the sidebar nav is present in the DOM."""
    wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".sidebar-nav")))


def click_nav_link(driver: webdriver.Chrome, wait: WebDriverWait, page: dict) -> bool:
    """
    Click a sidebar nav link by its visible text.
    Returns True on success, False if the element could not be found/clicked.
    """
    try:
        # Find the <a class="nav-item"> whose text contains the page label
        link = wait.until(
            EC.element_to_be_clickable(
                (By.XPATH,
                 f"//a[contains(@class,'nav-item') and "
                 f".//span[contains(@class,'nav-label') and "
                 f"normalize-space(text())='{page['link_text']}']]")
            )
        )
        link.click()

        # Confirm URL changed to the expected path
        wait.until(EC.url_contains(page["path"]))
        return True

    except Exception as exc:
        log.warning("Could not click '%s' via sidebar — falling back to direct URL. Error: %s",
                    page["name"], exc)
        try:
            driver.get(BASE_URL + page["path"])
            wait.until(EC.url_contains(page["path"]))
            return True
        except Exception as exc2:
            log.error("Direct navigation to '%s' also failed: %s", page["path"], exc2)
            return False


# ── Main loop ─────────────────────────────────────────────────────────────────

def run():
    log.info("Starting Selenium navigation — %d cycles, %d pages per cycle",
             TOTAL_CYCLES, len(PAGES))
    log.info("Target app: %s", BASE_URL)

    driver = build_driver()
    wait   = WebDriverWait(driver, PAGE_LOAD_TIMEOUT)

    # Open the app once
    driver.get(BASE_URL)
    wait_for_sidebar(driver, wait)
    log.info("App loaded successfully.")

    successful_cycles = 0
    failed_cycles     = 0

    start_time = time.time()

    for cycle in range(1, TOTAL_CYCLES + 1):
        cycle_start = time.time()
        log.info("━━━ Cycle %d / %d ━━━", cycle, TOTAL_CYCLES)
        cycle_ok = True

        for page in PAGES:
            log.info("  → Navigating to %s (%s)", page["name"], page["path"])
            ok = click_nav_link(driver, wait, page)

            if ok:
                log.info("    ✓ Reached %s", page["name"])
            else:
                log.error("    ✗ Failed to reach %s", page["name"])
                cycle_ok = False

            time.sleep(WAIT_BETWEEN_PAGES)

        cycle_elapsed = time.time() - cycle_start

        if cycle_ok:
            successful_cycles += 1
            log.info("Cycle %d complete in %.1f s  [success: %d  failed: %d]",
                     cycle, cycle_elapsed, successful_cycles, failed_cycles)
        else:
            failed_cycles += 1
            log.warning("Cycle %d finished with errors in %.1f s  [success: %d  failed: %d]",
                        cycle, cycle_elapsed, successful_cycles, failed_cycles)

        # Wait 1 minute between cycles (skip the wait after the very last cycle)
        if cycle < TOTAL_CYCLES:
            log.info("Waiting %d s before next cycle …", WAIT_BETWEEN_CYCLES)
            time.sleep(WAIT_BETWEEN_CYCLES)

    total_elapsed = time.time() - start_time
    log.info("═══════════════════════════════════════════")
    log.info("All %d cycles done in %.0f s (%.1f min)",
             TOTAL_CYCLES, total_elapsed, total_elapsed / 60)
    log.info("Successful: %d  |  Failed: %d", successful_cycles, failed_cycles)
    log.info("═══════════════════════════════════════════")

    driver.quit()


if __name__ == "__main__":
    run()
