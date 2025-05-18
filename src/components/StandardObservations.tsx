import React, { useState, useEffect } from 'react';
import {
  Container,
  Heading,
  VStack,
  Box,
  Button,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { Finding, getAllStandardObservations, deleteStandardObservation } from '../utils/db';

const StandardObservations: React.FC = () => {
  const [observations, setObservations] = useState<Finding[]>([]);
  const [selectedObservation, setSelectedObservation] = useState<Finding | null>(null);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const loadObservations = async () => {
      try {
        const data = await getAllStandardObservations();
        setObservations(data);
      } catch (error) {
        console.error('Failed to load standard observations:', error);
        toast({
          title: 'Error',
          description: 'Failed to load standard observations',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    loadObservations();
  }, [toast]);

  const handleDelete = async (id: string) => {
    try {
      await deleteStandardObservation(id);
      setObservations(observations.filter(obs => obs.id !== id));
      toast({
        title: 'Observation deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Failed to delete observation:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete observation',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'red';
      case 'high':
        return 'orange';
      case 'medium':
        return 'yellow';
      case 'low':
        return 'green';
      default:
        return 'gray';
    }
  };

  return (
    <Container maxW="container.xl" pt={20}>
      <VStack spacing={6} align="stretch">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Heading>Standard Observations</Heading>
          <Button
            leftIcon={<FiPlus />}
            colorScheme="blue"
            onClick={() => {
              // TODO: Implement new observation creation
              // This will be implemented in the next step with a form modal
            }}
          >
            Add Observation
          </Button>
        </Box>

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Severity</Th>
              <Th>CVSS Score</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {observations.map((observation) => (
              <Tr key={observation.id}>
                <Td>{observation.title}</Td>
                <Td>
                  <Badge colorScheme={getSeverityColor(observation.severity)}>
                    {observation.severity}
                  </Badge>
                </Td>
                <Td>{observation.cvss_score}</Td>
                <Td>
                  <Badge colorScheme={observation.status === 'resolved' ? 'green' : 'yellow'}>
                    {observation.status}
                  </Badge>
                </Td>
                <Td>
                  <IconButton
                    aria-label="Edit observation"
                    icon={<FiEdit2 />}
                    size="sm"
                    mr={2}
                    onClick={() => {
                      // TODO: Implement edit functionality
                      // This will be implemented in the next step with a form modal
                    }}
                  />
                  <IconButton
                    aria-label="Delete observation"
                    icon={<FiTrash2 />}
                    size="sm"
                    colorScheme="red"
                    onClick={() => {
                      setSelectedObservation(observation);
                      onOpen();
                    }}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Observation
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure you want to delete this observation? This action cannot be undone.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => {
                    if (selectedObservation) {
                      handleDelete(selectedObservation.id);
                    }
                    onClose();
                  }}
                  ml={3}
                >
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </VStack>
    </Container>
  );
};

export default StandardObservations; 