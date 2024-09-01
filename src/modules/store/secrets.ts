import { secretStorage } from "../../config/store";

/**
 * Class representing a secrets storage system.
 */
class Secrets {
    private storage;
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
        this.storage = secretStorage;
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
     * Fetch data from the storage.
     * @private
     * @param {string} key - The key for the storage item.
     * @param {string} method - The HTTP method.
     * @param {unknown} [body] - The request body.
     * @returns {Promise<Response>} The response from the storage.
     * @throws Will throw an error if the request fails.
     */
    private async fetchFromStorage(key: string, method: string, body?: unknown): Promise<Response> {
        console.debug(`Fetching from storage: key=${key}, method=${method}, body=${body ? JSON.stringify(body) : 'none'}`);
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
            console.error(`Failed to ${method.toLowerCase()} item: ${response.statusText}`);
            throw new Error(`Failed to ${method.toLowerCase()} item: ${response.statusText}`);
        }

        return response;
    }

    /**
     * Get an item from the storage.
     * @param {string} key - The key for the storage item.
     * @returns {Promise<T>} The storage item.
     */
    async get<T>(key: string): Promise<T> {
        console.debug(`Getting item from storage: key=${key}`);
        const response = await this.fetchFromStorage(key, 'GET');
        return await response.json();
    }

    /**
     * Check if an item exists in the storage.
     * @param {string} key - The key for the storage item.
     * @returns {Promise<boolean>} True if the item exists, false otherwise.
     */
    async has(key: string): Promise<boolean> {
        console.debug(`Checking if item exists in storage: key=${key}`);
        const response = await this.fetchFromStorage(key, 'HEAD');
        return response.ok;
    }

    /**
     * Set an item in the storage.
     * @param {string} key - The key for the storage item.
     * @param {unknown} value - The value to set.
     * @returns {Promise<void>}
     */
    async set(key: string, value: unknown): Promise<void> {
        console.debug(`Setting item in storage: key=${key}, value=${JSON.stringify(value)}`);
        await this.fetchFromStorage(key, 'PUT', value);
    }

    /**
     * Remove an item from the storage.
     * @param {string} key - The key for the storage item.
     * @returns {Promise<void>}
     */
    async remove(key: string): Promise<void> {
        console.debug(`Removing item from storage: key=${key}`);
        await this.fetchFromStorage(key, 'DELETE');
    }
}

export default Secrets;
