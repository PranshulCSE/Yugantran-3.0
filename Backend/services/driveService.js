import { google } from "googleapis";
import { Readable } from "stream";

const getAuthClient = () => {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY
        ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n")
        : undefined,
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
  const auth = getAuthClient();
  const drive = google.drive({ version: "v3", auth });

  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

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
  });

  const fileId = response.data.id;

  // Make file publicly viewable (so admins can click link)
  await drive.permissions.create({
    fileId,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  });

  // Get updated link
  const file = await drive.files.get({
    fileId,
    fields: "id, webViewLink, webContentLink",
  });

  return {
    fileId: file.data.id,
    webViewLink: file.data.webViewLink,
    directLink: `https://drive.google.com/uc?export=view&id=${file.data.id}`,
  };
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
