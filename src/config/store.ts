import { createStorage } from "unstorage";
import overlay from "unstorage/drivers/overlay";
import httpDriver from "unstorage/drivers/http";
import lruCacheDriver from "unstorage/drivers/lru-cache";
import { read } from 'rc9';

const env = process.env.NODE_ENV || 'production';
const configFile = env === 'dev' ? '.conf.dev' : '.conf';
const creds = read(configFile);

const createHttpDriver = (path: string) => httpDriver({
  base: `${creds.xbt_store_api_base_url}/${path}`,
  headers: {
    "X-XBT-API-KEY": creds.xbt_store_api_key,
    "X-XBT-SECRET-KEY": creds.xbt_store_api_secret
  }
});

const createOverlayStorage = (path: string) => createStorage({
  driver: overlay({
    layers: [
      lruCacheDriver({}),
      createHttpDriver(path)
    ],
  }),
});

const kvStorage = createOverlayStorage('kv');
const secretStorage = createOverlayStorage('secret');

export { kvStorage, secretStorage };