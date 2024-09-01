import { describe, it, expect, beforeAll } from "bun:test";
import Secrets from "../../modules/store/secrets";
import logger from "../../config/logger";

describe("Secrets", () => {
    let secrets: Secrets;
    const apiKey = "test-api-key";
    const secretKey = "test-secret-key";
    const testKey = "secrets-helloworldu";
    const testValue = "secrets-helloworld";

    beforeAll(async () => {
        secrets = new Secrets(apiKey, secretKey);
    });

    it("should set and get an item from storage with metadata", async () => {
        await secrets.set(testKey, testValue); // Ensure the item is set before getting it
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const result = await secrets.get(testKey) as any;
        logger.log({result});
        expect(result.key).toEqual(testKey);
        expect(result.value).toEqual(testValue);
    });

    it("should check if an item exists in storage", async () => {
        const exists = await secrets.has(testKey);
        logger.log({exists});
        expect(exists).toBe(true);
    });

    // it("should remove an item from storage", async () => {
    //     await secrets.remove(testKey);
    //     const exists = await secrets.has(testKey);
    //     logger.log({exists});
    //     expect(exists).toBe(false);
    // });
});
