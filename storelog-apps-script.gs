// ============================================================
//  StoreLog — Google Apps Script Backend  (v3)
//  IMPORTANT: After pasting, redeploy as a NEW version:
//  Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy
// ============================================================

const SHEET_ID = '1tobXlF3kBIZcuUzIK4W9BrRuoe0m7Yu42rWaFj4bBd8';

// Sheet columns for 'data' tab:
// date | store | field | qty | amount | remark | status | updatedBy | updatedAt
function makeResponse(data) {
  const output = ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  return output;
}

// ── GET — read a sheet tab ───────────────────────────────────
function doGet(e) {
  try {
    const action = e.parameter.action;

    if (action === 'read') {
      const tab = e.parameter.tab;
      const ss = SpreadsheetApp.openById(SHEET_ID);
      const sheet = ss.getSheetByName(tab);

      if (!sheet) {
        return makeResponse({ ok: false, error: 'Tab not found: ' + tab });
      }

      const lastRow = sheet.getLastRow();
      const lastCol = sheet.getLastColumn();

      if (lastRow === 0 || lastCol === 0) {
        // Empty sheet — return ok with empty values
        return makeResponse({ ok: true, values: [] });
      }

      const values = sheet.getRange(1, 1, lastRow, lastCol).getValues();
      return makeResponse({ ok: true, values: values });
    }

    return makeResponse({ ok: false, error: 'Unknown action: ' + action });

  } catch (err) {
    return makeResponse({ ok: false, error: err.message });
  }
}

// ── POST — write to a sheet tab ──────────────────────────────
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const action = body.action;
    const ss = SpreadsheetApp.openById(SHEET_ID);

    // WRITE — clear tab and write all rows
    if (action === 'write') {
      const sheet = ss.getSheetByName(body.tab);
      if (!sheet) return makeResponse({ ok: false, error: 'Tab not found: ' + body.tab });

      sheet.clearContents();

      const rows = body.rows;
      if (rows && rows.length > 0) {
        // Convert all values to strings to avoid type issues
        const cleaned = rows.map(row =>
          row.map(cell => (cell === null || cell === undefined) ? '' : String(cell))
        );
        sheet.getRange(1, 1, cleaned.length, cleaned[0].length).setValues(cleaned);
      }
      return makeResponse({ ok: true, written: rows ? rows.length : 0 });
    }

    // APPEND — add one row to bottom
    if (action === 'append') {
      const sheet = ss.getSheetByName(body.tab);
      if (!sheet) return makeResponse({ ok: false, error: 'Tab not found: ' + body.tab });

      const row = body.row.map(cell => (cell === null || cell === undefined) ? '' : String(cell));
      sheet.appendRow(row);
      return makeResponse({ ok: true });
    }

    return makeResponse({ ok: false, error: 'Unknown action: ' + action });

  } catch (err) {
    return makeResponse({ ok: false, error: err.message });
  }
}
