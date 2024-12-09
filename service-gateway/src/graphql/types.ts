const typeDefs = `#graphql

type Product {
    id: String!
    state: String!
    state_label: String!
    moderated: Int!
    seller_id: String!
    name: String!
    price: Int!
    collateral: Int!
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
   id: String!
   name: String!
   price: Int!
   collateral: Int!
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
  
input GetBooksInput {
  cursor: String!
}  

input GetOrdersInput {
  id: String!
} 

type Query {
  getOrders: String
  getBooks(getBooksInput: GetBooksInput!): GetBooksResponse!
}

#/////////////////////////////////////////////////

type UpdateBookResponse {
  success: Boolean!
}

input UpdateBookInput {
  id: String!
  keeping_stock: Int!
  ready_stock: Int!
  disable_purchases: Boolean!
} 

type CreateOrderPayload {
  cbor: String!
}

type CreateOrderResponse {
  success: Boolean!
  payload: CreateOrderPayload!
}

input CreateOrderInput {
  product_id: String!
  product_units: Int!
} 

type Mutation {
  updateBook(updateBookInput: UpdateBookInput!): UpdateBookResponse!
  createOrder(createOrderInput: CreateOrderInput!): CreateOrderResponse!
}

`;

export { typeDefs };
