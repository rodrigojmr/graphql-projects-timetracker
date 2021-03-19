const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
import express from 'express';
import schema from './schema';

// Construct a schema, using GraphQL schema language

// The root provides a resolver function for each API endpoint
let root = {
  hello: () => {
    return 'Hello world!';
  }
};

const app = express();

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
);

app.listen(8080);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');
