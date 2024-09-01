import type { StorageValue } from "unstorage";
import { kvStorage } from "../../config/store";

/**
 * Class representing a key-value storage system.
 */
class KV {
    private storage;
    private XBT_API_KEY: string;
    private XBT_SECRET_KEY: string;

    /**
     * Create a KV instance.
     * @param {string} XBT_API_KEY - The API key for authentication.
     * @param {string} XBT_SECRET_KEY - The secret key for authentication.
     */
    constructor(XBT_API_KEY: string, XBT_SECRET_KEY: string) {
        console.debug("Creating KV instance");
        this.XBT_API_KEY = this.validateEnvVariable(XBT_API_KEY, 'XBT_API_KEY');
        this.XBT_SECRET_KEY = this.validateEnvVariable(XBT_SECRET_KEY, 'XBT_SECRET_KEY');
        this.storage = kvStorage;
    }

    /**
     * Validate an environment variable.
     * @private
     * @param {string} value - The value of the environment variable.
     * @param {string} name - The name of the environment variable.
     * @returns {string} The validated environment variable.
     * @throws Will throw an error if the environment variable is not provided.
     */
    private validateEnvVariable(value: string, name: string): string {
        console.debug(`Validating environment variable: ${name}`);
        if (!value) {
            throw new Error(`${name} is required`);
        }
        return value;
    }

    /**
     * Get an item from the storage system.
     * @param {string} key - The key of the item to get.
     * @returns {Promise<T>} The item from the storage system.
     */
    async getItem<T>(key: string): Promise<T> {
        console.debug(`Getting item from storage: key=${key}`);
        const item = await this.storage.getItem(key);
        if (item === null) {
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
        console.debug(`Checking if item exists in storage: key=${key}`);
        const item = await this.storage.getItem(key);
        return item !== null;
    }

    /**
     * Set an item in the storage system.
     * @param {string} key - The key of the item to set.
     * @param {unknown} value - The value of the item to set.
     * @returns {Promise<void>}
     */
    async setItem(key: string, value: StorageValue): Promise<void> {
        console.debug(`Setting item in storage: key=${key}, value=${JSON.stringify(value)}`);
        await this.storage.setItem(key, value);
    }

    /**
     * Remove an item from the storage system.
     * @param {string} key - The key of the item to remove.
     * @returns {Promise<void>}
     */
    async removeItem(key: string): Promise<void> {
        console.debug(`Removing item from storage: key=${key}`);
        await this.storage.removeItem(key);
    }
}

export default KV;
