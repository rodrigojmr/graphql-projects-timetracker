import React from 'react';
import { Box, Container, Heading } from '@chakra-ui/layout';
import ProjectForm from '../components/form/projectForm';
import OriginalProjectsTable from '../components/table/originalProjectsTable';
import RefactoredProjectsTable from '../components/table/refactoredProjectsTable';

const Home: React.FC = () => {
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
        {/* Made a separate "refactored" version, original version is commented out */}
        {/* <OriginalProjectsTable /> */}
        <RefactoredProjectsTable />
      </Box>
    </Container>
  );
};

export default Home;
