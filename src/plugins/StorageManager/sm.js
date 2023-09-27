// sm.js
import s3 from './source/s3';
import mongodb from './source/mongodb';
import mysql from './source/mysql';
import sessionStorage from './source/sessionStorage';
import localStorage from './source/localStorage';
import cookie from './source/cookie';

/**
 * Storage Manager (sm) - A utility to manage multiple storage sources.
 *
 * Available sources:
 * 1. s3: Amazon S3
 * 2. mongodb: MongoDB
 * 3. mysql: MySQL
 * 4. sessionStorage: Session Storage
 * 5. localStorage: Local Storage
 * 6. cookie: Cookies
 *
 * Note: Some functions may not be supported by all storage sources.
 */
const sm = {
  sources: {
    s3,
    mongodb,
    mysql,
    sessionStorage,
    localStorage,
    cookie,
  },

  // Set a value for a given key in the specified storage source.
  // Usage: sm.set('s3', 'key', 'data', { prefix: 'customPrefix' });
  async set(sourceName, key, value, options) {
    const source = this.sources[sourceName];
    await source.set(key, value, options);
  },

  // Get a value for a given key from the specified storage source.
  // Usage: const data = await sm.get('s3', 'key', { prefix: 'customPrefix' });
  async get(sourceName, key, options) {
    const source = this.sources[sourceName];
    return await source.get(key, options);
  },

  // Delete a value for a given key in the specified storage source.
  // Usage: sm.delete('s3', 'key', { prefix: 'customPrefix' });
  async delete(sourceName, key, options) {
    const source = this.sources[sourceName];
    await source.delete(key, options);
  },

  // Destroy all data in the specified storage source.
  // Usage: sm.destroy('s3', { prefix: 'customPrefix' });
  async destroy(sourceName, options) {
    const source = this.sources[sourceName];
    await source.destroy(options);
  },

  // Query data in the specified storage source using the provided filter.
  // Usage: const results = await sm.query('mongodb', { field: 'value' }, { projection: { field: 1 }, limit: 10 });
  async query(sourceName, filter, options) {
    const source = this.sources[sourceName];
    if (source.query) {
      return await source.query(filter, options);
    } else {
      throw new Error(`The selected source does not support the 'query' function.`);
    }
  },
};

export default sm;
