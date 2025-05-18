import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { Report } from '../../utils/db';

interface GeneralInformationProps {
  report: Report;
  onSave: (report: Report) => void;
  onDirtyChange: (isDirty: boolean) => void;
  onFormDataChange: (formData: Report) => void;
}

export const GeneralInformation: React.FC<GeneralInformationProps> = ({
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

  const handleChange = (field: keyof Report, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onFormDataChange(newData);
    onDirtyChange(true);
  };

  const handleSubmit = async () => {
    try {
      await onSave(formData);
      toast({
        title: 'General information saved',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onDirtyChange(false);
    } catch (error) {
      toast({
        title: 'Error saving general information',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4}>
      <VStack spacing={4} align="stretch">
        <FormControl isRequired>
          <FormLabel>Report ID</FormLabel>
          <Input
            value={formData.report_metadata.report_id}
            onChange={(e) => handleChange('report_metadata', {
              ...formData.report_metadata,
              report_id: e.target.value
            })}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Client Name</FormLabel>
          <Input
            value={formData.report_metadata.client_name}
            onChange={(e) => handleChange('report_metadata', {
              ...formData.report_metadata,
              client_name: e.target.value
            })}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Engagement Name</FormLabel>
          <Input
            value={formData.report_metadata.engagement_name}
            onChange={(e) => handleChange('report_metadata', {
              ...formData.report_metadata,
              engagement_name: e.target.value
            })}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Engagement ID</FormLabel>
          <Input
            value={formData.report_metadata.engagement_id || ''}
            onChange={(e) => handleChange('report_metadata', {
              ...formData.report_metadata,
              engagement_id: e.target.value
            })}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Date Generated</FormLabel>
          <Input
            type="date"
            value={formData.report_metadata.date_generated}
            onChange={(e) => handleChange('report_metadata', {
              ...formData.report_metadata,
              date_generated: e.target.value
            })}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Testing Period Start</FormLabel>
          <Input
            type="date"
            value={formData.report_metadata.date_of_testing.start}
            onChange={(e) => handleChange('report_metadata', {
              ...formData.report_metadata,
              date_of_testing: {
                ...formData.report_metadata.date_of_testing,
                start: e.target.value
              }
            })}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Testing Period End</FormLabel>
          <Input
            type="date"
            value={formData.report_metadata.date_of_testing.end}
            onChange={(e) => handleChange('report_metadata', {
              ...formData.report_metadata,
              date_of_testing: {
                ...formData.report_metadata.date_of_testing,
                end: e.target.value
              }
            })}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Report Version</FormLabel>
          <Input
            value={formData.report_metadata.report_version}
            onChange={(e) => handleChange('report_metadata', {
              ...formData.report_metadata,
              report_version: e.target.value
            })}
          />
        </FormControl>

        <Button colorScheme="blue" onClick={handleSubmit}>
          Save Changes
        </Button>
      </VStack>
    </Box>
  );
}; 