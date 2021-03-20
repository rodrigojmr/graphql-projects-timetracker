import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  gql
} from '@apollo/client';

import typeDefs from './schema';

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  uri: 'http://localhost:8080/graphql',
  cache: new InMemoryCache(),
  typeDefs
});

export { client };
