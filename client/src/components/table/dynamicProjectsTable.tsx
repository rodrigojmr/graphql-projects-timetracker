import {
  CheckIcon,
  CloseIcon,
  DeleteIcon,
  EditIcon,
  ViewIcon
} from '@chakra-ui/icons';
import {
  IconButton,
  Input,
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
  useDeleteProjectMutation,
  useEditProjectMutation,
  useGetProjectsQuery
} from '../../generated/graphql';
import { GET_PROJECTS } from '../../graphql/query';

interface State {
  name: string;
  description: string;
}

enum FieldType {
  Name = 'name',
  Description = 'description'
}

type Action = {
  field: FieldType;
  payload: string;
};

function ProjectsTable() {
  const { data, loading, error } = useGetProjectsQuery();

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

  // To prevent bugs with modifying the cache or making inconsistent changes compared to what is done with the resolver, I refetch from the server again
  // Con: sometimes the project isn't edited properly as the server refetch happens after the change to text
  // TODO Change cache?
  const [editProject] = useEditProjectMutation({
    refetchQueries: [{ query: GET_PROJECTS }]
  });

  const [inEditMode, setInEditMode] = useState<{
    status: boolean;
    rowKey: null | string;
  }>({
    status: false,
    rowKey: null
  });

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

  // TODO Separate rows to prevent re-rendering the entire table again
  const [projectFields, setProjectFields] = useState({
    name: '',
    description: ''
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

  const onSave = ({
    id,
    newProjectName,
    newProjectDescription
  }: {
    id: string;
    newProjectName: string;
    newProjectDescription: string;
  }) => {
    editProject({
      variables: {
        input: { id, name: newProjectName, description: newProjectDescription }
      }
    });
    setInEditMode({
      status: false,
      rowKey: null
    });
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
            Hours
          </Th>
          <Th width="1px" textAlign="right" whiteSpace="nowrap">
            Actions
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {data && data.projects && data.projects.length > 0 ? (
          <>
            {data.projects.map(item => (
              <Tr key={item?.id}>
                {/* Could be abstracted into a map of ['name', 'description'] field array and dynamically replace the fields, but decided to keep it like this for legibility */}

                <Td>
                  {inEditMode.status && inEditMode.rowKey === item.id ? (
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
                    item.name
                  )}
                </Td>
                <Td>
                  {inEditMode.status && inEditMode.rowKey === item.id ? (
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
                    item.description
                  )}
                </Td>
                <Td width="1px" textAlign="right" whiteSpace="nowrap" isNumeric>
                  {item?.time || 0}
                </Td>
                <Td width="1px" textAlign="right" whiteSpace="nowrap">
                  {inEditMode.status && inEditMode.rowKey === item.id ? (
                    <>
                      <IconButton
                        aria-label="Save Project"
                        icon={<CheckIcon />}
                        onClick={() =>
                          onSave({
                            id: item.id,
                            newProjectName: projectFields.name,
                            newProjectDescription: projectFields.description
                          })
                        }
                      >
                        Save
                      </IconButton>

                      <IconButton
                        icon={<CloseIcon />}
                        aria-label="Cancel editing project"
                        onClick={onCancel}
                      >
                        Cancel
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <Link to={`/project/${item.id}`}>
                        <IconButton
                          aria-label="View project"
                          icon={<ViewIcon />}
                        />
                      </Link>
                      <IconButton
                        aria-label="Edit Project"
                        icon={<EditIcon />}
                        onClick={() =>
                          onEdit({
                            id: item.id,
                            currentName: item.name,
                            currentDescription: item.description
                          })
                        }
                      >
                        Edit
                      </IconButton>
                      <IconButton
                        aria-label="Delete Project"
                        icon={<DeleteIcon />}
                        onClick={() => onDelete(item.id)}
                      >
                        Edit
                      </IconButton>
                    </>
                  )}
                </Td>
              </Tr>
            ))}
          </>
        ) : (
          <>
            <Tr minH="4rem" position="relative">
              <Td></Td>
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

export default ProjectsTable;
