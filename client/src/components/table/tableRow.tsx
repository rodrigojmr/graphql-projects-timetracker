import {
  CheckIcon,
  CloseIcon,
  DeleteIcon,
  EditIcon,
  ViewIcon
} from '@chakra-ui/icons';
import { HStack, IconButton, Input, Td, Text, Tr } from '@chakra-ui/react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Project as IProject } from '../../generated/graphql';

// Why separate the table row?
// The parent table keeps focus on handling the number of
// projects for each row as well as handling queries
// It also reduces the amount of re-renders by the projectsField
// by keeping that state in each row instead of making
// the entire table re-render on an input value change
// There are some possible problems with this specific approach
//

interface Props {
  editMode: boolean;
  setEditMode: React.Dispatch<
    React.SetStateAction<{
      status: boolean;
      rowKey: null | string;
    }>
  >;
  onSave: ({
    id,
    name,
    description
  }: {
    id: string;
    name: string;
    description: string;
  }) => void;
  onDelete: (id: string) => void;
  project: IProject;
}

interface ProjectFields {
  name: string;
  description: string;
}

const TableRow: React.FC<Props> = ({
  project,
  editMode,
  onSave,
  onDelete,
  setEditMode
}) => {
  const [projectFields, setProjectFields] = useState({
    name: '',
    description: ''
  });

  const handleEdit = ({
    name: currentName,
    description: currentDescription
  }: ProjectFields) => {
    setProjectFields({
      name: currentName || '',
      description: currentDescription || ''
    });
    setEditMode({
      status: true,
      rowKey: project.id
    });
  };

  const handleSave = ({
    name: newProjectName,
    description: newProjectDescription
  }: ProjectFields) => {
    onSave({
      id: project.id,
      name: newProjectName,
      description: newProjectDescription
    });
    setEditMode({
      status: false,
      rowKey: null
    });
  };

  const handleCancel = () => {
    // reset the inEditMode state value
    setEditMode({
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
          handleEdit({
            name: item.name,
            description: item.description
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
          handleSave({
            name: projectFields.name,
            description: projectFields.description
          })
        }
      />
      <IconButton
        backgroundColor="gray.200"
        _hover={{ backgroundColor: 'red.500', color: 'gray.200' }}
        icon={<CloseIcon />}
        aria-label="Cancel editing project"
        onClick={handleCancel}
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
    <Tr key={project?.id}>
      {/* Could be abstracted to a map of ['name', 'description'] field array and dynamically replace the fields, but decided to keep it like this for legibility */}
      <Td>
        {editMode ? (
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
          <Text>{project.name}</Text>
        )}
      </Td>
      <Td>
        {editMode ? (
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
          <Text>{project.name}</Text>
        )}
      </Td>
      <Td width="1px" textAlign="right" whiteSpace="nowrap" isNumeric>
        {projectTime(project)}
      </Td>
      <Td width="1px" textAlign="right" whiteSpace="nowrap">
        <HStack spacing={2} justifyContent="flex-end">
          {editMode
            ? editModeButtonsNode(project)
            : defaultButtonsNode(project)}
        </HStack>
      </Td>
    </Tr>
  );
};

export default TableRow;
