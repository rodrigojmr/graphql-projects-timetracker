import { useQuery } from '@apollo/client';
import { FormControl } from '@chakra-ui/form-control';
import { FormLabel, Input, FormErrorMessage, Button } from '@chakra-ui/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { cache, projectsVar } from '../../graphql/cache';
import { PROJECTS } from '../../graphql/query';

interface ProjectFormProps {}
interface FormResults {
  name: string;
  description: string;
}

const ProjectForm: React.FC<ProjectFormProps> = ({}) => {
  const { handleSubmit, errors, register, formState } = useForm();
  const { data } = useQuery<{ projects: Project[] }>(PROJECTS);
  console.log('data: ', data);

  const onSubmit = ({ name, description }: FormResults) => {
    const newProject: Project = { name, description };

    // With reactiveVar
    // projectsVar([...projectsVar(), newProject]);

    const allProjects: Project[] = [
      ...(data?.projects ? data.projects : []),
      newProject
    ];
    // With cache
    cache.writeQuery({
      query: PROJECTS,
      data: {
        projects: allProjects
      }
    });
    return;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl isInvalid={errors.name}>
        <FormLabel htmlFor="name">Project Name</FormLabel>
        <Input
          required
          borderColor="gray.300"
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
        <Input
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
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default ProjectForm;
