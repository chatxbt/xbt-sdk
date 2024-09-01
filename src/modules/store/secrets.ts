import type { StorageValue } from "unstorage";
import { secretStorage } from "../../config/store";

/**
 * Class representing a secrets storage system.
 */
class Secrets {
    private storage = secretStorage;
    private XBT_API_KEY: string;
    private XBT_SECRET_KEY: string;

    /**
     * Create a Secrets instance.
     * @param {string} XBT_API_KEY - The API key for authentication.
     * @param {string} XBT_SECRET_KEY - The secret key for authentication.
     */
    constructor(XBT_API_KEY: string, XBT_SECRET_KEY: string) {
        console.debug("Creating Secrets instance");
        this.XBT_API_KEY = this.validateEnvVariable(XBT_API_KEY, 'XBT_API_KEY');
        this.XBT_SECRET_KEY = this.validateEnvVariable(XBT_SECRET_KEY, 'XBT_SECRET_KEY');
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
     * Get an item from the storage.
     * @param {string} key - The key for the storage item.
     * @returns {Promise<T>} The storage item.
     */
    async get<T>(key: string): Promise<T> {
        console.debug(`Getting item from storage: key=${key}`);
        const item = await this.storage.getItem(key);
        if (item === null || item === undefined) {
            throw new Error(`Item with key ${key} not found`);
        }
        return item as T;
    }

    /**
     * Check if an item exists in the storage.
     * @param {string} key - The key for the storage item.
     * @returns {Promise<boolean>} True if the item exists, false otherwise.
     */
    async has(key: string): Promise<boolean> {
        console.debug(`Checking if item exists in storage: key=${key}`);
        const item = await this.storage.hasItem(key);
        return item;
    }

    /**
     * Set an item in the storage.
     * @param {string} key - The key for the storage item.
     * @param {unknown} value - The value to set.
     * @returns {Promise<void>}
     */
    async set(key: string, value: StorageValue): Promise<void> {
        console.debug(`Setting item in storage: key=${key}, value=${JSON.stringify(value)}`);
        const result = await this.storage.setItem(key, {value});
        console.debug(`Set item in storage: key=${key}, result=${JSON.stringify(result)}`);
    }

    /**
     * Remove an item from the storage.
     * @param {string} key - The key for the storage item.
     * @returns {Promise<void>}
     */
    async remove(key: string): Promise<void> {
        console.debug(`Removing item from storage: key=${key}`);
        await this.storage.removeItem(key);
    }
}

export default Secrets;
