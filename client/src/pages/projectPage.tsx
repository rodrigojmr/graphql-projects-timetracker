import { Box, Container, Heading, Text } from '@chakra-ui/layout';
import { Flex } from '@chakra-ui/react';
import { Skeleton, SkeletonText } from '@chakra-ui/skeleton';
import React from 'react';
import { useParams } from 'react-router-dom';
import ProjectForm from '../components/form/projectForm';
import TestTable from '../components/table/dynamicProjectsTable';
import { useGetProjectQuery } from '../generated/graphql';

interface Props {
  project: Project;
}

const ProjectPage: React.FC<Props> = ({ project }) => {
  const { id } = useParams<{ id: string }>();

  const { data, loading, error } = useGetProjectQuery({ variables: { id } });
  console.log('data: ', data);

  return (
    <Container
      maxW="5xl"
      p={4}
      backgroundColor="white"
      rounded="xl"
      color="gray.600"
    >
      <Flex>
        <Box>
          <Skeleton isLoaded={!loading}>
            <Heading fontSize="5xl" marginBottom={8}>
              {data?.project?.name}
            </Heading>
          </Skeleton>
          <SkeletonText isLoaded={!loading}>
            <Text>{data?.project?.description}</Text>
          </SkeletonText>
        </Box>
        <Box></Box>
      </Flex>
    </Container>
  );
};

export default ProjectPage;
