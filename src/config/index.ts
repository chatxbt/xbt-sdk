const storageAPIConfig = {
  base_url: "https://rpc.chatxbt.com/store",
  key: "apiKey",
  secret: "apiSecret"
};

const storageConfig = {
  kv: storageAPIConfig,
  secret: storageAPIConfig
};

export function getStorageConfig() {
  return storageConfig;
}
