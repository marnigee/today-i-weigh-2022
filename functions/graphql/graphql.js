// graphql.js

const { ApolloServer, gql } = require('apollo-server-lambda');
const faunadb = require('faunadb');
const q = faunadb.query;

var client = new faunadb.Client({
	secret: process.env.FAUNA_DB_SECRET,
	domain: 'db.us.fauna.com'
});

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

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    weights: async (parent, args, { user }) => {
      if (!user) {
        return [];
      }
      else {
        const results = await client.query(
          q.Paginate(
            q.Match(
              q.Index('weights_by_user'), user
            )
          )
        )
        return results.data.map(([ref, weight, date]) => ({
          id: ref.id,
          weight,
          date
        }))
      }
    },
  },
  Mutation: {
    addWeight: async (_, { date, weight }, { user }) => {
      if (!user) {
        throw new Error('Must be authenticated to add weights');
      }
      const results = await client.query(
        q.Create(
          q.Collections('weights'),
          {
            data: {
              weight,
              date,
              owner: user
            }
          }
        )
      );
      return {
        ...results.data,
        id: results.ref.id
      }
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
