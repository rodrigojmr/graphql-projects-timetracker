import { Box, Container, Heading } from '@chakra-ui/layout';
import React from 'react';
import ProjectForm from '../components/form/projectForm';
import ProjectsTable from '../components/table/projectsTable';

interface HomeProps {}

const Home: React.FC<HomeProps> = ({}) => {
  return (
    <Container maxW="5xl">
      <Heading fontSize="5xl" marginBottom={8}>
        Projects
      </Heading>
      <Box p={4} backgroundColor="white" rounded="xl" color="gray.600">
        <ProjectForm />
      </Box>
      <Box p={8}>
        <ProjectsTable />
      </Box>
    </Container>
  );
};

export default Home;
