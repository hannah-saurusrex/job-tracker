import { ApolloServer } from "apollo-server-micro";
import { PrismaClient } from "@prisma/client";
import { typeDefs } from "../../graphql/schema"
import { resolvers } from "../../graphql/resolvers";

const prisma = new PrismaClient();

const server = new ApolloServer({ typeDefs, resolvers, context: () => ({ prisma }) });

export default server.createHandler({ path: "/api/graphql" });

export const config = { api: { bodyParser: false } };