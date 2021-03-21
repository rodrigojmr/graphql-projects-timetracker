import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Container, Heading, Text } from '@chakra-ui/layout';
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper
} from '@chakra-ui/react';
import { Skeleton, SkeletonText } from '@chakra-ui/skeleton';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';
import TimeTable from '../components/table/timeTable';
import { useAddTimeMutation, useGetProjectQuery } from '../generated/graphql';
import { GET_PROJECT } from '../graphql/query';

interface Props {
  project: Project;
}

const ProjectPage: React.FC<Props> = ({ project }) => {
  // Fetch project by page ID
  const { id } = useParams<{ id: string }>();
  const { data, loading } = useGetProjectQuery({
    variables: { id }
  });

  const { handleSubmit, errors, register } = useForm();

  const [addTime] = useAddTimeMutation({
    refetchQueries: [{ query: GET_PROJECT, variables: { id } }]
  });

  const onSubmit = ({
    description,
    amount
  }: {
    description: string;
    amount: string;
  }) => {
    addTime({
      variables: { id, timeInput: { description, amount: parseInt(amount) } }
    });
  };

  return (
    <Container
      as="article"
      maxW="6xl"
      p={8}
      backgroundColor="white"
      rounded="xl"
      color="gray.600"
    >
      <Flex flexDir={['column', 'column', 'column', 'row']}>
        <Flex flexDir="column" flexGrow={1}>
          <Flex alignItems="center">
            <Link to="/">
              <ArrowBackIcon w={6} h={6} /> Home
            </Link>
          </Flex>
          <Box as="article">
            <Skeleton isLoaded={!loading}>
              <Heading fontSize="5xl" marginBottom={8}>
                {data?.project?.name}
              </Heading>
            </Skeleton>
            <SkeletonText isLoaded={!loading}>
              <Text>{data?.project?.description}</Text>
            </SkeletonText>
          </Box>
          <Box mt={6} p={4} color="gray.500">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Flex>
                <FormControl flexGrow={1} isInvalid={errors.description}>
                  <FormLabel htmlFor="name">Description</FormLabel>
                  <Input
                    _hover={{ borderColor: 'gray.500' }}
                    required
                    borderColor="gray.300"
                    name="description"
                    placeholder="description"
                    ref={register()}
                  />
                  <FormErrorMessage>
                    {errors.name && errors.name.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl width="auto" isInvalid={errors.amount}>
                  <FormLabel htmlFor="amount">Amount</FormLabel>
                  <NumberInput defaultValue={1} min={1}>
                    <NumberInputField
                      name="amount"
                      borderColor="gray.300"
                      _hover={{ borderColor: 'gray.500' }}
                      ref={register()}
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper color="gray.400" />
                      <NumberDecrementStepper color="gray.400" />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormErrorMessage>
                    {errors.name && errors.name.message}
                  </FormErrorMessage>
                </FormControl>
                <Button colorScheme="cyan" alignSelf="flex-end" type="submit">
                  Add
                </Button>
              </Flex>
            </form>
          </Box>
        </Flex>
        <Box
          p={3}
          rounded="md"
          border="1px solid"
          borderColor="gray.300"
          flexShrink={1}
        >
          <TimeTable project={data?.project} />
        </Box>
      </Flex>
    </Container>
  );
};

export default ProjectPage;
