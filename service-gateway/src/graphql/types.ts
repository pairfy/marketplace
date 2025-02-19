const typeDefs = `#graphql

type Product {
    id: String!
    state: String!
    state_label: String!
    moderated: Int!
    seller_id: String!
    name: String!
    price: Int!
    sku: String!
    model: String!
    brand: String!
    features: String!
    category: String!
    keywords: String!
    bullet_list: String!
    paused: Int!
    color: String!
    color_name: String!
    quality: String!
    country: String!
    media_url: String!
    image_path: String!
    video_path: String!
    image_set: String!
    video_set: String!
    discount: Boolean!
    discount_value: Int!
    created_at: String!
}


type ProductBook {
   id: ID!
   name: String!
   price: Int!
   sku: String!
   media_url: String!
   image_path: String!
   image_set: String!
   discount: Boolean!
   discount_value: Int!   
   created_at: String!
   book_keeping_stock: Int!
   book_ready_stock: Int!
   book_blocked_stock: Int!
}

type GetBooksResponse {
  books: [ProductBook!]
  cursor: String!
  count: Int!
}

type Order {
  id: String!
  finished: Boolean!
  scanned_at: Float!
  status_log: String!
  buyer_username: String!
  ada_price: Float!
  contract_address: String!
  contract_state: Int
  contract_price: Int!
  contract_fee: Int!
  contract_units: Int!
  product_id: String!
  product_name: String!
  product_price: Int!
  product_sku: String!
  product_model: String!
  product_brand: String!
  product_features: String!
  product_bullet_list: String!
  product_discount: Boolean!
  product_discount_value: Int!
  product_media_url: String!
  product_image_path: String!
  product_video_path: String!
  product_image_set: String!
  product_video_set: String!
  watch_until: Float!
  pending_until: Float!
  shipping_until: Float!
  pending_tx: String
  pending_block: String
  returned_tx: String
  returned_block: String  
  locking_tx: String
  locking_block: String  
  canceled_tx: String
  canceled_block: String  
  shipping_tx: String
  shipping_block: String
  shipping_metadata: String
  appealed_tx: String
  appealed_block: String    
  received_tx: String
  received_block: String
  collected_tx: String
  collected_block: String  
  seller_username: String
  seller_verified: Boolean
  seller_trade_terms: String
  seller_avatar_base: String
  seller_avatar_path: String
}

type getOrderResponse {
  order: Order!
  shipping: String
  address: String
  session: String!
}

input GetBooksInput {
  cursor: String!
}  

input GetOrdersInput {
  id: String!
} 

input GetOrderInput {
  id: String!
} 

type Query {
  getOrder(getOrderInput: GetOrderInput!): getOrderResponse!
  getOrders: String
  getBooks(getBooksInput: GetBooksInput!): GetBooksResponse!
}

#////////////////////////////////////////////////////////////////////////////// MUTATIONS

type UpdateBookResponse {
  success: Boolean!
}

input UpdateBookInput {
  id: String!
  keeping_stock: Int!
  ready_stock: Int!
} 

type PendingEndpointPayload {
  cbor: String!
  order: String!
}

type CborPayload {
  cbor: String!
}

type PendingEndpointResponse {
  success: Boolean!
  payload: PendingEndpointPayload!
}

type CancelEndpointResponse {
  success: Boolean!
  payload: CborPayload!
}

type ReturnEndpointResponse {
  success: Boolean!
  payload: CborPayload!
}

type LockingEndpointResponse {
  success: Boolean!
  payload: CborPayload!
}

type ShippingEndpointResponse {
  success: Boolean!
  payload: CborPayload!
}

type AppealEndpointResponse {
  success: Boolean!
  payload: CborPayload!
}

type ReceivedEndpointResponse {
  success: Boolean!
  payload: CborPayload!
}

type CollectEndpointResponse {
  success: Boolean!
  payload: CborPayload!
}

input PendingEndpointInput {
  product_id: String!
  product_units: Int!
  data: String!
} 

input CancelEndpointInput {
  order_id: String!
} 

input ReturnEndpointInput {
  order_id: String!
} 

input LockingEndpointInput {
  order_id: String!
} 

input ShippingEndpointInput {
  order_id: String!
  guide: String!
  date: String!
  website: String!
  notes: String!
} 

input AppealEndpointInput {
  order_id: String!
} 

input ReceivedEndpointInput {
  order_id: String!
} 

input CollectEndpointInput {
  order_id: String!
} 

type Mutation {
  updateBook(updateBookInput: UpdateBookInput!): UpdateBookResponse!
  pendingEndpoint(pendingEndpointInput: PendingEndpointInput!): PendingEndpointResponse!
  cancelEndpoint(cancelEndpointInput: CancelEndpointInput!): CancelEndpointResponse!
  returnEndpoint(returnEndpointInput: ReturnEndpointInput!): ReturnEndpointResponse!
  lockingEndpoint(lockingEndpointInput: LockingEndpointInput!): LockingEndpointResponse!
  shippingEndpoint(shippingEndpointInput: ShippingEndpointInput!): ShippingEndpointResponse!
  appealEndpoint(appealEndpointInput: AppealEndpointInput!): AppealEndpointResponse!
  receivedEndpoint(receivedEndpointInput: ReceivedEndpointInput!): ReceivedEndpointResponse!
  collectEndpoint(collectEndpointInput: CollectEndpointInput!): CollectEndpointResponse!
}

`;

export { typeDefs };
