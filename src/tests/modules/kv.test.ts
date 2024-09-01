import { describe, it, expect, beforeAll } from "bun:test";
import KV from "../../modules/store/kv";
import { kvStorage } from "../../config/store";

describe("KV", () => {
    let kv: KV;
    const apiKey = "test-api-key";
    const secretKey = "test-secret-key";
    const testKey = "test-key";
    const testValue = { data: "test-data" };

    beforeAll(() => {
        kv = new KV(apiKey, secretKey);
    });

    it("should set and get an item from storage", async () => {
        await kv.setItem(testKey, testValue);
        const result = await kv.getItem<typeof testValue>(testKey);
        expect(result).toEqual(testValue);
    });

    it("should check if an item exists in storage", async () => {
        const exists = await kv.hasItem(testKey);
        expect(exists).toBe(true);
    });

    it("should remove an item from storage", async () => {
        await kv.removeItem(testKey);
        const exists = await kv.hasItem(testKey);
        expect(exists).toBe(false);
    });
});
