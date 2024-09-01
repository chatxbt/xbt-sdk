import { ofetch } from "ofetch";

/**
 * Class representing an HTTP client.
 */
class Http {
    private request;

    /**
     * Create an HTTP client.
     * @param {string} [baseURL] - The base URL for the HTTP client.
     * @param {Record<string, string>} [defaultHeaders={}] - Default headers for the HTTP client.
     */
    constructor(baseURL?: string, defaultHeaders: Record<string, string> = {}) {
        this.request = ofetch.create({
            baseURL: baseURL || '',
            headers: defaultHeaders
        });
    }

    /**
     * Handle HTTP requests.
     * @private
     * @param {string} url - The URL for the request.
     * @param {string} method - The HTTP method.
     * @param {object} [body] - The request body.
     * @param {RequestInit} [options] - Additional request options.
     * @returns {Promise<Response>} The response from the request.
     */
    private async requestHandler(url: string, method: string, body?: object, options?: RequestInit) {
        const config: RequestInit = { ...options, method };
        if (body) {
            config.body = JSON.stringify(body);
        }
        return this.request(url, config);
    }

    /**
     * Perform a GET request.
     * @param {string} url - The URL for the request.
     * @param {RequestInit} [options] - Additional request options.
     * @returns {Promise<Response>} The response from the request.
     */
    async get(url: string, options?: RequestInit) {
        return this.requestHandler(url, 'GET', undefined, options);
    }

    /**
     * Perform a POST request.
     * @param {string} url - The URL for the request.
     * @param {object} body - The request body.
     * @param {RequestInit} [options] - Additional request options.
     * @returns {Promise<Response>} The response from the request.
     */
    async post(url: string, body: object, options?: RequestInit) {
        return this.requestHandler(url, 'POST', body, options);
    }

    /**
     * Perform a PUT request.
     * @param {string} url - The URL for the request.
     * @param {object} body - The request body.
     * @param {RequestInit} [options] - Additional request options.
     * @returns {Promise<Response>} The response from the request.
     */
    async put(url: string, body: object, options?: RequestInit) {
        return this.requestHandler(url, 'PUT', body, options);
    }

    /**
     * Perform a DELETE request.
     * @param {string} url - The URL for the request.
     * @param {RequestInit} [options] - Additional request options.
     * @returns {Promise<Response>} The response from the request.
     */
    async delete(url: string, options?: RequestInit) {
        return this.requestHandler(url, 'DELETE', undefined, options);
    }

    /**
     * Perform a PATCH request.
     * @param {string} url - The URL for the request.
     * @param {object} body - The request body.
     * @param {RequestInit} [options] - Additional request options.
     * @returns {Promise<Response>} The response from the request.
     */
    async patch(url: string, body: object, options?: RequestInit) {
        return this.requestHandler(url, 'PATCH', body, options);
    }

    /**
     * Perform a HEAD request.
     * @param {string} url - The URL for the request.
     * @param {RequestInit} [options] - Additional request options.
     * @returns {Promise<Response>} The response from the request.
     */
    async head(url: string, options?: RequestInit) {
        return this.requestHandler(url, 'HEAD', undefined, options);
    }

    /**
     * Generate a Basic Authentication header property from a username and password.
     * @param {string} username - The username.
     * @param {string} password - The password.
     * @returns {string} The Basic Authentication header.
     */
    generateBasicAuth(username: string, password: string): string {
        const credentials = `${username}:${password}`;
        return `Basic ${Buffer.from(credentials).toString('base64')}`;
    }

    /**
     * Perform a JSON-RPC request.
     * @param {string} url - The URL for the request.
     * @param {string} method - The JSON-RPC method.
     * @param {object|string} params - The parameters for the JSON-RPC method.
     * @param {string} [id] - The ID for the JSON-RPC request.
     * @param {RequestInit} [options] - Additional request options.
     * @returns {Promise<any>} The result from the JSON-RPC response.
     * @throws Will throw an error if the JSON-RPC response contains an error.
     */
    async jsonRPC(url: string, method: string, params: object | string, id?: string, options?: RequestInit) {
        const jsonRPCRequest = {
            jsonrpc: "2.0",
            method: method,
            params: params,
            id: id || new Date().getTime()
        };

        const response = await this.requestHandler(url, 'POST', jsonRPCRequest, {
            headers: {
                "content-type": "application/json",
                ...options?.headers,
            },
            ...options
        });

        if (response.error) {
            throw new Error(response.error.message);
        }

        return response.result;
    }
}

export default Http;
