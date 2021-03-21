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
import {
  Project,
  useDeleteTimeMutation,
  useGetProjectsQuery
} from '../../generated/graphql';
import { GET_PROJECT, GET_PROJECTS } from '../../graphql/query';

interface Props {
  project?: Project | null;
}

const TimeTable = ({ project }: Props) => {
  const { data, loading, error } = useGetProjectsQuery();

  const [deleteTime] = useDeleteTimeMutation({
    update(cache, { data }) {
      // Get existing projects from cache
      const getProject: {
        project: Project;
      } | null = cache.readQuery({
        query: GET_PROJECT
      });

      // Remove deleted project from list of projects
      cache.writeQuery({
        query: GET_PROJECT,
        data: { project: getProject?.project }
      });
    }
  });

  const onDelete = (key: number) => {
    if (project?.id && key) {
      deleteTime({ variables: { id: project.id, key } });
    }
  };

  return (
    <Table variant="simple">
      <TableCaption>Projects</TableCaption>
      <Thead>
        <Tr>
          <Th>Description</Th>
          <Th isNumeric>Amount (hours)</Th>
          <Th width="1px" textAlign="right" whiteSpace="nowrap">
            Delete
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {project && project?.time && project?.time?.length > 0 ? (
          <>
            {project.time.map((time, key) => (
              <Tr key={key}>
                <Td>{time?.description}</Td>
                <Td isNumeric>{time?.amount}</Td>
                <Td>
                  <IconButton
                    aria-label="Delete Project"
                    icon={<DeleteIcon />}
                    onClick={() => onDelete(key)}
                  />
                </Td>
              </Tr>
            ))}
          </>
        ) : (
          <>
            <Tr minH="4rem" position="relative">
              <Td width="100%">No time inserted.</Td>
              <Td width="100%"></Td>
              <Td width="100%"></Td>
            </Tr>
          </>
        )}
      </Tbody>
    </Table>
  );
};

export default TimeTable;
