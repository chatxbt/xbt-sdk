import { createStorage } from "unstorage";
import httpDriver from "unstorage/drivers/http";
import { loadConfig } from "c12";

const env = process.env.NODE_ENV || 'production';
console.debug(`Environment: ${env}`);

const loadConfiguration = async () => {
  const { config } = await loadConfig({
    cwd: 'node_modules/@chatxbt/xbt-sdk',
    configFile: 'config.yaml'
  });
  console.debug(`Configuration loaded: ${JSON.stringify(config)}`);
  if (env === 'development') {
    const localBaseUrl = process.env.XBT_API_BASE_URL || 'http://localhost:3001/store';
    config.xbt.api.base_url = localBaseUrl;
    config.xbt.store.kv.api_base_url = localBaseUrl;
    config.xbt.store.secret.api_base_url = localBaseUrl;
  }
  return config;
};

const createHttpDriver = (config: { api_base_url: string, api_key: string, api_secret: string }, path: string) => {
  console.debug(`Creating HTTP driver with base URL: ${config.api_base_url} and path: ${path}`);
  return httpDriver({
    base: `${config.api_base_url}/${path}`,
    headers: {
      "X-XBT-API-KEY": config.api_key,
      "X-XBT-SECRET-KEY": config.api_secret
    }
  });
};

const createOverlayStorage = (config: { api_base_url: string, api_key: string, api_secret: string }, path: string) => {
  console.debug(`Creating overlay storage with base URL: ${config.api_base_url} and path: ${path}`);
  return createStorage({
    driver: createHttpDriver(config, path)
  });
};

const initializeStorage = async (type: 'kv' | 'secret') => {
  const config = await loadConfiguration();
  const storageConfig = config.xbt.store[type];
  return createOverlayStorage(storageConfig, type);
};

const secretStorage = await initializeStorage('secret');
const kvStorage = await initializeStorage('kv');

export { kvStorage, secretStorage };