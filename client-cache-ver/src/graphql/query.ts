import { gql } from '@apollo/client';

export const PROJECTS = gql`
  query Projects {
    projects @client
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
