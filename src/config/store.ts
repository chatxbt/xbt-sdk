import { createStorage } from "unstorage";
import overlay from "unstorage/drivers/overlay";
import httpDriver from "unstorage/drivers/http";
import lruCacheDriver from "unstorage/drivers/lru-cache";
import { read } from 'rc9';

const env = process.env.NODE_ENV || 'production';
console.debug(`Environment: ${env}`);
const configFile = env === 'dev' ? '.conf.dev' : '.conf';
console.debug(`Config file: ${configFile}`);
const creds = read(configFile);
console.debug(`Credentials loaded: ${JSON.stringify(creds)}`);

const createHttpDriver = (path: string) => {
  console.debug(`Creating HTTP driver for path: ${path}`);
  return httpDriver({
    base: `${creds.xbt_store_api_base_url}/${path}`,
    headers: {
      "X-XBT-API-KEY": creds.xbt_store_api_key,
      "X-XBT-SECRET-KEY": creds.xbt_store_api_secret
    }
  });
};

const createOverlayStorage = (path: string) => {
  console.debug(`Creating overlay storage for path: ${path}`);
  return createStorage({
    driver: overlay({
      layers: [
        lruCacheDriver({}),
        createHttpDriver(path)
      ],
    }),
  });
};

const kvStorage = createOverlayStorage('kv');
console.debug(`KV Storage created: ${kvStorage}`);
const secretStorage = createOverlayStorage('secret');
console.debug(`Secret Storage created: ${secretStorage}`);

export { kvStorage, secretStorage };