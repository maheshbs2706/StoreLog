# StoreLog

A daily business logging app for tracking store-level transactions — sales, purchases, returns, payments, stock transfers, and more. Built as a single HTML file, hosted on GitHub Pages, with Google Sheets as the database backend.

---

## Features

- **Multi-store support** — log entries per store per date
- **Flexible field types** — Sale, Purchase, Return, Payment, Stock Transfer, JV, Stock Item — add new ones anytime
- **Per-entry tracking** — Qty, Amount, Remark (multi-line), Status (Pending / In Progress / Completed)
- **Activity log** — every entry records who added or edited it and when, in device local time
- **Status filter bar** — filter by All / Pending / In Progress / Completed across both tabs, with live counts
- **Summary view** — view by store, all stores, or field-wise overall totals for any date
- **User management** — Admin, Editor, Viewer roles with per-store access control via checkbox list
- **Google Sheets sync** — all data lives in Google Sheets, fetched fresh on every login
- **Backups** — create named backup snapshots, restore to any previous state with one click
- **Export** — download all data as JSON or CSV
- **Import** — restore or merge data from a previously exported JSON file
- **Action locking** — all action buttons disable and show a spinner during async operations to prevent double-clicks
- **Light & Dark theme** — toggle anytime, preference saved in browser
- **Mobile friendly** — card-per-row layout on small screens, sticky header and filter bar, no horizontal scrolling

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

Create a Google Sheet with **4 tabs** named exactly as below:

### `data` tab
Stores all daily log entries.

| date | store | field | qty | amount | remark | status | updatedBy | updatedAt |
|---|---|---|---|---|---|---|---|---|
| 2026-04-12 | Main Store | Sale | 10 | 5000 | cash sale | completed | admin | 12 Apr 2026, 10:30 am |

### `users` tab
Stores user accounts and roles.

| username | password | role | stores |
|---|---|---|---|
| admin | yourpassword | admin | all |
| ravi | password123 | editor | Main Store, Branch A |
| priya | password456 | viewer | all |

**Roles:**
- `admin` — full access, user management, backups, export/import, all stores
- `editor` — can add and edit entries for their assigned stores only
- `viewer` — read-only access to assigned stores

**Stores column:** use `all` for access to all stores, or comma-separated store names for specific access (e.g. `Main Store, Branch A`).

### `meta` tab
Stores configuration — stores list and field types. Managed automatically by the app.

| key | value |
|---|---|
| stores | ["Main Store","Branch A"] |
| fields | ["Sale","Purchase","Return","Payment","Stock Transfer","JV","Stock Item"] |

### `backups` tab
Stores backup snapshots created from the Admin panel. Add this header row manually:

| id | label | createdBy | createdAt | totalRows | jsonBlob |
|---|---|---|---|---|---|

Leave the remaining rows empty — the app fills them in when you create backups.

---

## Setup Guide

### Step 1 — Create the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new spreadsheet
2. Rename the default sheet tab to `data`
3. Create three more tabs named `users`, `meta`, and `backups`
4. Add the header rows to each tab as shown above
5. Add your first admin user in the `users` tab row 2

### Step 2 — Set Up Google Apps Script

1. In your Google Sheet, go to **Extensions → Apps Script**
2. Delete all existing code in the editor
3. Paste the contents of `storelog-apps-script.gs`
4. Replace `YOUR_SHEET_ID_HERE` with your actual Google Sheet ID
   - The Sheet ID is in the URL: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit`
5. Press **Ctrl+S** to save and name the project `StoreLog`

### Step 3 — Deploy the Apps Script

1. Click **Deploy → New deployment**
2. Click the gear ⚙ icon next to "Type" → select **Web app**
3. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**
5. Click **Authorize access** → choose your Google account → Allow
6. Copy the **Web App URL** — it looks like `https://script.google.com/macros/s/.../exec`

> **Important:** Every time you update the Apps Script code, you must redeploy with a **New version** — go to Deploy → Manage deployments → Edit (pencil icon) → Version: New version → Deploy. Failing to do this means the old cached code keeps running.

### Step 4 — Configure the HTML App

Open `store-logger.html` in a text editor and find this line near the top of the `<script>` section:

```javascript
const SCRIPT_URL = 'YOUR_APPS_SCRIPT_WEB_APP_URL_HERE';
```

Replace the placeholder with your actual Apps Script Web App URL from Step 3.

### Step 5 — Host on GitHub Pages

1. Create a new repository on GitHub (can be private or public)
2. Upload `store-logger.html` and `README.md` to the repository
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

1. Open the app and sign in — data is always fetched fresh from Google Sheets on login
2. Select a **date** and **store** from the toolbar
3. Click **+ Add Entry** to add a transaction row
4. Each row has a field type dropdown (only unused fields shown), Qty, Amount, multi-line Remark, and Status
5. Changes auto-save to Google Sheets after 1.5 seconds — the sync indicator shows the status
6. The **Updated By** column shows who last edited each row and the local time of the edit
7. Field types already added for the selected date/store are hidden from the dropdown to prevent duplicates

