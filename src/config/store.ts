import { createStorage } from "unstorage";
import overlay from "unstorage/drivers/overlay";
import httpDriver from "unstorage/drivers/http";
import lruCacheDriver from "unstorage/drivers/lru-cache";
import { loadConfig } from "c12";

const env = process.env.NODE_ENV || 'production';
console.debug(`Environment: ${env}`);

const loadConfiguration = async () => {
  const { config } = await loadConfig({
    configFile: 'config.yaml'
  });
  console.debug(`Configuration loaded: ${JSON.stringify(config)}`);
  return config;
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const createHttpDriver = (config: any, path: string) => {
  console.debug(`Creating HTTP driver for path: ${path}`);
  return httpDriver({
    base: `${config.xbt.store.api_base_url}/${path}`,
    headers: {
      "X-XBT-API-KEY": config.xbt.store.api_key,
      "X-XBT-SECRET-KEY": config.xbt.store.api_secret
    }
  });
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const createOverlayStorage = (config: any, path: string) => {
  console.debug(`Creating overlay storage for path: ${path}`);
  return createStorage({
    driver: overlay({
      layers: [
        lruCacheDriver({}),
        createHttpDriver(config, path)
      ],
    }),
  });
};

const initializeStorages = async () => {
  const config = await loadConfiguration();
  const kvStorage = createOverlayStorage(config, config.xbt.store.kv.path);
  console.debug(`KV Storage created: ${kvStorage}`);
  const secretStorage = createOverlayStorage(config, config.xbt.store.secret.path);
  console.debug(`Secret Storage created: ${secretStorage}`);
  return { kvStorage, secretStorage };
};

const { kvStorage, secretStorage } = await initializeStorages();

export { kvStorage, secretStorage };