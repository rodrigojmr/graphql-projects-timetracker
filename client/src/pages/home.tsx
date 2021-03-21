import { Box, Container, Heading } from '@chakra-ui/layout';
import { Flex } from '@chakra-ui/react';
import React from 'react';
import ProjectForm from '../components/form/projectForm';
import ProjectsTable from '../components/table/dynamicProjectsTable';
import { useGetProjectsQuery } from '../generated/graphql';

interface HomeProps {}

const Home: React.FC<HomeProps> = ({}) => {
  const { data, error, loading } = useGetProjectsQuery();

  return (
    <Container
      maxW="6xl"
      p={8}
      backgroundColor="white"
      rounded="xl"
      color="gray.600"
    >
      <Heading fontSize="5xl" marginBottom={8}>
        Projects
      </Heading>
      <Box p={4} mb={4} backgroundColor="white" rounded="xl" color="gray.600">
        <ProjectForm />
      </Box>
      <Box p={3} rounded="md" border="1px solid" borderColor="gray.300">
        <ProjectsTable />
      </Box>
    </Container>
  );
};

export default Home;
