import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import schema from './schema';
import resolvers from './resolvers';
import cors from 'cors';

const app = express();

const root = resolvers;

app.use(cors());
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
);

app.listen({ port: 4000 }, () => {
  console.log('Running a GraphQL API server at http://localhost:4000/graphql');
});
