import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

export const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});

export async function getGmailClient() {
  return google.gmail({ version: "v1", auth: oauth2Client });
}
