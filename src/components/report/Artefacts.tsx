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
  Textarea,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Badge,
} from '@chakra-ui/react';
import { FiPlus, FiTrash2, FiUpload } from 'react-icons/fi';
import { Report } from '../../utils/db';
import type { Artefacts } from '../../utils/db';

interface ArtefactsProps {
  report: Report;
  onSave: (report: Report) => Promise<void>;
  onDirtyChange: (isDirty: boolean) => void;
  onFormDataChange: (data: Report) => void;
}

const Artefacts: React.FC<ArtefactsProps> = ({
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

  const handleGlobalLogChange = (field: 'file_name' | 'file_path', value: string) => {
    const newData: Report = {
      ...formData,
      artefacts: {
        ...formData.artefacts,
        global_test_log: {
          file_name: field === 'file_name' ? value : (formData.artefacts.global_test_log?.file_name || ''),
          file_path: field === 'file_path' ? value : (formData.artefacts.global_test_log?.file_path || ''),
        },
      },
    };
    setFormData(newData);
    onFormDataChange(newData);
    onDirtyChange(true);
  };

  const handleToolChange = (index: number, field: 'tool_name' | 'version', value: string) => {
    const newTools = [...formData.artefacts.tools_used];
    newTools[index] = {
      ...newTools[index],
      [field]: value,
    };
    const newData: Report = {
      ...formData,
      artefacts: {
        ...formData.artefacts,
        tools_used: newTools,
      },
    };
    setFormData(newData);
    onFormDataChange(newData);
    onDirtyChange(true);
  };

  const addTool = () => {
    const newData: Report = {
      ...formData,
      artefacts: {
        ...formData.artefacts,
        tools_used: [
          ...formData.artefacts.tools_used,
          { tool_name: '', version: '' },
        ],
      },
    };
    setFormData(newData);
    onFormDataChange(newData);
    onDirtyChange(true);
  };

  const removeTool = (index: number) => {
    const newTools = formData.artefacts.tools_used.filter((_, i) => i !== index);
    const newData: Report = {
      ...formData,
      artefacts: {
        ...formData.artefacts,
        tools_used: newTools,
      },
    };
    setFormData(newData);
    onFormDataChange(newData);
    onDirtyChange(true);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const newData: Report = {
        ...formData,
        artefacts: {
          ...formData.artefacts,
          global_test_log: {
            file_name: file.name,
            file_path: URL.createObjectURL(file),
          },
        },
      };
      setFormData(newData);
      onFormDataChange(newData);
      onDirtyChange(true);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to read file',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = async () => {
    try {
      await onSave(formData);
      onDirtyChange(false);
      toast({
        title: 'Success',
        description: 'Artefacts saved successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save artefacts',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <Text fontSize="xl" fontWeight="bold">Artefacts</Text>

        <Box>
          <Text fontWeight="bold" mb={4}>Global Test Log</Text>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>File</FormLabel>
              <Input
                type="file"
                onChange={handleFileUpload}
                accept=".txt,.log,.json,.xml,.html,.md"
              />
            </FormControl>
            {formData.artefacts.global_test_log && (
              <>
                <FormControl>
                  <FormLabel>File Name</FormLabel>
                  <Input
                    value={formData.artefacts.global_test_log.file_name}
                    onChange={(e) => handleGlobalLogChange('file_name', e.target.value)}
                    placeholder="Enter file name"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>File Path</FormLabel>
                  <Input
                    value={formData.artefacts.global_test_log.file_path}
                    onChange={(e) => handleGlobalLogChange('file_path', e.target.value)}
                    placeholder="Enter file path"
                  />
                </FormControl>
              </>
            )}
          </VStack>
        </Box>

        <Box>
          <HStack justify="space-between" mb={4}>
            <Text fontWeight="bold">Tools Used</Text>
            <Button leftIcon={<FiPlus />} onClick={addTool}>
              Add Tool
            </Button>
          </HStack>
          <VStack spacing={4}>
            {formData.artefacts.tools_used.map((tool, index) => (
              <HStack key={index} spacing={4} align="start">
                <FormControl isRequired>
                  <FormLabel>Tool Name</FormLabel>
                  <Input
                    value={tool.tool_name}
                    onChange={(e) => handleToolChange(index, 'tool_name', e.target.value)}
                    placeholder="Enter tool name"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Version</FormLabel>
                  <Input
                    value={tool.version}
                    onChange={(e) => handleToolChange(index, 'version', e.target.value)}
                    placeholder="Enter version"
                  />
                </FormControl>
                <IconButton
                  aria-label="Remove tool"
                  icon={<FiTrash2 />}
                  onClick={() => removeTool(index)}
                  alignSelf="flex-end"
                />
              </HStack>
            ))}
          </VStack>
        </Box>

        <Button colorScheme="blue" onClick={handleSubmit}>
          Save Changes
        </Button>
      </VStack>
    </Box>
  );
};

export default Artefacts; 