import { gql } from '@apollo/client';

export const GET_PROJECTS = gql`
  query getProjects {
    projects {
      id
      name
      description
      time {
        description
        amount
      }
    }
  }
`;

export const GET_PROJECT = gql`
  query getProject($id: ID!) {
    project(id: $id) {
      id
      name
      description
      time {
        description
        amount
      }
    }
  }
`;

export const ADD_PROJECT = gql`
  mutation CreateProject($input: ProjectInput!) {
    createProject(input: $input) {
      id
      name
      description
    }
  }
`;

export const EDIT_PROJECT = gql`
  mutation EditProject($input: ProjectInput!) {
    editProject(input: $input) {
      id
      name
      description
    }
  }
`;

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id) {
      id
      name
      description
    }
  }
`;

// const data = client.readQuery({
//   query: gql`
//     query FetchProducts {
//       project {
//         id
//         name
//         description
//         time {
//           description
//           amount
//         }
//       }
//     }
//   `
// });
