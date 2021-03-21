import { DeleteIcon } from '@chakra-ui/icons';
import {
  IconButton,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react';
import { Project, useDeleteTimeMutation } from '../../generated/graphql';
import { GET_PROJECT } from '../../graphql/query';

interface Props {
  project?: Project | null;
}

const TimeTable = ({ project }: Props) => {
  const [deleteTime] = useDeleteTimeMutation({
    update(cache, { data }) {
      // Replace project in cache with updated time
      cache.writeQuery({
        query: GET_PROJECT,
        data: { project: data?.deleteTime }
      });
    }
  });

  const onDelete = (key: number) => {
    if (project?.id) {
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
              <Td>No time inserted.</Td>
              <Td></Td>
              <Td></Td>
            </Tr>
          </>
        )}
      </Tbody>
    </Table>
  );
};

export default TimeTable;
