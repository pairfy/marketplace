import { PoolConnection } from "mysql2";

export interface HandlerParams {
    connection: PoolConnection,
    threadtoken: string,
    timestamp: number,
    utxo: any,
    seller_id: string,
    buyer_pubkeyhash: string,
    buyer_address: string,
    seller_address: string,
    country: string
}

 