### Summary View

Switch to the **Summary** tab to view data for any date independently from the Daily Log:

- **All Stores** — each store shown as a separate card with its own table
- **Overall (Field-wise)** — totals rolled up across all stores, broken down by field type
- **Individual store** — select a specific store from the dropdown

Use the status filter bar (All / Pending / In Progress / Completed) to filter rows across both the Daily Log and Summary views simultaneously. Filter counts update instantly when any status changes.

### Theme Toggle

Click the 🌙 / ☀️ button in the top-right corner — visible on both the login screen and inside the app — to switch between dark and light mode. The preference is saved in the browser and applied automatically on the next visit.

### Mobile Layout

On phones and small screens the app adapts automatically. The header collapses to two rows (logo + controls on top, tabs below), the filter bar sticks below the header, and the data table switches to a **card-per-row** layout where each field is shown as a labelled line. Remarks wrap fully across multiple lines. No horizontal scrolling anywhere.

### Admin Panel (Admin role only)

**User Management**
- Add, edit, or delete users
- Assign role: Admin, Editor, or Viewer
- Assign stores via a checkbox list — tick individual stores or select "All Stores" (default)

**Stores & Fields**
- Add or remove store names — reflected immediately across the app and saved to the sheet
- Add or remove transaction field types

**Export / Import**
- **Export JSON** — downloads all current data as a `.json` file
- **Export CSV** — downloads all data as a `.csv` spreadsheet
- **Import JSON** — merges data from a previously exported JSON file and pushes to sheet

**Backups**
- **Create Backup** — saves a full snapshot of all current data (stores, fields, entries) into the `backups` sheet tab, stamped with who created it and when (local time)
- **Refresh List** — loads all saved backups, newest first, showing the timestamp, creator, and entry count
- **Download** — saves any individual backup as a `.json` file to your device
- **Restore** — shows a confirmation warning, then overwrites all current data with the selected backup and pushes it to the sheet

> Best practice: always create a backup before running Deduplicate & Push or importing data.

**Google Sheets Sync**
- **Pull from Sheet** — force a full fresh fetch from Google Sheets
- **Push All to Sheet** — overwrite the sheet with all current in-memory data
- **Deduplicate & Push** — removes duplicate field entries (keeps the last one per field per store per date), then pushes the clean data to the sheet

All action buttons disable and show a loading spinner while an operation is in progress, preventing accidental double-clicks.

---

## How Data Sync Works

```
User logs in
      ↓
App fetches users, data, meta, and stores fresh from Google Sheets
      ↓
Data held in memory for the session
      ↓
User makes an edit
      ↓
Change saved in memory → auto-pushed to sheet after 1.5s
      ↓
User clicks Sync or logs in again → fresh fetch from sheet
```

- **No stale data** — every login pulls fresh from the sheet, no localStorage caching for data
- **All timestamps** — stored and displayed in the device's local timezone
- **Multiple users** — each user always gets live data on login; use the Sync button to refresh mid-session
- **Offline** — if the sheet is unreachable, the app shows an error and an empty state rather than showing old data

---

## Security Notes

- Passwords are stored as plain text in Google Sheets — suitable for internal team use among trusted people, not for public-facing apps
- The Apps Script Web App URL acts as the API endpoint — keep it private; anyone with the URL can read and write the sheet
- The Google Sheet itself can be restricted to your Google account — the Apps Script runs as you regardless of who calls it
- For stronger security, consider Google OAuth login or moving to a proper backend with hashed passwords

---

## Updating the Apps Script

After making changes to `storelog-apps-script.gs`:

1. Open the Apps Script editor
2. Paste the updated code and save
3. Go to **Deploy → Manage deployments**
4. Click the **pencil icon** on your active deployment
5. Change Version to **New version**
6. Click **Deploy**

Always create a new version — editing in place does not update the deployed Web App.

---

## Troubleshooting

| Issue | Likely Cause | Fix |
|---|---|---|
| Login fails with "Could not reach server" | Apps Script URL wrong or not deployed | Check `SCRIPT_URL` in HTML and redeploy Apps Script |
| Data is empty after sync | Sheet tabs not named correctly | Tabs must be exactly `data`, `users`, `meta`, `backups` |
| Dates show the wrong day | Timezone offset issue | App now uses device local timezone automatically |
| Sync dot stays red | Network or CORS error | Check browser console; try redeploying Apps Script as new version |
| Duplicate entries in sheet | Multiple add-entry clicks before fix | Use Admin → Deduplicate & Push |
| Changes not saving to sheet | Apps Script not redeployed after update | Always deploy as New version after any code change |
| Table overflows on mobile | Old cached file version | Hard refresh (Ctrl+Shift+R) or clear browser cache |
| Theme resets on reload | Browser cleared localStorage | Re-toggle the theme; it saves back automatically |
| Backup restore says "not found" | Backup list not refreshed before restore | Click Refresh List before attempting to restore |
| Buttons stay disabled after error | Rare JS exception before finally block | Reload the page to reset button states |
