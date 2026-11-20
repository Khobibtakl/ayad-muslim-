export async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function deriveAesKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: 120000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToBytes(b64: string): Uint8Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export interface BackupEnvelope {
  app: 'eyad-al-muslim';
  schemaVersion: number;
  createdAt: number;
  encrypted: boolean;
  salt?: string;
  iv?: string;
  checksum: string;
  payload: unknown;
}

export async function createBackupFile(
  data: unknown,
  password?: string
): Promise<BackupEnvelope> {
  const json = JSON.stringify(data);
  const checksum = await sha256Hex(json);

  if (!password || !password.trim()) {
    return {
      app: 'eyad-al-muslim',
      schemaVersion: 1,
      createdAt: Date.now(),
      encrypted: false,
      checksum,
      payload: data,
    };
  }

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveAesKey(password, salt);
  const cipherBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv as BufferSource },
    key,
    new TextEncoder().encode(json)
  );

  return {
    app: 'eyad-al-muslim',
    schemaVersion: 1,
    createdAt: Date.now(),
    encrypted: true,
    salt: bytesToBase64(salt),
    iv: bytesToBase64(iv),
    checksum,
    payload: bytesToBase64(new Uint8Array(cipherBuffer)),
  };
}

export async function parseBackupFile(
  rawText: string,
  password?: string
): Promise<{ valid: boolean; data?: Record<string, unknown>; error?: string }> {
  try {
    const parsed = JSON.parse(rawText) as BackupEnvelope;
    if (parsed.app !== 'eyad-al-muslim' || typeof parsed.schemaVersion !== 'number') {
      return { valid: false, error: 'INVALID_FORMAT' };
    }

    if (!parsed.encrypted) {
      const json = JSON.stringify(parsed.payload);
      const check = await sha256Hex(json);
      if (parsed.checksum && check !== parsed.checksum) {
        return { valid: false, error: 'CHECKSUM_MISMATCH' };
      }
      return { valid: true, data: parsed.payload as Record<string, unknown> };
    }

    if (!password) {
      return { valid: false, error: 'PASSWORD_REQUIRED' };
    }
    if (!parsed.salt || !parsed.iv || typeof parsed.payload !== 'string') {
      return { valid: false, error: 'CORRUPTED_ENCRYPTED_PAYLOAD' };
    }

    const salt = base64ToBytes(parsed.salt);
    const iv = base64ToBytes(parsed.iv);
    const cipherBytes = base64ToBytes(parsed.payload);
    const key = await deriveAesKey(password, salt);

    const plainBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv as BufferSource },
      key,
      cipherBytes as BufferSource
    );
    const plainText = new TextDecoder().decode(plainBuffer);
    const check = await sha256Hex(plainText);
    if (parsed.checksum && check !== parsed.checksum) {
      return { valid: false, error: 'CHECKSUM_MISMATCH' };
    }

    return { valid: true, data: JSON.parse(plainText) as Record<string, unknown> };
  } catch {
    return { valid: false, error: 'DECRYPT_OR_PARSE_FAILED' };
  }
}
