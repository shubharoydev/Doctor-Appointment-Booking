const { ApolloServer } = require('apollo-server-express');
const { schema, root } = require('./doctorSchema');

const startApolloServer = async (app) => {
  const server = new ApolloServer({
    schema,
    resolvers: root,
    context: ({ req }) => ({
      apiKey: req.headers['x-api-key'],
    }),
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  console.log(`🚀 GraphQL server ready at /graphql`);
};

module.exports = startApolloServer;
