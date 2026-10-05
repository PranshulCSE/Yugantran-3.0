import { google } from "googleapis";
import { Readable } from "stream";
import { getGoogleServiceAccountCredentials } from "./googleAuthHelper.js";

const getAuthClient = () => {
  const creds = getGoogleServiceAccountCredentials();
  if (!creds || !creds.isValid) {
    return null;
  }

  return new google.auth.GoogleAuth({
    credentials: {
      client_email: creds.clientEmail,
      private_key: creds.privateKey,
    },
    scopes: ["https://www.googleapis.com/auth/drive.file"],
  });
};

/**
 * Uploads a file buffer to Google Drive
 * @param {Buffer} buffer - File buffer (from multer memoryStorage)
 * @param {string} filename - Desired filename in Drive
 * @param {string} mimeType - File MIME type
 * @returns {{ fileId: string, webViewLink: string, directLink: string }}
 */
export async function uploadToDrive(buffer, filename, mimeType) {
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID || "";

  // 1. Primary Method: Google Apps Script Webhook (Works with personal 15GB Gmail, 0 MB quota bypass)
  const webhookUrl = process.env.GOOGLE_DRIVE_WEBHOOK_URL;
  if (webhookUrl && webhookUrl.startsWith("http")) {
    try {
      const base64 = buffer.toString("base64");
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s max timeout

      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify({
          base64,
          filename,
          mimeType,
          folderId,
        }),
        redirect: "follow",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await res.json();
      if (data && data.success) {
        console.log(`✅ [Google Drive Webhook] File uploaded successfully: ${filename} (ID: ${data.fileId})`);
        return {
          fileId: data.fileId,
          webViewLink: data.webViewLink,
          directLink: data.directLink || `https://drive.google.com/uc?export=view&id=${data.fileId}`,
        };
      } else {
        throw new Error(data?.error || "Apps Script returned unsuccessful status");
      }
    } catch (webhookErr) {
      console.warn("⚠️ Google Apps Script Webhook upload failed:", webhookErr.name === "AbortError" ? "Timeout after 12s" : webhookErr.message);
      // Fall through to try Service Account or other fallbacks
    }
  }

  // 2. Secondary Method: Google Service Account (for Workspace Shared Drives)
  if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
    const auth = getAuthClient();
    const drive = google.drive({ version: "v3", auth });

    // Convert buffer to readable stream
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    const response = await drive.files.create({
      requestBody: {
        name: filename,
        parents: folderId ? [folderId] : [],
      },
      media: {
        mimeType,
        body: stream,
      },
      fields: "id, webViewLink, webContentLink",
      supportsAllDrives: true,
    });

    const fileId = response.data.id;

    // Make file publicly viewable
    try {
      await drive.permissions.create({
        fileId,
        supportsAllDrives: true,
        requestBody: {
          role: "reader",
          type: "anyone",
        },
      });
    } catch (permErr) {
      console.warn("⚠️ Drive permission warning:", permErr.message);
    }

    const file = await drive.files.get({
      fileId,
      supportsAllDrives: true,
      fields: "id, webViewLink, webContentLink",
    });

    return {
      fileId: file.data.id,
      webViewLink: file.data.webViewLink || `https://drive.google.com/file/d/${file.data.id}/view`,
      directLink: `https://drive.google.com/uc?export=view&id=${file.data.id}`,
    };
  }

  throw new Error("No Google Drive configuration found (neither GOOGLE_DRIVE_WEBHOOK_URL nor GOOGLE_CLIENT_EMAIL).");
}

/**
 * Deletes a file from Google Drive
 */
export async function deleteFromDrive(fileId) {
  try {
    const auth = getAuthClient();
    const drive = google.drive({ version: "v3", auth });
    await drive.files.delete({ fileId });
    console.log(`🗑️ Drive file deleted: ${fileId}`);
  } catch (error) {
    console.error("❌ Drive delete error:", error.message);
  }
}
