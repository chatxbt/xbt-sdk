import { describe, it, expect, beforeAll } from "bun:test";
import KV from "../../modules/store/kv";
import logger from "../../config/logger";

describe("KV", () => {
    let kv: KV;
    const testKey = "kvhelloworld";
    const testValue = "kv-helloworld";

    beforeAll(() => {
        kv = new KV();
    });

    it("should set and get an item from storage", async () => {
        await kv.setItem(testKey, testValue);
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const result = await kv.getItem(testKey) as any;
        logger.log({result});
        expect(result.key).toEqual(testKey);
        expect(result.value).toEqual(testValue);
    });

    it("should check if an item exists in storage", async () => {
        const exists = await kv.hasItem(testKey);
        logger.log({exists});
        expect(exists).toBe(false);
    });

    it("should remove an item from storage", async () => {
        await kv.removeItem(testKey);
        const exists = await kv.hasItem(testKey);
        logger.log({exists});
        expect(exists).toBe(false);
    });
});
