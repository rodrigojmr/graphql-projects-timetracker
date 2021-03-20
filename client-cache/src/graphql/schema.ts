import { gql } from '@apollo/client';

const typeDefs = gql`
  type Project {
    id: ID!
    name: String!
    description: String!
    time: [Time]
  }
  type Time {
    description: String!
    amount: Int!
  }
`;

export default typeDefs;
