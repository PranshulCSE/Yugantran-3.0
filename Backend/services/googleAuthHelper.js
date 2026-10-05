import crypto from "crypto";

/**
 * Normalizes and cleans a Google Service Account Private Key.
 * Handles edge cases when copying/pasting into Render, Vercel, .env files,
 * such as literal `\n`, escaped `\\n`, Windows `\r\n`, surrounding quotes,
 * full JSON credentials object, or missing PEM headers.
 *
 * @param {string} rawKey - Raw private key string or JSON from environment variable
 * @returns {string} Normalized PEM private key
 */
export function formatPrivateKey(rawKey) {
  if (!rawKey) return "";
  let key = String(rawKey).trim();

  // 1. If user pasted the whole service account JSON file
  if (key.startsWith("{") && key.endsWith("}")) {
    try {
      const parsed = JSON.parse(key);
      if (parsed.private_key) {
        key = parsed.private_key;
      }
    } catch (e) {
      // ignore
    }
  }

  // 2. Strip surrounding single or double quotes or backticks
  key = key.replace(/^["'`]+|["'`]+$/g, "").trim();

  // 3. Unescape escaped quotes (\")
  key = key.replace(/\\"/g, '"');

  // 4. Handle literal or escaped \r and \n
  key = key
    .replace(/\\r/g, "")
    .replace(/\r/g, "")
    .replace(/\\\\n/g, "\n")
    .replace(/\\n/g, "\n");

  // 5. If key is base64 encoded without headers, decode it
  if (!key.includes("-----BEGIN") && /^[A-Za-z0-9+/=\s]+$/.test(key) && key.length > 500) {
    try {
      const decoded = Buffer.from(key, "base64").toString("utf-8");
      if (decoded.includes("-----BEGIN")) {
        key = decoded;
      }
    } catch (e) {
      // ignore
    }
  }

  // 6. Fix header/footer if missing
  const hasBegin = key.includes("-----BEGIN PRIVATE KEY-----");
  const hasEnd = key.includes("-----END PRIVATE KEY-----");

  if (!hasBegin && !hasEnd) {
    key = `-----BEGIN PRIVATE KEY-----\n${key}\n-----END PRIVATE KEY-----`;
  }

  // 7. Ensure proper line breaks around header and footer
  key = key
    .replace(/-----BEGIN PRIVATE KEY-----\s*/, "-----BEGIN PRIVATE KEY-----\n")
    .replace(/\s*-----END PRIVATE KEY-----/, "\n-----END PRIVATE KEY-----");

  return key.trim() + "\n";
}

/**
 * Validates whether Node.js crypto / OpenSSL can successfully decode the private key.
 *
 * @param {string} privateKey - Normalized PEM key
 * @returns {{ valid: boolean, error?: string }}
 */
export function validatePrivateKey(privateKey) {
  if (!privateKey) {
    return { valid: false, error: "Private key is empty or missing." };
  }

  try {
    crypto.createPrivateKey(privateKey);
    return { valid: true };
  } catch (err) {
    return {
      valid: false,
      error: `OpenSSL key decoding failed (${err.message}). Check your GOOGLE_PRIVATE_KEY formatting on Render.`,
    };
  }
}

/**
 * Retrieves and formats Google Service Account credentials from environment variables.
 *
 * @returns {{ clientEmail: string, privateKey: string, isValid: boolean, error?: string } | null}
 */
export function getGoogleServiceAccountCredentials() {
  let clientEmail = (process.env.GOOGLE_CLIENT_EMAIL || "").trim();
  let rawKey = (process.env.GOOGLE_PRIVATE_KEY || "").trim();

  // If user pasted entire service account JSON into GOOGLE_CLIENT_EMAIL or GOOGLE_PRIVATE_KEY
  if (clientEmail.startsWith("{") && clientEmail.endsWith("}")) {
    try {
      const parsed = JSON.parse(clientEmail);
      if (parsed.client_email) clientEmail = parsed.client_email;
      if (parsed.private_key && !rawKey) rawKey = parsed.private_key;
    } catch (e) {}
  }

  if (rawKey.startsWith("{") && rawKey.endsWith("}")) {
    try {
      const parsed = JSON.parse(rawKey);
      if (parsed.client_email && !clientEmail) clientEmail = parsed.client_email;
      if (parsed.private_key) rawKey = parsed.private_key;
    } catch (e) {}
  }

  if (!clientEmail || !rawKey) {
    return null;
  }

  const privateKey = formatPrivateKey(rawKey);
  const validation = validatePrivateKey(privateKey);

  if (!validation.valid) {
    console.error(`❌ [Google Auth] ${validation.error}`);
  }

  return {
    clientEmail,
    privateKey,
    isValid: validation.valid,
    error: validation.error,
  };
}
