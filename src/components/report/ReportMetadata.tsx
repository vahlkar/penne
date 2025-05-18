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
} from '@chakra-ui/react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { Report } from '../../utils/db';

interface ReportMetadataProps {
  report: Report;
  onSave: (report: Report) => Promise<void>;
  onDirtyChange: (isDirty: boolean) => void;
  onFormDataChange: (data: Report) => void;
}

const ReportMetadata: React.FC<ReportMetadataProps> = ({
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

  const handleChange = (field: string, value: any) => {
    const newData = {
      ...formData,
      report_metadata: {
        ...formData.report_metadata,
        [field]: value,
      },
    };
    setFormData(newData);
    onFormDataChange(newData);
    onDirtyChange(true);
  };

  const handleDateChange = (field: 'start' | 'end', value: string) => {
    const newData = {
      ...formData,
      report_metadata: {
        ...formData.report_metadata,
        date_of_testing: {
          ...formData.report_metadata.date_of_testing,
          [field]: value,
        },
      },
    };
    setFormData(newData);
    onFormDataChange(newData);
    onDirtyChange(true);
  };

  const handleTeamMemberChange = (index: number, field: string, value: string) => {
    const newTeam = [...formData.report_metadata.tester_info.team];
    newTeam[index] = { ...newTeam[index], [field]: value };
    const newData = {
      ...formData,
      report_metadata: {
        ...formData.report_metadata,
        tester_info: {
          ...formData.report_metadata.tester_info,
          team: newTeam,
        },
      },
    };
    setFormData(newData);
    onFormDataChange(newData);
    onDirtyChange(true);
  };

  const handleContactChange = (index: number, field: string, value: string) => {
    const newContacts = [...formData.report_metadata.recipient.contacts];
    newContacts[index] = { ...newContacts[index], [field]: value };
    const newData = {
      ...formData,
      report_metadata: {
        ...formData.report_metadata,
        recipient: {
          ...formData.report_metadata.recipient,
          contacts: newContacts,
        },
      },
    };
    setFormData(newData);
    onFormDataChange(newData);
    onDirtyChange(true);
  };

  const addTeamMember = () => {
    const newTeam = [
      ...formData.report_metadata.tester_info.team,
      { name: '', email: '', role: '' },
    ];
    const newData = {
      ...formData,
      report_metadata: {
        ...formData.report_metadata,
        tester_info: {
          ...formData.report_metadata.tester_info,
          team: newTeam,
        },
      },
    };
    setFormData(newData);
    onFormDataChange(newData);
    onDirtyChange(true);
  };

  const removeTeamMember = (index: number) => {
    const newTeam = formData.report_metadata.tester_info.team.filter((_, i) => i !== index);
    const newData = {
      ...formData,
      report_metadata: {
        ...formData.report_metadata,
        tester_info: {
          ...formData.report_metadata.tester_info,
          team: newTeam,
        },
      },
    };
    setFormData(newData);
    onFormDataChange(newData);
    onDirtyChange(true);
  };

  const addContact = () => {
    const newContacts = [
      ...formData.report_metadata.recipient.contacts,
      { name: '', email: '', role: '' },
    ];
    const newData = {
      ...formData,
      report_metadata: {
        ...formData.report_metadata,
        recipient: {
          ...formData.report_metadata.recipient,
          contacts: newContacts,
        },
      },
    };
    setFormData(newData);
    onFormDataChange(newData);
    onDirtyChange(true);
  };

  const removeContact = (index: number) => {
    const newContacts = formData.report_metadata.recipient.contacts.filter((_, i) => i !== index);
    const newData = {
      ...formData,
      report_metadata: {
        ...formData.report_metadata,
        recipient: {
          ...formData.report_metadata.recipient,
          contacts: newContacts,
        },
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
        description: 'Report metadata saved successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save report metadata',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <FormControl isRequired>
          <FormLabel>Report ID</FormLabel>
          <Input
            value={formData.report_metadata.report_id}
            onChange={(e) => handleChange('report_id', e.target.value)}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Client Name</FormLabel>
          <Input
            value={formData.report_metadata.client_name}
            onChange={(e) => handleChange('client_name', e.target.value)}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Engagement Name</FormLabel>
          <Input
            value={formData.report_metadata.engagement_name}
            onChange={(e) => handleChange('engagement_name', e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Engagement ID</FormLabel>
          <Input
            value={formData.report_metadata.engagement_id || ''}
            onChange={(e) => handleChange('engagement_id', e.target.value)}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Date Generated</FormLabel>
          <Input
            type="datetime-local"
            value={formData.report_metadata.date_generated}
            onChange={(e) => handleChange('date_generated', e.target.value)}
          />
        </FormControl>

        <Box>
          <Text fontWeight="bold" mb={4}>Testing Period</Text>
          <HStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Start Date</FormLabel>
              <Input
                type="datetime-local"
                value={formData.report_metadata.date_of_testing.start}
                onChange={(e) => handleDateChange('start', e.target.value)}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>End Date</FormLabel>
              <Input
                type="datetime-local"
                value={formData.report_metadata.date_of_testing.end}
                onChange={(e) => handleDateChange('end', e.target.value)}
              />
            </FormControl>
          </HStack>
        </Box>

        <Box>
          <HStack justify="space-between" mb={4}>
            <Text fontWeight="bold">Testing Team</Text>
            <Button leftIcon={<FiPlus />} size="sm" onClick={addTeamMember}>
              Add Team Member
            </Button>
          </HStack>
          <VStack spacing={4}>
            {formData.report_metadata.tester_info.team.map((member, index) => (
              <HStack key={index} spacing={4} align="start">
                <FormControl isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input
                    value={member.name}
                    onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={member.email}
                    onChange={(e) => handleTeamMemberChange(index, 'email', e.target.value)}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Role</FormLabel>
                  <Input
                    value={member.role}
                    onChange={(e) => handleTeamMemberChange(index, 'role', e.target.value)}
                  />
                </FormControl>
                <IconButton
                  aria-label="Remove team member"
                  icon={<FiTrash2 />}
                  onClick={() => removeTeamMember(index)}
                  mt={8}
                />
              </HStack>
            ))}
          </VStack>
        </Box>

        <Box>
          <HStack justify="space-between" mb={4}>
            <Text fontWeight="bold">Recipient Information</Text>
            <Button leftIcon={<FiPlus />} size="sm" onClick={addContact}>
              Add Contact
            </Button>
          </HStack>
          <VStack spacing={4}>
            {formData.report_metadata.recipient.contacts.map((contact, index) => (
              <HStack key={index} spacing={4} align="start">
                <FormControl isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input
                    value={contact.name}
                    onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={contact.email}
                    onChange={(e) => handleContactChange(index, 'email', e.target.value)}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Role</FormLabel>
                  <Input
                    value={contact.role}
                    onChange={(e) => handleContactChange(index, 'role', e.target.value)}
                  />
                </FormControl>
                <IconButton
                  aria-label="Remove contact"
                  icon={<FiTrash2 />}
                  onClick={() => removeContact(index)}
                  mt={8}
                />
              </HStack>
            ))}
          </VStack>
        </Box>

        <FormControl isRequired>
          <FormLabel>Report Version</FormLabel>
          <Input
            value={formData.report_metadata.report_version}
            onChange={(e) => handleChange('report_version', e.target.value)}
          />
        </FormControl>

        <Button colorScheme="blue" onClick={handleSubmit}>
          Save Changes
        </Button>
      </VStack>
    </Box>
  );
};

export default ReportMetadata; 