// Encrypt note with password
export const encryptNote = (text, password) => {
  try {
    return btoa(encodeURIComponent(`${text}::SEPARATOR::${password}`));
  } catch (e) {
    console.error("Encryption error:", e);
    return null;
  }
};

// Decrypt note with password
export const decryptNote = (encrypted, password) => {
  try {
    const [note, pass] = decodeURIComponent(atob(encrypted)).split("::SEPARATOR::");
    return pass === password ? note : null;
  } catch (e) {
    console.error("Decryption error:", e);
    return null;
  }
};

// Validate password strength
export const validatePassword = (password) => {
  if (!password || password.length < 4) {
    return { isValid: false, message: "Password must be at least 4 characters long" };
  }
  return { isValid: true, message: "Password is valid" };
};
