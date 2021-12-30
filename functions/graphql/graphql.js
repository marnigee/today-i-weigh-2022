// graphql.js

const { ApolloServer, gql } = require('apollo-server-lambda');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    weights: [Weight]!
  }
  type Weight {
    id: ID!
    date: String!
    weight: Float!
  }
  type Mutation {
    addWeight(date: String!, weight: Float!): Weight
  }
`;

const weights = {};
let weightIndex = 0;
// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    weights: () => {
      return Object.values(weights)
    },
  },
  Mutation: {
    addWeight: (_, { date, weight }) => {
      weightIndex++;
      const id = `key-${weightIndex}`;
      weights[id] = { id, date, weight }
      return weights[id];
    }
  }
};

const server = new ApolloServer({
	typeDefs,
  resolvers,
  
  // By default, the GraphQL Playground interface and GraphQL introspection
  // is disabled in "production" (i.e. when `process.env.NODE_ENV` is `production`).
  //
  // If you'd like to have GraphQL Playground and introspection enabled in production,
  // the `playground` and `introspection` options must be set explicitly to `true`.
  playground: true,
  introspection: true
});

const apolloHandler = server.createHandler({
  cors: {
    origin: '*',
    credentials: true
  }
});

exports.handler = async (event, context, ...args) => {
  return apolloHandler(
    {
      ...event,
      requestContext: context,
    },
    context,
    ...args
  );
};
