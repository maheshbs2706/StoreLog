# StoreLog

A daily business logging app for tracking store-level transactions — sales, purchases, returns, payments, stock transfers, and more. Built as a single HTML file, hosted on GitHub Pages, with Google Sheets as the database backend.

---

## Features

- **Multi-store support** — log entries per store per date
- **Flexible field types** — Sale, Purchase, Return, Payment, Stock Transfer, JV, Stock Item — add new ones anytime
- **Per-entry tracking** — Qty, Amount, Remark, Status (Pending / In Progress / Completed)
- **Activity log** — every entry records who added or edited it and when
- **Status filter bar** — filter by All / Pending / In Progress / Completed across both tabs
- **Summary view** — view by store, all stores, or field-wise overall totals
- **User management** — Admin, Editor, Viewer roles with per-store access control
- **Google Sheets sync** — all data lives in Google Sheets, fetched fresh on every login
- **Export** — download all data as JSON or CSV
- **Import** — restore data from a previously exported JSON file
- **Light & Dark theme** — toggle anytime, preference saved in browser
- **Mobile friendly** — works in Chrome and Safari on any device

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML, CSS, JavaScript (single file) |
| Database | Google Sheets |
| Backend | Google Apps Script (Web App) |
| Hosting | GitHub Pages |
| Auth | Username + password stored in Google Sheets `users` tab |

---

## Project Structure

```
storelog/
├── store-logger.html        # The entire frontend app
├── storelog-apps-script.gs  # Google Apps Script backend
└── README.md
```

---

## Google Sheet Structure

Create a Google Sheet with **3 tabs** named exactly as below:

### `data` tab
Stores all daily log entries.

| date | store | field | qty | amount | remark | status | updatedBy | updatedAt |
|---|---|---|---|---|---|---|---|---|
| 2026-04-12 | Main Store | Sale | 10 | 5000 | cash sale | completed | admin | 12 Apr, 10:30 am |

### `users` tab
Stores user accounts and roles.

| username | password | role | stores |
|---|---|---|---|
| admin | yourpassword | admin | all |
| ravi | password123 | editor | Main Store, Branch A |
| priya | password456 | viewer | all |

**Roles:**
- `admin` — full access, user management, export/import
- `editor` — can add and edit entries for assigned stores
- `viewer` — read-only access to assigned stores

**Stores column:** use `all` for all stores, or comma-separated store names for specific access.

### `meta` tab
Stores configuration (stores list and field types). Managed automatically by the app.

| key | value |
|---|---|
| stores | ["Main Store","Branch A"] |
| fields | ["Sale","Purchase","Return","Payment","Stock Transfer","JV","Stock Item"] |

---

## Setup Guide

### Step 1 — Create the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new spreadsheet
2. Rename the default sheet tab to `data`
3. Create two more tabs named `users` and `meta`
4. Add the headers to each tab as shown above
5. Add your first admin user in the `users` tab row 2

### Step 2 — Set Up Google Apps Script

1. In your Google Sheet, go to **Extensions → Apps Script**
2. Delete all existing code in the editor
3. Paste the contents of `storelog-apps-script.gs`
4. Replace `YOUR_SHEET_ID_HERE` with your actual Google Sheet ID
   - The Sheet ID is in the URL: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit`
5. Press **Ctrl+S** to save, name the project `StoreLog`

### Step 3 — Deploy the Apps Script

1. Click **Deploy → New deployment**
2. Click the gear ⚙ icon next to "Type" → select **Web app**
3. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**
5. Click **Authorize access** → choose your Google account → Allow
6. Copy the **Web App URL** (looks like `https://script.google.com/macros/s/.../exec`)

> **Important:** Every time you update the Apps Script code, you must redeploy with a **New version** — go to Deploy → Manage deployments → Edit (pencil icon) → Version: New version → Deploy.

### Step 4 — Configure the HTML App

Open `store-logger.html` in a text editor and find this line near the top of the `<script>` section:

