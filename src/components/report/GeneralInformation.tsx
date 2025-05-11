import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  Button,
  HStack,
} from '@chakra-ui/react';
import { FiSave, FiTrash2, FiEdit } from 'react-icons/fi';
import { Report } from '../../utils/db';

interface GeneralInformationProps {
  report: Report;
  onSave: (updatedReport: Report) => Promise<void>;
  onDirtyChange: (isDirty: boolean) => void;
  onDelete?: () => void;
}

const GeneralInformation: React.FC<GeneralInformationProps> = ({ 
  report, 
  onSave, 
  onDirtyChange,
  onDelete 
}) => {
  const [formData, setFormData] = useState<Report>(report);

  useEffect(() => {
    setFormData(report);
  }, [report]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newData = {
      ...formData,
      [name]: value
    };
    setFormData(newData);
    onDirtyChange(true);
  };

  const handleSave = async () => {
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Failed to save report:', error);
    }
  };

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between" mb={4}>
          <FormControl>
            <FormLabel>Report Name</FormLabel>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter report name"
            />
          </FormControl>
          <HStack spacing={2}>
            <Button
              leftIcon={<FiEdit />}
              colorScheme="blue"
              variant="outline"
              onClick={() => {/* TODO: Implement propose update */}}
            >
              Propose Update
            </Button>
            <Button
              leftIcon={<FiSave />}
              colorScheme="blue"
              onClick={handleSave}
            >
              Save
            </Button>
            {onDelete && (
              <Button
                leftIcon={<FiTrash2 />}
                colorScheme="red"
                variant="outline"
                onClick={onDelete}
              >
                Delete
              </Button>
            )}
          </HStack>
        </HStack>

        <FormControl>
          <FormLabel>Assessment Type</FormLabel>
          <Select
            name="assessmentType"
            value={formData.assessmentType}
            onChange={handleChange}
          >
            <option value="Web Application">Web Application</option>
            <option value="Mobile Application">Mobile Application</option>
            <option value="Network">Network</option>
            <option value="API">API</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Tester</FormLabel>
          <Input
            name="tester"
            value={formData.tester}
            onChange={handleChange}
            placeholder="Enter tester name"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Date</FormLabel>
          <Input
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Security Team</FormLabel>
          <Input
            name="securityTeam"
            value={formData.securityTeam || ''}
            onChange={handleChange}
            placeholder="Enter security team"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Start Date</FormLabel>
          <Input
            name="startDate"
            type="date"
            value={formData.startDate || ''}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl>
          <FormLabel>End Date</FormLabel>
          <Input
            name="endDate"
            type="date"
            value={formData.endDate || ''}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Scope</FormLabel>
          <Input
            name="scope"
            value={formData.scope || ''}
            onChange={handleChange}
            placeholder="Enter scope"
          />
        </FormControl>
      </VStack>
    </Box>
  );
};

export default GeneralInformation; 