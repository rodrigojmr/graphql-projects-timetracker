import { buildSchema } from 'graphql';

const schema = buildSchema(`
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

  type Query {
    projects: [Project!]
    project(id: ID!): Project
  }

  input ProjectInput {
    id: ID
    name: String!
    description: String!
  }

  input TimeInput {
    description: String!
    amount: Int!
  }

  type Mutation {
    createProject(input: ProjectInput): Project
    deleteProject(id: ID): Project
    editProject(input: ProjectInput): Project
  }
`);

export default schema;
