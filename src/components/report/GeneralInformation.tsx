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
import { FiSave, FiTrash2 } from 'react-icons/fi';
import { Report } from '../../utils/db';

interface GeneralInformationProps {
  report: Report;
  onSave: (report: Report) => void;
  onDirtyChange: (isDirty: boolean) => void;
  onFormDataChange: (data: Report) => void;
  onDelete?: () => void;
}

const GeneralInformation: React.FC<GeneralInformationProps> = ({ 
  report, 
  onSave, 
  onDirtyChange,
  onFormDataChange,
  onDelete 
}) => {
  const [formData, setFormData] = useState<Report>(report);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setFormData(report);
    setIsDirty(false);
  }, [report]);

  const handleChange = (field: keyof Report, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    setIsDirty(true);
    onDirtyChange(true);
    onFormDataChange(newData);
  };

  const handleSave = async () => {
    try {
      await onSave(formData);
      setIsDirty(false);
      onDirtyChange(false);
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
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter report name"
            />
          </FormControl>
          <HStack spacing={2}>
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
            onChange={(e) => handleChange('assessmentType', e.target.value)}
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
            onChange={(e) => handleChange('tester', e.target.value)}
            placeholder="Enter tester name"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Date</FormLabel>
          <Input
            name="date"
            type="date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Security Team</FormLabel>
          <Input
            name="securityTeam"
            value={formData.securityTeam || ''}
            onChange={(e) => handleChange('securityTeam', e.target.value)}
            placeholder="Enter security team"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Start Date</FormLabel>
          <Input
            name="startDate"
            type="date"
            value={formData.startDate || ''}
            onChange={(e) => handleChange('startDate', e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>End Date</FormLabel>
          <Input
            name="endDate"
            type="date"
            value={formData.endDate || ''}
            onChange={(e) => handleChange('endDate', e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Scope</FormLabel>
          <Input
            name="scope"
            value={formData.scope || ''}
            onChange={(e) => handleChange('scope', e.target.value)}
            placeholder="Enter scope"
          />
        </FormControl>
      </VStack>
    </Box>
  );
};

export default GeneralInformation; 