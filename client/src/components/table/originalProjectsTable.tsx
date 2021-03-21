import {
  CheckIcon,
  CloseIcon,
  DeleteIcon,
  EditIcon,
  ViewIcon
} from '@chakra-ui/icons';
import {
  HStack,
  IconButton,
  Input,
  Skeleton,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Project as IProject,
  useDeleteProjectMutation,
  useEditProjectMutation,
  useGetProjectsQuery
} from '../../generated/graphql';
import { GET_PROJECTS } from '../../graphql/query';

// interface State {
//   name: string;
//   description: string;
// }

// enum FieldType {
//   Name = 'name',
//   Description = 'description'
// }

// type Action = {
//   field: FieldType;
//   payload: string;
// };

// useReducer, probably overkill for this use case
// const initialState: State = {
//   name: '',
//   description: ''
// };

// const reducer = (state: State, action: Action) => {
//   const { field, payload } = action;
//   switch (field) {
//     case FieldType.Name:
//       return {
//         ...state,
//         name: payload
//       };
//     case FieldType.Description:
//       return {
//         ...state,
//         description: payload
//       };
//     default:
//       return state;
//   }
// };

// const [state, dispatch] = useReducer(reducer, initialState);

function OriginalProjectsTable() {
  const { data, loading, error } = useGetProjectsQuery();

  // Initial state to set edit mode
  const [inEditMode, setInEditMode] = useState<{
    status: boolean;
    rowKey: null | string;
  }>({
    status: false,
    rowKey: null
  });

  // TODO Separate rows to prevent re-rendering the entire table again
  const [projectFields, setProjectFields] = useState({
    name: '',
    description: ''
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

  const onEdit = ({
    id,
    currentName,
    currentDescription
  }: {
    id: string;
    currentName: string;
    currentDescription: string;
  }) => {
    setInEditMode({
      status: true,
      rowKey: id
    });
    setProjectFields({
      name: currentName || '',
      description: currentDescription || ''
    });
  };

  // Button onClick methods
  const onSave = ({
    id,
    newProjectName,
    newProjectDescription
  }: {
    id: string;
    newProjectName: string;
    newProjectDescription: string;
  }) => {
    // Call edit project mutation
    editProject({
      variables: {
        input: { id, name: newProjectName, description: newProjectDescription }
      }
    });
    // reset the inEditMode state value
    setInEditMode({
      status: false,
      rowKey: null
    });
  };

  const onDelete = (id: string) => {
    deleteProject({ variables: { id } });
  };

  const onCancel = () => {
    // reset the inEditMode state value
    setInEditMode({
      status: false,
      rowKey: null
    });
    // reset the unit price state value
    setProjectFields({ name: '', description: '' });
  };

  const defaultButtonsNode = (item: IProject) => (
    <>
      <Link to={`/project/${item.id}`}>
        <IconButton
          _hover={{ backgroundColor: 'blue.600', color: 'gray.200' }}
          backgroundColor="gray.200"
          aria-label="View project"
          icon={<ViewIcon />}
        />
      </Link>
      <IconButton
        backgroundColor="gray.200"
        aria-label="Edit Project"
        _hover={{ backgroundColor: 'green.600', color: 'gray.200' }}
        icon={<EditIcon />}
        onClick={() =>
          onEdit({
            id: item.id,
            currentName: item.name,
            currentDescription: item.description
          })
        }
      />
      <IconButton
        backgroundColor="gray.200"
        _hover={{ backgroundColor: 'red.600', color: 'gray.200' }}
        aria-label="Delete Project"
        icon={<DeleteIcon />}
        onClick={() => onDelete(item.id)}
      />
    </>
  );

  const editModeButtonsNode = (item: IProject) => (
    <>
      <IconButton
        backgroundColor="gray.200"
        aria-label="Save Project"
        icon={<CheckIcon />}
        onClick={() =>
          onSave({
            id: item.id,
            newProjectName: projectFields.name,
            newProjectDescription: projectFields.description
          })
        }
      />
      <IconButton
        backgroundColor="gray.200"
        _hover={{ backgroundColor: 'red.500', color: 'gray.200' }}
        icon={<CloseIcon />}
        aria-label="Cancel editing project"
        onClick={onCancel}
      />
    </>
  );

  const projectTime = (project: IProject): number => {
    if (!project.time) return 0;

    const totalTime = project?.time?.reduce((acc, cur) => {
      if (cur?.amount) {
        return acc + cur?.amount;
      }
      return acc;
    }, 0);

    return totalTime;
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
              <Tr key={project?.id}>
                {/* Could be abstracted to a map of ['name', 'description'] field array and dynamically replace the fields, but decided to keep it like this for legibility */}
                <Td>
                  {inEditMode.status && inEditMode.rowKey === project.id ? (
                    <Input
                      maxW="9rem"
                      required
                      value={projectFields.name}
                      onChange={event =>
                        setProjectFields(prevState => ({
                          ...prevState,
                          name: event.target.value
                        }))
                      }
                    />
                  ) : (
                    <Skeleton isLoaded={!loading}>{project.name}</Skeleton>
                  )}
                </Td>
                <Td>
                  {inEditMode.status && inEditMode.rowKey === project.id ? (
                    <Input
                      required
                      value={projectFields.description}
                      onChange={event =>
                        setProjectFields(prevState => ({
                          ...prevState,
                          description: event.target.value
                        }))
                      }
                    />
                  ) : (
                    <Skeleton isLoaded={!loading}>
                      {project.description}
                    </Skeleton>
                  )}
                </Td>
                <Td width="1px" textAlign="right" whiteSpace="nowrap" isNumeric>
                  {projectTime(project)}
                </Td>
                <Td width="1px" textAlign="right" whiteSpace="nowrap">
                  <HStack spacing={2} justifyContent="flex-end">
                    {inEditMode.status && inEditMode.rowKey === project.id
                      ? editModeButtonsNode(project)
                      : defaultButtonsNode(project)}
                  </HStack>
                </Td>
              </Tr>
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

export default OriginalProjectsTable;
