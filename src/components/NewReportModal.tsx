import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
} from '@chakra-ui/react';

interface NewReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { clientName: string; engagementName: string; engagementId: string }) => void;
}

const NewReportModal: React.FC<NewReportModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [clientName, setClientName] = useState('');
  const [engagementName, setEngagementName] = useState('');
  const [engagementId, setEngagementId] = useState('');

  const handleSubmit = () => {
    onSubmit({ clientName, engagementName, engagementId });
    setClientName('');
    setEngagementName('');
    setEngagementId('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>New Penetration Test</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Client Name</FormLabel>
              <Input
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Enter client name"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Engagement Name</FormLabel>
              <Input
                value={engagementName}
                onChange={(e) => setEngagementName(e.target.value)}
                placeholder="Enter engagement name"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Engagement ID</FormLabel>
              <Input
                value={engagementId}
                onChange={(e) => setEngagementId(e.target.value)}
                placeholder="Enter engagement ID (optional)"
              />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isDisabled={!clientName || !engagementName}
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NewReportModal; 