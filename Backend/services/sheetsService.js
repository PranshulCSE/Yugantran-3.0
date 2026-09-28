import { google } from "googleapis";

/**
 * Returns Google Auth Client with Sheets and Drive scopes
 */
const getSheetsAuthClient = () => {
  if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    return null;
  }

  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
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
 * @returns {Promise<{ success: boolean, sheetTitle?: string, row?: number, error?: string }>}
 */
export async function appendConfirmedRegistrationToSheet(registration) {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

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

    // Sanitize event name to create valid Google Sheet tab title (max 100 chars, no special characters like * ? : / \ [ ])
    const rawEventName = (registration.eventName || "General").trim();
    const sheetTitle = rawEventName.replace(/[*?:/\\\[\]]/g, "_").substring(0, 95) || "General";

    // 1. Fetch spreadsheet metadata to check existing tabs
    const meta = await sheets.spreadsheets.get({ spreadsheetId });
    const existingSheets = meta.data.sheets || [];
    const sheetExists = existingSheets.some(
      (s) => s.properties?.title?.toLowerCase() === sheetTitle.toLowerCase()
    );

    // 2. If event tab doesn't exist, create it and insert header row
    if (!sheetExists) {
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

      // Insert clean styled headers
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

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `'${sheetTitle}'!A1:P1`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [headers],
        },
      });
      console.log(`✅ [Google Sheets] Tab "${sheetTitle}" created with headers.`);
    }

    // 3. Count existing rows in this event tab to determine Serial Number (S.No)
    let serialNo = 1;
    try {
      const readRes = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `'${sheetTitle}'!A:A`,
      });
      const existingRows = readRes.data.values ? readRes.data.values.length : 1;
      serialNo = existingRows; // If row 1 is header, next row will be S.No 1
    } catch {
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

    // Format confirmed timestamp
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
      range: `'${sheetTitle}'!A:P`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [rowValues],
      },
    });

    console.log(
      `✅ [Google Sheets] Entry added to "${sheetTitle}" for ${registration.name} (S.No: ${serialNo})`
    );

    return {
      success: true,
      sheetTitle,
      updatedRange: appendRes.data?.updates?.updatedRange,
    };
  } catch (error) {
    console.error("❌ [Google Sheets] Error appending registration:", error.message || error);
    return { success: false, error: error.message };
  }
}
