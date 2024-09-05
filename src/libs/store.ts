import { createStorage } from "unstorage";
import httpDriver from "unstorage/drivers/http";
import { getStorageConfig } from "../config";
import logger from "./logger";

const createHttpDriver = (config: { api_base_url: string, api_key: string, api_secret: string }, path: string) => {
  logger.debug(`Creating HTTP driver with base URL: ${config.api_base_url} and path: ${path}`);
  return httpDriver({
    base: `${config.api_base_url}/${path}`,
    headers: {
      "X-XBT-API-KEY": config.api_key,
      "X-XBT-SECRET-KEY": config.api_secret
    }
  });
};

const createOverlayStorage = (config: { api_base_url: string, api_key: string, api_secret: string }, path: string) => {
  logger.debug(`Creating overlay storage with base URL: ${config.api_base_url} and path: ${path}`);
  return createStorage({
    driver: createHttpDriver(config, path)
  });
};

const initializeStorage = async (type: 'kv' | 'secret') => {
  const storageConfig = getStorageConfig()[type];
  const { base_url, key, secret } = storageConfig;
  const config = {
    api_base_url: base_url,
    api_key: key,
    api_secret: secret
  };
  return createOverlayStorage(config, type);
};

const secretStorage = await initializeStorage('secret');
const kvStorage = await initializeStorage('kv');

export { kvStorage, secretStorage };