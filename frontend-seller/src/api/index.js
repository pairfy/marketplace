const env = "dev";

const baseURL = {
  local: "https://localhost:443",
  dev: "https://pairfy.dev",
  prod: "https://pairfy.io",
};

const HOST = baseURL[env];

export { env, baseURL, HOST };
