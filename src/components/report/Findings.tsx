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
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Badge,
} from '@chakra-ui/react';
import { FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { Report, Finding } from '../../utils/db';

type Severity = 'low' | 'medium' | 'high' | 'critical';
type Status = 'open' | 'in_progress' | 'resolved' | 'false_positive';

interface FindingsProps {
  report: Report;
  onSave: (report: Report) => Promise<void>;
  onDirtyChange: (isDirty: boolean) => void;
  onFormDataChange: (data: Report) => void;
}

const Findings: React.FC<FindingsProps> = ({
  report,
  onSave,
  onDirtyChange,
  onFormDataChange,
}) => {
  const [formData, setFormData] = useState<Report>(report);
  const [editingFinding, setEditingFinding] = useState<number | null>(null);
  const toast = useToast();

  useEffect(() => {
    setFormData(report);
  }, [report]);

  const handleFindingChange = (index: number, field: keyof Finding, value: string | Severity | Status) => {
    const newFindings = [...formData.findings];
    newFindings[index] = {
      ...newFindings[index],
      [field]: value,
    };
    const newData: Report = {
      ...formData,
      findings: newFindings,
    };
    setFormData(newData);
    onFormDataChange(newData);
    onDirtyChange(true);
  };

  const handleArrayChange = (index: number, field: 'steps_to_reproduce' | 'remediation_steps', arrayIndex: number, value: string) => {
    const newFindings = [...formData.findings];
    const newArray = [...newFindings[index][field]];
    newArray[arrayIndex] = value;
    newFindings[index] = {
      ...newFindings[index],
      [field]: newArray,
    };
    const newData: Report = {
      ...formData,
      findings: newFindings,
    };
    setFormData(newData);
    onFormDataChange(newData);
    onDirtyChange(true);
  };

  const addArrayItem = (index: number, field: 'steps_to_reproduce' | 'remediation_steps') => {
    const newFindings = [...formData.findings];
    const newArray = [...newFindings[index][field], ''];
    newFindings[index] = {
      ...newFindings[index],
      [field]: newArray,
    };
    const newData: Report = {
      ...formData,
      findings: newFindings,
    };
    setFormData(newData);
    onFormDataChange(newData);
    onDirtyChange(true);
  };

  const removeArrayItem = (index: number, field: 'steps_to_reproduce' | 'remediation_steps', arrayIndex: number) => {
    const newFindings = [...formData.findings];
    const newArray = newFindings[index][field].filter((_, i) => i !== arrayIndex);
    newFindings[index] = {
      ...newFindings[index],
      [field]: newArray,
    };
    const newData: Report = {
      ...formData,
      findings: newFindings,
    };
    setFormData(newData);
    onFormDataChange(newData);
    onDirtyChange(true);
  };

  const addFinding = () => {
    const newFinding: Finding = {
      id: `F${formData.findings.length + 1}`,
      title: '',
      description: '',
      severity: 'low',
      status: 'open',
      affected_components: [],
      steps_to_reproduce: [],
      remediation_steps: [],
      references: [],
    };
    const newData: Report = {
      ...formData,
      findings: [...formData.findings, newFinding],
    };
    setFormData(newData);
    onFormDataChange(newData);
    onDirtyChange(true);
    setEditingFinding(newData.findings.length - 1);
  };

  const removeFinding = (index: number) => {
    const newFindings = formData.findings.filter((_, i) => i !== index);
    const newData: Report = {
      ...formData,
      findings: newFindings,
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
        description: 'Findings saved successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save findings',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const getSeverityColor = (severity: Severity) => {
    switch (severity) {
      case 'critical':
        return 'red';
      case 'high':
        return 'orange';
      case 'medium':
        return 'yellow';
      case 'low':
        return 'green';
    }
  };

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Text fontSize="xl" fontWeight="bold">Findings</Text>
          <Button leftIcon={<FiPlus />} onClick={addFinding}>
            Add Finding
          </Button>
        </HStack>

        <Accordion allowMultiple>
          {formData.findings.map((finding, index) => (
            <AccordionItem key={index}>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <HStack>
                      <Text>{finding.id}</Text>
                      <Text fontWeight="bold">{finding.title || 'Untitled Finding'}</Text>
                      <Badge colorScheme={getSeverityColor(finding.severity)}>
                        {finding.severity}
                      </Badge>
                      <Badge colorScheme={finding.status === 'resolved' ? 'green' : 'blue'}>
                        {finding.status}
                      </Badge>
                    </HStack>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <VStack spacing={4} align="stretch">
                  <FormControl isRequired>
                    <FormLabel>Title</FormLabel>
                    <Input
                      value={finding.title}
                      onChange={(e) => handleFindingChange(index, 'title', e.target.value)}
                      placeholder="Enter finding title"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Description</FormLabel>
                    <Textarea
                      value={finding.description}
                      onChange={(e) => handleFindingChange(index, 'description', e.target.value)}
                      placeholder="Describe the finding"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Severity</FormLabel>
                    <Select
                      value={finding.severity}
                      onChange={(e) => handleFindingChange(index, 'severity', e.target.value as Severity)}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </Select>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Status</FormLabel>
                    <Select
                      value={finding.status}
                      onChange={(e) => handleFindingChange(index, 'status', e.target.value as Status)}
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="false_positive">False Positive</option>
                    </Select>
                  </FormControl>

                  <Box>
                    <HStack justify="space-between" mb={4}>
                      <Text fontWeight="bold">Steps to Reproduce</Text>
                      <Button leftIcon={<FiPlus />} size="sm" onClick={() => addArrayItem(index, 'steps_to_reproduce')}>
                        Add Step
                      </Button>
                    </HStack>
                    <VStack spacing={4}>
                      {finding.steps_to_reproduce.map((step, stepIndex) => (
                        <HStack key={stepIndex} spacing={4} align="start">
                          <FormControl isRequired>
                            <Input
                              value={step}
                              onChange={(e) => handleArrayChange(index, 'steps_to_reproduce', stepIndex, e.target.value)}
                              placeholder="Enter a step"
                            />
                          </FormControl>
                          <IconButton
                            aria-label="Remove step"
                            icon={<FiTrash2 />}
                            onClick={() => removeArrayItem(index, 'steps_to_reproduce', stepIndex)}
                          />
                        </HStack>
                      ))}
                    </VStack>
                  </Box>

                  <Box>
                    <HStack justify="space-between" mb={4}>
                      <Text fontWeight="bold">Remediation Steps</Text>
                      <Button leftIcon={<FiPlus />} size="sm" onClick={() => addArrayItem(index, 'remediation_steps')}>
                        Add Step
                      </Button>
                    </HStack>
                    <VStack spacing={4}>
                      {finding.remediation_steps.map((step, stepIndex) => (
                        <HStack key={stepIndex} spacing={4} align="start">
                          <FormControl isRequired>
                            <Input
                              value={step}
                              onChange={(e) => handleArrayChange(index, 'remediation_steps', stepIndex, e.target.value)}
                              placeholder="Enter a remediation step"
                            />
                          </FormControl>
                          <IconButton
                            aria-label="Remove step"
                            icon={<FiTrash2 />}
                            onClick={() => removeArrayItem(index, 'remediation_steps', stepIndex)}
                          />
                        </HStack>
                      ))}
                    </VStack>
                  </Box>

                  <HStack justify="flex-end">
                    <IconButton
                      aria-label="Delete finding"
                      icon={<FiTrash2 />}
                      colorScheme="red"
                      onClick={() => removeFinding(index)}
                    />
                  </HStack>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>

        <Button colorScheme="blue" onClick={handleSubmit}>
          Save Changes
        </Button>
      </VStack>
    </Box>
  );
};

export default Findings; 