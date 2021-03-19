import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  gql
} from '@apollo/client';
import { cache } from './cache';

import typeDefs from './schema';

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache: cache,
  typeDefs
});

export { client };
