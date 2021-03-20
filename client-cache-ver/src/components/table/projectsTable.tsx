import React from 'react';

import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption
} from '@chakra-ui/react';

import { client } from '../../graphql';
import { gql, useQuery } from '@apollo/client';
import { PROJECTS } from '../../graphql/query';

interface ProjectsTableProps {}

const ProjectsTable: React.FC<ProjectsTableProps> = () => {
  // With reactiveVar
  const { data, loading, error } = useQuery(PROJECTS);

  return <>Projects</>;
};
export default ProjectsTable;
