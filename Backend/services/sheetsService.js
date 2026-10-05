import { google } from "googleapis";

/**
 * Extracts clean Google Spreadsheet ID from either raw ID or full Google Sheets URL
 */
export const extractSpreadsheetId = (raw) => {
  if (!raw) return "";
  const cleaned = String(raw).trim().replace(/^["']|["']$/g, "");
  const match = cleaned.match(/\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : cleaned;
};

/**
 * Sanitizes event name for Google Sheet tab title
 * Sheet tab names cannot contain: * ? : / \ [ ] and cannot exceed 100 characters.
 */
export const sanitizeSheetTitle = (title) => {
  const clean = (title || "General")
    .trim()
    .replace(/[*?:/\\\[\]]/g, "_")
    .substring(0, 95);
  return clean || "General";
};

/**
 * Escapes sheet tab title for Google Sheets A1 notation.
 * Single quotes in sheet names must be doubled (' -> '') when enclosed in quotes.
 */
export const a1Range = (sheetTitle, cellRange) => {
  const escaped = sheetTitle.replace(/'/g, "''");
  return `'${escaped}'!${cellRange}`;
};

/**
 * Returns Google Auth Client with Sheets and Drive scopes
 */
const getSheetsAuthClient = () => {
  const clientEmail = (process.env.GOOGLE_CLIENT_EMAIL || "").trim();
  let privateKey = (process.env.GOOGLE_PRIVATE_KEY || "").trim();

  if (!clientEmail || !privateKey) {
    return null;
  }

  // Strip leading/trailing surrounding quotes if present
  if (
    (privateKey.startsWith('"') && privateKey.endsWith('"')) ||
    (privateKey.startsWith("'") && privateKey.endsWith("'"))
  ) {
    privateKey = privateKey.slice(1, -1);
  }

  // Convert literal \n to real newlines
  privateKey = privateKey.replace(/\\n/g, "\n");

  return new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive.file",
    ],
  });
};

/**
 * Appends a confirmed registration record to the designated Google Sheet under an event-specific tab.
 * Creates the event tab with header row if it doesn't already exist.
 *
 * @param {Object} registration - Mongoose Registration Document / Object
 * @returns {Promise<{ success: boolean, sheetTitle?: string, updatedRange?: string, error?: string }>}
 */
export async function appendConfirmedRegistrationToSheet(registration) {
  const spreadsheetId = extractSpreadsheetId(process.env.GOOGLE_SHEET_ID);

  if (!spreadsheetId) {
    console.warn("⚠️ [Google Sheets] GOOGLE_SHEET_ID is not configured in .env. Skipping sheet sync.");
    return { success: false, error: "GOOGLE_SHEET_ID not set" };
  }

  const auth = getSheetsAuthClient();
  if (!auth) {
    console.warn("⚠️ [Google Sheets] GOOGLE_CLIENT_EMAIL or GOOGLE_PRIVATE_KEY missing. Skipping sheet sync.");
    return { success: false, error: "Google credentials not set" };
  }

  try {
    const sheets = google.sheets({ version: "v4", auth });

    // Sanitize event name to create valid Google Sheet tab title
    const sheetTitle = sanitizeSheetTitle(registration.eventName);

    // 1. Fetch spreadsheet metadata to check existing tabs
    const meta = await sheets.spreadsheets.get({ spreadsheetId });
    const existingSheets = meta.data.sheets || [];
    const matchedSheet = existingSheets.find(
      (s) => s.properties?.title?.toLowerCase() === sheetTitle.toLowerCase()
    );

    // Standard headers
    const headers = [
      "S.No",
      "Registration ID",
      "Participant Name",
      "Roll Number",
      "Program",
      "Semester",
      "Mobile Number",
      "Email",
      "College / University",
      "Team Type",
      "Team Name",
      "Team Members",
      "UPI ID",
      "Transaction ID",
      "Payment Receipt Link",
      "Confirmed Date & Time",
    ];

    // 2. If event tab doesn't exist, create it and insert header row
    let activeSheetTitle = matchedSheet ? matchedSheet.properties.title : sheetTitle;

    if (!matchedSheet) {
      console.log(`📊 [Google Sheets] Creating new tab for event: "${sheetTitle}"...`);

      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: sheetTitle,
                  gridProperties: {
                    frozenRowCount: 1,
                  },
                },
              },
            },
          ],
        },
      });

      // Insert headers
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: a1Range(sheetTitle, "A1:P1"),
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [headers],
        },
      });
      activeSheetTitle = sheetTitle;
      console.log(`✅ [Google Sheets] Tab "${sheetTitle}" created with headers.`);
    }

    // 3. Count existing rows in this event tab to determine Serial Number (S.No)
    let serialNo = 1;
    try {
      const readRes = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: a1Range(activeSheetTitle, "A:A"),
      });
      const existingRows = readRes.data.values ? readRes.data.values.length : 1;
      serialNo = existingRows; // Row 1 is header, so row 2 is S.No 1
    } catch (readErr) {
      console.warn("⚠️ [Google Sheets] Row count read notice:", readErr.message);
      serialNo = 1;
    }

    // 4. Format team members
    let formattedMembers = "-";
    let membersList = registration.teamMembers;
    if (typeof membersList === "string") {
      try {
        membersList = JSON.parse(membersList);
      } catch {
        membersList = [];
      }
    }
    if (Array.isArray(membersList) && membersList.length > 0) {
      formattedMembers = membersList
        .map(
          (m, idx) =>
            `${idx + 1}. ${m.name || "N/A"} (Roll: ${m.rollNumber || "-"}, Branch: ${m.program || "-"}, College: ${m.college || "-"})`
        )
        .join("\n");
    }

    // Format confirmed timestamp in Indian Standard Time (IST)
    const confirmedTime = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });

    // 5. Prepare Row Data
    const rowValues = [
      serialNo,
      String(registration._id),
      registration.name || "-",
      registration.rollNumber || "-",
      registration.program || "-",
      registration.semester || "-",
      registration.mobileNumber || "-",
      registration.email || "-",
      registration.college || "-",
      registration.teamType || "individual",
      registration.teamName || "-",
      formattedMembers,
      registration.upiId || "-",
      registration.transactionId || "-",
      registration.paymentReceiptUrl || "-",
      confirmedTime,
    ];

    // 6. Append row to the sheet
    const appendRes = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: a1Range(activeSheetTitle, "A:P"),
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [rowValues],
      },
    });

    console.log(
      `✅ [Google Sheets] Entry added to "${activeSheetTitle}" for ${registration.name} (S.No: ${serialNo})`
    );

    return {
      success: true,
      sheetTitle: activeSheetTitle,
      updatedRange: appendRes.data?.updates?.updatedRange,
    };
  } catch (error) {
    console.error("❌ [Google Sheets] Error appending registration:", error.message || error);
    return { success: false, error: error.message };
  }
}
