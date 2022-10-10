const  { ApolloServer } = require("apollo-server-express");
const { makeExecutableSchema } = require ("@graphql-tools/schema");
const Resolvers = require("./resolvers").default;
const Schema = require ("./schema");

const executableSchema = makeExecutableSchema({
  typeDefs: Schema,
  resolvers: Resolvers,
});

const server = new ApolloServer({
  schema: executableSchema,
  context: ({ req }) => req,
});

module.exports = {
  server
}