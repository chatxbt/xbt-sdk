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
        if (!value) {
            throw new Error(`${name} is required`);
        }
        return value;
    }

    /**
     * Fetch data from the storage system.
     * @private
     * @param {string} key - The key of the item to fetch.
     * @param {string} method - The HTTP method to use.
     * @param {unknown} [body] - The request body.
     * @returns {Promise<Response>} The response from the storage system.
     * @throws Will throw an error if the request fails.
     */
    private async fetchFromStorage(key: string, method: string, body?: unknown): Promise<Response> {
        const headers = new Headers({
            'X-XBT-API-KEY': this.XBT_API_KEY,
            'X-XBT-SECRET-KEY': this.XBT_SECRET_KEY
        });

        if (body) {
            headers.append('Content-Type', 'application/json');
        }

        const response = await fetch(`${this.storage}${key}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined
        });

        if (!response.ok) {
            throw new Error(`Failed to ${method.toLowerCase()} item: ${response.statusText}`);
        }

        return response;
    }

    /**
     * Get an item from the storage system.
     * @param {string} key - The key of the item to get.
     * @returns {Promise<T>} The item from the storage system.
     */
    async getItem<T>(key: string): Promise<T> {
        const response = await this.fetchFromStorage(key, 'GET');
        return await response.json();
    }

    /**
     * Check if an item exists in the storage system.
     * @param {string} key - The key of the item to check.
     * @returns {Promise<boolean>} True if the item exists, false otherwise.
     */
    async hasItem(key: string): Promise<boolean> {
        const response = await this.fetchFromStorage(key, 'HEAD');
        return response.ok;
    }

    /**
     * Set an item in the storage system.
     * @param {string} key - The key of the item to set.
     * @param {unknown} value - The value of the item to set.
     * @returns {Promise<void>}
     */
    async setItem(key: string, value: unknown): Promise<void> {
        await this.fetchFromStorage(key, 'PUT', value);
    }

    /**
     * Remove an item from the storage system.
     * @param {string} key - The key of the item to remove.
     * @returns {Promise<void>}
     */
    async removeItem(key: string): Promise<void> {
        await this.fetchFromStorage(key, 'DELETE');
    }
}

export default KV;
