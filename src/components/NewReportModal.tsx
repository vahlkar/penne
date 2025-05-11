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
  onSubmit: (data: { name: string; assessmentType: string; tester: string }) => void;
}

const NewReportModal: React.FC<NewReportModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [assessmentType, setAssessmentType] = useState('');
  const [tester, setTester] = useState('');

  const handleSubmit = () => {
    onSubmit({ name, assessmentType, tester });
    setName('');
    setAssessmentType('');
    setTester('');
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
              <FormLabel>Name</FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter report name"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Assessment Type</FormLabel>
              <Select
                value={assessmentType}
                onChange={(e) => setAssessmentType(e.target.value)}
                placeholder="Select assessment type"
              >
                <option value="Web Application">Web Application</option>
                <option value="Mobile Application">Mobile Application</option>
                <option value="Network">Network</option>
                <option value="API">API</option>
                <option value="Social Engineering">Social Engineering</option>
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Tester</FormLabel>
              <Input
                value={tester}
                onChange={(e) => setTester(e.target.value)}
                placeholder="Enter tester name"
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
            isDisabled={!name || !assessmentType || !tester}
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NewReportModal; 