```javascript
const SCRIPT_URL = 'YOUR_APPS_SCRIPT_WEB_APP_URL_HERE';
```

Replace the placeholder with your actual Apps Script Web App URL from Step 3.

### Step 5 — Host on GitHub Pages

1. Create a new repository on GitHub (can be private or public)
2. Upload `store-logger.html` to the repository
3. Go to **Settings → Pages**
4. Under "Source", select **Deploy from a branch** → choose `main` branch → `/ (root)`
5. Click **Save**
6. Your app will be live at:
   ```
   https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/store-logger.html
   ```

Share this URL with your team. That's it.

---

## Usage

### Logging Daily Entries

1. Open the app and sign in
2. Select a **date** and **store** from the toolbar
3. Click **+ Add Entry** to add a transaction row
4. Fill in Qty, Amount, Remark, and set the Status
5. Each entry auto-saves to Google Sheets after 1.5 seconds
6. The **Updated By** column shows who last edited each row and when

### Summary View

Switch to the **Summary** tab to view data for any date:
- **All Stores** — each store as a separate card
- **Overall (Field-wise)** — totals rolled up across all stores by field type
- **Individual store** — drill into one store only

Use the status filter bar (All / Pending / In Progress / Completed) to filter across both views.

### Admin Panel (Admin role only)

- **User Management** — add, edit, delete users; assign roles and stores
- **Manage Stores** — add or remove store names
- **Manage Fields** — add or remove transaction field types
- **Export JSON** — download all data as a JSON backup file
- **Export CSV** — download all data as a spreadsheet-friendly CSV
- **Import JSON** — restore or merge data from a JSON export
- **Pull from Sheet** — force a fresh sync from Google Sheets
- **Push All to Sheet** — overwrite the sheet with current local data
- **Deduplicate & Push** — remove duplicate field entries per store per date, then push clean data

---

## How Data Sync Works

```
User opens app / clicks Sync
        ↓
App fetches fresh data from Google Sheets via Apps Script
        ↓
Data displayed in UI (no localStorage used for data)
        ↓
User makes an edit
        ↓
Change saved locally in memory → auto-pushed to sheet after 1.5s
```

- **No stale data** — every login and every sync pulls fresh from the sheet
- **No localStorage** for data — everything lives in Google Sheets
- **Multiple users** see the same data (sync on login, or tap the Sync button)
- **Offline** — the app will show an error if the sheet cannot be reached

---

## Security Notes

- Passwords are stored as plain text in Google Sheets — suitable for internal team use, not for public-facing apps
- The Apps Script Web App URL acts as the API — keep it private; anyone with the URL can read/write the sheet
- For stronger security, consider adding IP restrictions via Google Cloud or using Google OAuth
- The Google Sheet itself can be restricted to your Google account only — the Apps Script runs as you regardless

---

## Updating the App Script

After making any changes to `storelog-apps-script.gs`:

1. Open Apps Script editor
2. Paste the updated code
3. Go to **Deploy → Manage deployments**
4. Click the **pencil icon** on your deployment
5. Change Version to **New version**
6. Click **Deploy**

Failing to create a new version means the old cached code keeps running.

---

## Troubleshooting

| Issue | Likely Cause | Fix |
|---|---|---|
| Login fails with "Could not reach server" | Apps Script URL wrong or not deployed | Check `SCRIPT_URL` in HTML and redeploy |
| Data shows but is empty after sync | Sheet tabs not named correctly | Tabs must be exactly `data`, `users`, `meta` |
| Dates show wrong day | Timezone mismatch | The app handles IST (UTC+5:30) automatically |
| Sync dot stays red | Network or CORS issue | Check browser console; try redeploying Apps Script |
| Duplicate entries in sheet | Old entries from before dedup fix | Use Admin → Deduplicate & Push |
| Changes not saving | Apps Script not redeployed after update | Always deploy as New version after code changes |
