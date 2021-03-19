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
    getProjects: [Project!]
  }
    type Query {
    getProject: Project
  }

  input ProjectInput {
    name: String!
    description: String!
  }
  input TimeInput {
    description: String!
    amount: Int!
  }

  type Mutation {
    createProject(input: ProjectInput): Project
  }
`);

export default schema;
