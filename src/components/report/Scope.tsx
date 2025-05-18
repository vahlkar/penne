import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  HStack,
  IconButton,
  Text,
  useToast,
  Select,
  Textarea,
} from '@chakra-ui/react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { Report } from '../../utils/db';

type TestingType = 'black-box' | 'gray-box' | 'white-box';

interface ScopeProps {
  report: Report;
  onSave: (report: Report) => Promise<void>;
  onDirtyChange: (isDirty: boolean) => void;
  onFormDataChange: (data: Report) => void;
}

const Scope: React.FC<ScopeProps> = ({
  report,
  onSave,
  onDirtyChange,
  onFormDataChange,
}) => {
  const [formData, setFormData] = useState<Report>(report);
  const toast = useToast();

  useEffect(() => {
    setFormData(report);
  }, [report]);

  const handleTargetChange = (index: number, field: string, value: string | TestingType) => {
    const newInScope = [...formData.scope.in_scope];
    newInScope[index] = { ...newInScope[index], [field]: value };
    const newData: Report = {
      ...formData,
      scope: {
        ...formData.scope,
        in_scope: newInScope,
      },
    };
    setFormData(newData);
    onFormDataChange(newData);
    onDirtyChange(true);
  };

  const handleMethodologyChange = (index: number, value: string) => {
    const newInScope = [...formData.scope.in_scope];
    newInScope[index] = {
      ...newInScope[index],
      methodologies: value.split(',').map(m => m.trim()),
    };
    const newData: Report = {
      ...formData,
      scope: {
        ...formData.scope,
        in_scope: newInScope,
      },
    };
    setFormData(newData);
    onFormDataChange(newData);
    onDirtyChange(true);
  };

  const addTarget = () => {
    const newInScope = [
      ...formData.scope.in_scope,
      {
        target: '',
        description: '',
        testing_type: 'black-box' as TestingType,
        methodologies: [],
      },
    ];
    const newData: Report = {
      ...formData,
      scope: {
        ...formData.scope,
        in_scope: newInScope,
      },
    };
    setFormData(newData);
    onFormDataChange(newData);
    onDirtyChange(true);
  };

  const removeTarget = (index: number) => {
    const newInScope = formData.scope.in_scope.filter((_, i) => i !== index);
    const newData: Report = {
      ...formData,
      scope: {
        ...formData.scope,
        in_scope: newInScope,
      },
    };
    setFormData(newData);
    onFormDataChange(newData);
    onDirtyChange(true);
  };

  const handleSubmit = async () => {
    try {
      await onSave(formData);
      onDirtyChange(false);
      toast({
        title: 'Success',
        description: 'Scope information saved successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save scope information',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Text fontSize="xl" fontWeight="bold">In-Scope Targets</Text>
          <Button leftIcon={<FiPlus />} onClick={addTarget}>
            Add Target
          </Button>
        </HStack>

        {formData.scope.in_scope.map((target, index) => (
          <Box key={index} p={4} borderWidth={1} borderRadius="md">
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <Text fontWeight="bold">Target {index + 1}</Text>
                <IconButton
                  aria-label="Remove target"
                  icon={<FiTrash2 />}
                  onClick={() => removeTarget(index)}
                  size="sm"
                />
              </HStack>

              <FormControl isRequired>
                <FormLabel>Target</FormLabel>
                <Input
                  value={target.target}
                  onChange={(e) => handleTargetChange(index, 'target', e.target.value)}
                  placeholder="e.g., api.example.com"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={target.description}
                  onChange={(e) => handleTargetChange(index, 'description', e.target.value)}
                  placeholder="Describe the target and its purpose"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Testing Type</FormLabel>
                <Select
                  value={target.testing_type}
                  onChange={(e) => handleTargetChange(index, 'testing_type', e.target.value as TestingType)}
                >
                  <option value="black-box">Black Box</option>
                  <option value="gray-box">Gray Box</option>
                  <option value="white-box">White Box</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Methodologies</FormLabel>
                <Input
                  value={target.methodologies.join(', ')}
                  onChange={(e) => handleMethodologyChange(index, e.target.value)}
                  placeholder="Enter methodologies separated by commas"
                />
              </FormControl>
            </VStack>
          </Box>
        ))}

        <Button colorScheme="blue" onClick={handleSubmit}>
          Save Changes
        </Button>
      </VStack>
    </Box>
  );
};

export default Scope; 