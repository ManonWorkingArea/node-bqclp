import CryptoJS from 'crypto-js';
const localStorage = window.localStorage;
class StorageManager {
  constructor() {
    this.useEncryption  = false; // default to not using encryption
    this.secretKey      = 'my-secret-key'; // change this to your own secret key
  }

  get(name, key = null) {
    const item = localStorage.getItem(name);
    if (!item) {
      return null;
    }
    const data = this.useEncryption ? this.decrypt(item) : JSON.parse(item);
    if (key) {
      return data[key];
    }
    return data;
  }

  set(name, item) {
    const data = this.useEncryption ? this.encrypt(item) : JSON.stringify(item);
    localStorage.setItem(name, data);
  }

  update(name, newItem) {
    const existingItem = this.get(name);
    if (existingItem) {
      const mergedItem = { ...existingItem, ...newItem };
      this.set(name, mergedItem);
    } else {
      this.set(name, newItem);
    }
  }

  delete(name) {
    localStorage.removeItem(name);
    location.reload();
  }

  encrypt(data) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), this.secretKey).toString();
  }

  decrypt(ciphertext) {
    const bytes = CryptoJS.AES.decrypt(ciphertext, this.secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }
  
  setEncryption(enabled) {
    this.useEncryption = enabled;
  }
}

const storageManager = new StorageManager();

export default storageManager;
