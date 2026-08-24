// Client-side End-to-End Encryption (E2EE) helper using the Web Crypto API
// This ensures that raw message text never leaves the client's browser.
// The server only transmits the ciphertext and IV (Initialization Vector).

function arrayBufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToArrayBuffer(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes.buffer;
}

async function digestMessage(message: string): Promise<Uint8Array> {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  return new Uint8Array(hashBuffer);
}

async function getEncryptionKey(passphrase: string): Promise<CryptoKey> {
  const rawKey = await digestMessage(passphrase);
  return await crypto.subtle.importKey(
    'raw',
    rawKey,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptText(
  text: string,
  passphrase: string
): Promise<{ ciphertext: string; iv: string }> {
  try {
    const key = await getEncryptionKey(passphrase);
    const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV is recommended for GCM
    const encoded = new TextEncoder().encode(text);
    
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoded
    );

    return {
      ciphertext: arrayBufferToHex(encrypted),
      iv: arrayBufferToHex(iv.buffer),
    };
  } catch (err) {
    console.error('Encryption failed:', err);
    throw err;
  }
}

export async function decryptText(
  ciphertextHex: string,
  ivHex: string,
  passphrase: string
): Promise<string> {
  if (!ciphertextHex || !ivHex || !passphrase) {
    return '[Encrypted Message]';
  }
  try {
    const key = await getEncryptionKey(passphrase);
    const iv = hexToArrayBuffer(ivHex);
    const ciphertext = hexToArrayBuffer(ciphertextHex);

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    );

    return new TextDecoder().decode(decrypted);
  } catch (err) {
    // Return a beautiful warning rather than crashing or throwing
    return '🔒 [Decryption Key Mismatch - Unable to Decrypt]';
  }
}

// Key pair helper for User Profile/Dashboard demonstration
export async function generateDummyKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
  try {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: 'RSASSA-PKCS1-v1_5',
        modulusLength: 2048,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: { name: 'SHA-256' },
      },
      true,
      ['sign', 'verify']
    );

    const exportedPublic = await crypto.subtle.exportKey('spki', keyPair.publicKey);
    const exportedPrivate = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

    const pubBase64 = btoa(String.fromCharCode(...new Uint8Array(exportedPublic)));
    const privBase64 = btoa(String.fromCharCode(...new Uint8Array(exportedPrivate)));

    return {
      publicKey: `-----BEGIN PUBLIC KEY-----\n${pubBase64.match(/.{1,64}/g)?.join('\n')}\n-----END PUBLIC KEY-----`,
      privateKey: `-----BEGIN PRIVATE KEY-----\n${privBase64.match(/.{1,64}/g)?.join('\n')}\n-----END PRIVATE KEY-----`,
    };
  } catch (err) {
    console.error('Failed to generate keypair:', err);
    return {
      publicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAv396K... (Mock Public Key)',
      privateKey: 'MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBA... (Mock Private Key)',
    };
  }
}
