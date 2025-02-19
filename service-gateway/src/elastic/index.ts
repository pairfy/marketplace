import { Client } from "@elastic/elasticsearch";

const searchClient = new Client({
  node: process.env.ELASTIC_NODE as string,
  auth: {
    apiKey: process.env.ELASTIC_KEY as string
  },
});

export { searchClient };
