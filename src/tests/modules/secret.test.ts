import { describe, it, expect, beforeAll } from "bun:test";
import Secrets from "../../modules/store/secrets";
import { secretStorage } from "../../config/store";

describe("Secrets", () => {
    let secrets: Secrets;
    const apiKey = "test-api-key";
    const secretKey = "test-secret-key";
    const testKey = "test-key";
    const testValue = { data: "test-data" };

    beforeAll(() => {
        secrets = new Secrets(apiKey, secretKey);
    });

    it("should set and get an item from storage", async () => {
        await secrets.set(testKey, testValue);
        const result = await secrets.get<typeof testValue>(testKey);
        expect(result).toEqual(testValue);
    });

    it("should check if an item exists in storage", async () => {
        const exists = await secrets.has(testKey);
        expect(exists).toBe(true);
    });

    it("should remove an item from storage", async () => {
        await secrets.remove(testKey);
        const exists = await secrets.has(testKey);
        expect(exists).toBe(false);
    });
});
