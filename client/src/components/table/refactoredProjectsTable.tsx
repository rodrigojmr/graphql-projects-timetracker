import {
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react';
import React, { useState } from 'react';
import {
  useDeleteProjectMutation,
  useEditProjectMutation,
  useGetProjectsQuery
} from '../../generated/graphql';
import { GET_PROJECTS } from '../../graphql/query';
import TableRow from './tableRow';

function RefactoredProjectsTable() {
  const { data, loading, error } = useGetProjectsQuery();

  // Initial state to set edit mode
  const [inEditMode, setInEditMode] = useState<{
    status: boolean;
    rowKey: null | string;
  }>({
    status: false,
    rowKey: null
  });

  // GraphQL Queries
  const [deleteProject] = useDeleteProjectMutation({
    update(cache, { data }) {
      // Get existing projects from cache
      const getExistingProjects: {
        projects: Project[];
      } | null = cache.readQuery({
        query: GET_PROJECTS
      });

      // Remove deleted project from list of projects
      const newProjectArray = getExistingProjects?.projects.filter(
        project => project.id !== data?.deleteProject?.id
      );
      cache.writeQuery({
        query: GET_PROJECTS,
        data: { projects: newProjectArray }
      });
    }
  });

  // To prevent bugs and inconsistencies in modifying the cache in either name and/or description changes, I refetch from the server again
  // Con: sometimes the frontend doesn't update properly ?
  const [editProject] = useEditProjectMutation({
    refetchQueries: [{ query: GET_PROJECTS }]
  });

  // Button onClick methods
  const onSave = ({
    id,
    name,
    description
  }: {
    id: string;
    name: string;
    description: string;
  }) => {
    // Call edit project mutation
    editProject({
      variables: {
        input: { id, name, description }
      }
    });
  };

  const onDelete = (id: string) => {
    deleteProject({ variables: { id } });
  };

  return (
    <Table>
      <TableCaption>Projects</TableCaption>
      <Thead>
        <Tr>
          <Th>Title</Th>
          <Th>Description</Th>
          <Th width="1px" textAlign="right" whiteSpace="nowrap" isNumeric>
            Total Hours
          </Th>
          <Th width="1px" textAlign="right" whiteSpace="nowrap">
            Actions
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {data && data.projects && data.projects.length > 0 ? (
          <>
            {data.projects.map(project => (
              <TableRow
                key={project.id}
                project={project}
                editMode={inEditMode.status && inEditMode.rowKey === project.id}
                onDelete={onDelete}
                onSave={onSave}
                setEditMode={setInEditMode}
              />
            ))}
          </>
        ) : (
          <>
            <Tr minH="4rem" position="relative">
              <Td>No projects added.</Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
            </Tr>
          </>
        )}
      </Tbody>
    </Table>
  );
}

export default RefactoredProjectsTable;
