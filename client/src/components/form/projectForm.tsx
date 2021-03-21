import React from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  Textarea
} from '@chakra-ui/react';
import { FormControl } from '@chakra-ui/form-control';
import { useForm } from 'react-hook-form';
import { useCreateProjectMutation } from '../../generated/graphql';
import { ADD_PROJECT, GET_PROJECTS } from '../../graphql/query';

interface ProjectFormProps {}

interface ProjectInput {
  name: string;
  description: string;
}

const ProjectForm: React.FC<ProjectFormProps> = () => {
  const [createProject, { data }] = useCreateProjectMutation({
    update(cache, { data }) {
      // Query existing projects
      const getExistingProjects: {
        projects: Project[];
      } | null = cache.readQuery({
        query: GET_PROJECTS
      });

      // Add the new projects to the cache
      const existingProjects = getExistingProjects?.projects
        ? getExistingProjects.projects
        : [];
      const newProject = data?.createProject;

      cache.writeQuery({
        query: GET_PROJECTS,
        data: { projects: [newProject, ...existingProjects] }
      });
    }
  });

  const { handleSubmit, errors, register, formState } = useForm();

  const onSubmit = ({ name, description }: ProjectInput) => {
    createProject({
      variables: { input: { name, description } }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl isInvalid={errors.name}>
        <FormLabel htmlFor="name">Project Name</FormLabel>
        <Input
          required
          borderColor="gray.300"
          _hover={{ borderColor: 'gray.600' }}
          name="name"
          placeholder="name"
          ref={register()}
        />
        <FormErrorMessage>
          {errors.name && errors.name.message}
        </FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={errors.name}>
        <FormLabel htmlFor="description">Description</FormLabel>
        <Textarea
          required
          _hover={{ borderColor: 'gray.600' }}
          borderColor="gray.300"
          name="description"
          placeholder="description"
          ref={register()}
        />
        <FormErrorMessage>
          {errors.name && errors.name.message}
        </FormErrorMessage>
      </FormControl>
      <Button colorScheme="blue" color="gray.700" type="submit">
        Submit
      </Button>
    </form>
  );
};

export default ProjectForm;
