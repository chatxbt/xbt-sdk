import type { StorageValue } from "unstorage";
import { kvStorage } from "../../config/store";
import logger from "../../config/logger";

/**
 * Class representing a key-value storage system.
 */
class KV {
    private storage = kvStorage;

    /**
     * Create a KV instance.
     */
    constructor() {
        logger.debug("Creating KV instance");
    }

    /**
     * Get an item from the storage system.
     * @param {string} key - The key of the item to get.
     * @returns {Promise<T>} The item from the storage system.
     */
    async getItem<T>(key: string): Promise<T> {
        logger.debug(`Getting item from storage: key=${key}`);
        const item = await this.storage.getItem(key);
        if (item === null || item === undefined) {
            throw new Error(`Item with key ${key} not found`);
        }
        return item as T;
    }

    /**
     * Check if an item exists in the storage system.
     * @param {string} key - The key of the item to check.
     * @returns {Promise<boolean>} True if the item exists, false otherwise.
     */
    async hasItem(key: string): Promise<boolean> {
        logger.debug(`Checking if item exists in storage: key=${key}`);
        const item = await this.storage.hasItem(key);
        return item;
    }

    /**
     * Set an item in the storage system.
     * @param {string} key - The key of the item to set.
     * @param {unknown} value - The value of the item to set.
     * @returns {Promise<void>}
     */
    async setItem(key: string, value: StorageValue): Promise<void> {
        logger.debug(`Setting item in storage: key=${key}, value=${JSON.stringify(value)}`);
        const result = await this.storage.setItem(key, {value});
        logger.debug(`Set item in storage: key=${key}, result=${JSON.stringify(result)}`);
    }

    /**
     * Remove an item from the storage system.
     * @param {string} key - The key of the item to remove.
     * @returns {Promise<void>}
     */
    async removeItem(key: string): Promise<void> {
        logger.debug(`Removing item from storage: key=${key}`);
        await this.storage.removeItem(key);
    }
}

export default KV;
