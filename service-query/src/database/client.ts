import { createPool, PoolOptions, Pool } from "mysql2/promise";

class DatabaseWrap {
    private _client?: any;

    get ready() {
        if (!this._client) {
            return false
        } else {
            return true
        }
    }

    
    get client() {
        if (!this._client) {
            throw new Error("Cannot access the client before connecting");
        }

        return this._client;
    }

    connect(options: PoolOptions): Pool {
        this._client = createPool(options);
        return this.client;
    }
}

const database = new DatabaseWrap();

export { database }