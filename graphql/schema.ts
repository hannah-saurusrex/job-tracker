import { gql } from "graphql-tag";

export const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    name: String
    jobs: [Job]
  }

  type Job {
    id: ID!
    company: String!
    title: String!
    status: String!
    date: String!
    user: User!
  }

  type Query {
    users: [User]
    jobs: [Job]
  }
`;
