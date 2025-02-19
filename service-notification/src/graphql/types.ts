const typeDefs = `#graphql

type Notification {
  id: String!
  type: String!
  title: String!
  owner: String!
  seen: Boolean!
  data: String!
  message: String!
  created_at: String!
}

type Query {
  getNotifications: [Notification]
}

#------------------------------------------------------------ MUTATIONS

type UpdateNotificationResponse {
  success: Boolean!
}

input UpdateNotificationInput {
  notification_id: String!
} 

type Mutation {
  updateNotification(updateNotificationInput: UpdateNotificationInput!): UpdateNotificationResponse!
}

`;

export { typeDefs };
