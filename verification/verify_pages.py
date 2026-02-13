from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    try:
        # Navigate to fund page
        print("Navigating to fund page...")
        page.goto("http://localhost:3000/fund")

        # Check if "Fund" header is present
        print("Checking for header...")
        if page.get_by_role("heading", name="Fund").is_visible():
            print("Verified Fund page loaded.")
        else:
            print("ERROR: Fund page header not found.")

        # Check for disabled message
        if page.get_by_text("Expense tracking temporarily unavailable.").is_visible():
             print("Verified disabled message.")
        else:
             print("WARNING: Disabled message not found.")

        # Navigate to evidence-log
        print("Navigating to evidence-log...")
        page.goto("http://localhost:3000/evidence-log")

        # Check header
        if page.get_by_role("heading", name="Evidence Log").is_visible():
            print("Verified Evidence Log page loaded.")
        else:
            print("ERROR: Evidence Log page header not found.")

        # Take a screenshot to prove it works
        page.screenshot(path="verification/3_pages_working.png")

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
