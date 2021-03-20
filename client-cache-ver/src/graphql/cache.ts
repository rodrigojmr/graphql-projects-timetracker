import { InMemoryCache, Reference, makeVar } from '@apollo/client';

// Initializes to an empty array
export const projectsVar = makeVar<Project[]>([]);

// With reactiveVar
// export const cache: InMemoryCache = new InMemoryCache({
//   typePolicies: {
//     Query: {
//       fields: {
//         projects: {
//           read() {
//             return projectsVar();
//           }
//         }
//       }
//     }
//   }
// });

// With cache
export const cache: InMemoryCache = new InMemoryCache();
