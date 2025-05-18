import React, { useState, useEffect, useRef } from 'react';
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiPlus, FiEdit2, FiTrash2, FiDownload, FiUpload } from 'react-icons/fi';
import { Finding, getAllStandardObservations, deleteStandardObservation, addStandardObservation, updateStandardObservation } from '../utils/db';

interface ObservationFormData {
  title: string;
  severity: 'informational' | 'low' | 'medium' | 'high' | 'critical';
  cvss_score: number;
  cvss_vector?: string;
  summary: string;
  affected_assets: string[];
  technical_details: {
    impact: string;
    testing_process: string;
  };
  recommendations: string[];
  references?: string[];
  status: 'resolved' | 'unresolved' | 'accepted_risk' | 'false_positive';
}

const initialFormData: ObservationFormData = {
  title: '',
  severity: 'low',
  cvss_score: 0,
  summary: '',
  affected_assets: [],
  technical_details: {
    impact: '',
    testing_process: '',
  },
  recommendations: [],
  status: 'unresolved',
};

const StandardObservations: React.FC = () => {
  const [observations, setObservations] = useState<Finding[]>([]);
  const [selectedObservation, setSelectedObservation] = useState<Finding | null>(null);
  const [formData, setFormData] = useState<ObservationFormData>(initialFormData);
  const [isEditing, setIsEditing] = useState(false);
  const toast = useToast();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadObservations();
  }, []);

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

  const handleFormSubmit = async () => {
    try {
      if (isEditing && selectedObservation) {
        await updateStandardObservation({
          ...selectedObservation,
          ...formData,
        });
        toast({
          title: 'Observation updated',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await addStandardObservation(formData);
        toast({
          title: 'Observation added',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      await loadObservations();
      onFormClose();
      resetForm();
    } catch (error) {
      console.error('Failed to save observation:', error);
      toast({
        title: 'Error',
        description: 'Failed to save observation',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEdit = (observation: Finding) => {
    setSelectedObservation(observation);
    setFormData({
      title: observation.title,
      severity: observation.severity,
      cvss_score: observation.cvss_score,
      cvss_vector: observation.cvss_vector,
      summary: observation.summary,
      affected_assets: observation.affected_assets,
      technical_details: observation.technical_details,
      recommendations: observation.recommendations,
      references: observation.references,
      status: observation.status,
    });
    setIsEditing(true);
    onFormOpen();
  };

  const handleNew = () => {
    setSelectedObservation(null);
    setFormData(initialFormData);
    setIsEditing(false);
    onFormOpen();
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setSelectedObservation(null);
    setIsEditing(false);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(observations, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'standard-observations.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content) as Finding[];
        
        // Validate the imported data
        if (!Array.isArray(importedData)) {
          throw new Error('Invalid format: expected an array of observations');
        }

        // Import each observation
        for (const observation of importedData) {
          await addStandardObservation(observation);
        }

        await loadObservations();
        toast({
          title: 'Import successful',
          description: `Imported ${importedData.length} observations`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error('Failed to import observations:', error);
        toast({
          title: 'Error',
          description: 'Failed to import observations. Please check the file format.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };
    reader.readAsText(file);
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
          <HStack spacing={4}>
            <Button
              leftIcon={<FiUpload />}
              onClick={() => fileInputRef.current?.click()}
            >
              Import
            </Button>
            <Button
              leftIcon={<FiDownload />}
              onClick={handleExport}
            >
              Export
            </Button>
            <Button
              leftIcon={<FiPlus />}
              colorScheme="blue"
              onClick={handleNew}
            >
              Add Observation
            </Button>
          </HStack>
        </Box>

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept=".json"
          onChange={handleImport}
        />

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
                    onClick={() => handleEdit(observation)}
                  />
                  <IconButton
                    aria-label="Delete observation"
                    icon={<FiTrash2 />}
                    size="sm"
                    colorScheme="red"
                    onClick={() => {
                      setSelectedObservation(observation);
                      onDeleteOpen();
                    }}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          isOpen={isDeleteOpen}
          leastDestructiveRef={cancelRef}
          onClose={onDeleteClose}
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
                <Button ref={cancelRef} onClick={onDeleteClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => {
                    if (selectedObservation) {
                      handleDelete(selectedObservation.id);
                    }
                    onDeleteClose();
                  }}
                  ml={3}
                >
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>

        {/* Form Modal */}
        <Modal isOpen={isFormOpen} onClose={onFormClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {isEditing ? 'Edit Observation' : 'New Observation'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Title</FormLabel>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Severity</FormLabel>
                  <Select
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
                  >
                    <option value="informational">Informational</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>CVSS Score</FormLabel>
                  <NumberInput
                    min={0}
                    max={10}
                    step={0.1}
                    value={formData.cvss_score}
                    onChange={(_, value) => setFormData({ ...formData, cvss_score: value })}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>CVSS Vector</FormLabel>
                  <Input
                    value={formData.cvss_vector || ''}
                    onChange={(e) => setFormData({ ...formData, cvss_vector: e.target.value })}
                    placeholder="CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Summary</FormLabel>
                  <Textarea
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Impact</FormLabel>
                  <Textarea
                    value={formData.technical_details.impact}
                    onChange={(e) => setFormData({
                      ...formData,
                      technical_details: { ...formData.technical_details, impact: e.target.value }
                    })}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Testing Process</FormLabel>
                  <Textarea
                    value={formData.technical_details.testing_process}
                    onChange={(e) => setFormData({
                      ...formData,
                      technical_details: { ...formData.technical_details, testing_process: e.target.value }
                    })}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Recommendations</FormLabel>
                  <Textarea
                    value={formData.recommendations.join('\n')}
                    onChange={(e) => setFormData({
                      ...formData,
                      recommendations: e.target.value.split('\n').filter(line => line.trim())
                    })}
                    placeholder="Enter each recommendation on a new line"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>References</FormLabel>
                  <Textarea
                    value={formData.references?.join('\n') || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      references: e.target.value.split('\n').filter(line => line.trim())
                    })}
                    placeholder="Enter each reference URL on a new line"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Status</FormLabel>
                  <Select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  >
                    <option value="unresolved">Unresolved</option>
                    <option value="resolved">Resolved</option>
                    <option value="accepted_risk">Accepted Risk</option>
                    <option value="false_positive">False Positive</option>
                  </Select>
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onFormClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleFormSubmit}>
                {isEditing ? 'Update' : 'Create'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Container>
  );
};

export default StandardObservations; 