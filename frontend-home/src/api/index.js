const env = "dev";

const baseURL = {
  local: "https://localhost:443",
  dev: "https://pairfy.dev",
  prod: "https://pairfy.io",
};

const NETWORK = "preview";

const HOST = baseURL[env];

export { env, baseURL, NETWORK, HOST };
