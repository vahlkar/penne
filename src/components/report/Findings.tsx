import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
  HStack,
  Badge,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  InputGroup,
  InputLeftElement,
  Text,
} from '@chakra-ui/react';
import { FiSearch, FiPlus } from 'react-icons/fi';
import type { Finding } from '../../utils/db';
import { getAllStandardObservations } from '../../utils/db';

interface FindingsProps {
  findings: Finding[];
  onFindingsChange: (findings: Finding[]) => void;
  onSave: (findings: Finding[]) => Promise<void>;
  onDirtyChange: (isDirty: boolean) => void;
}

type Severity = 'informational' | 'low' | 'medium' | 'high' | 'critical';

const getSeverityWeight = (severity: Severity): number => {
  switch (severity) {
    case 'critical':
      return 4;
    case 'high':
      return 3;
    case 'medium':
      return 2;
    case 'low':
      return 1;
    case 'informational':
      return 0;
  }
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

const sortFindings = (findings: Finding[]): Finding[] => {
  return [...findings].sort((a, b) => {
    // First sort by severity
    const severityA = getSeverityWeight(a.severity as Severity);
    const severityB = getSeverityWeight(b.severity as Severity);
    if (severityA !== severityB) {
      return severityB - severityA; // Higher severity first
    }

    // Then by CVSS score
    if (a.cvss_score !== b.cvss_score) {
      return b.cvss_score - a.cvss_score; // Higher score first
    }

    // Finally by title
    return a.title.localeCompare(b.title);
  });
};

export const Findings: React.FC<FindingsProps> = ({ 
  findings, 
  onFindingsChange,
  onSave,
  onDirtyChange 
}) => {
  const [formData, setFormData] = useState<Finding[]>(sortFindings(findings));
  const [editingFinding, setEditingFinding] = useState<number | null>(null);
  const toast = useToast();
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [templates, setTemplates] = useState<Omit<Finding, 'status' | 'affected_assets' | 'report_id'>[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTemplates, setFilteredTemplates] = useState<Omit<Finding, 'status' | 'affected_assets' | 'report_id'>[]>([]);

  useEffect(() => {
    setFormData(sortFindings(findings));
  }, [findings]);

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      setFilteredTemplates(templates.filter(template => 
        template.title.toLowerCase().includes(query) ||
        template.summary.toLowerCase().includes(query)
      ));
    } else {
      setFilteredTemplates(templates);
    }
  }, [searchQuery, templates]);

  const loadTemplates = async () => {
    try {
      const data = await getAllStandardObservations();
      setTemplates(data);
      setFilteredTemplates(data);
    } catch (error) {
      console.error('Failed to load templates:', error);
      toast({
        title: 'Error',
        description: 'Failed to load templates',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleFindingChange = (index: number, field: keyof Finding, value: any) => {
    const newFindings = [...formData];
    newFindings[index] = {
      ...newFindings[index],
      [field]: value,
    };
    const sortedFindings = sortFindings(newFindings);
    setFormData(sortedFindings);
    onFindingsChange(sortedFindings);
    onDirtyChange(true);
  };

  const handleAddFinding = () => {
    const newFinding: Finding = {
      id: crypto.randomUUID(),
      report_id: '', // This should be set by the parent component
      title: '',
      severity: 'informational',
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
    const newFindings = sortFindings([...formData, newFinding]);
    setFormData(newFindings);
    onFindingsChange(newFindings);
    onDirtyChange(true);
  };

  const handleAddFromTemplate = (template: Omit<Finding, 'status' | 'affected_assets' | 'report_id'>) => {
    const newFinding: Finding = {
      ...template,
      id: crypto.randomUUID(),
      report_id: '', // This should be set by the parent component
      affected_assets: [],
      status: 'unresolved',
    };
    const newFindings = sortFindings([...formData, newFinding]);
    setFormData(newFindings);
    onFindingsChange(newFindings);
    onDirtyChange(true);
    setIsTemplateModalOpen(false);
  };

  const handleRemoveFinding = (index: number) => {
    const newFindings = sortFindings(formData.filter((_, i) => i !== index));
    setFormData(newFindings);
    onFindingsChange(newFindings);
    onDirtyChange(true);
  };

  const handleSave = async () => {
    try {
      await onSave(formData);
      onDirtyChange(false);
      toast({
        title: 'Findings saved',
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

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        <HStack spacing={4}>
          <Button colorScheme="blue" onClick={handleAddFinding}>
            Add Empty Finding
          </Button>
          <Button colorScheme="green" onClick={() => setIsTemplateModalOpen(true)}>
            Add from Template
          </Button>
          <Button colorScheme="green" onClick={handleSave}>
            Save All Changes
          </Button>
        </HStack>

        <Accordion allowMultiple>
          {formData.map((finding, index) => (
            <AccordionItem key={finding.id}>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <HStack spacing={4}>
                      <Badge colorScheme={getSeverityColor(finding.severity)}>
                        {finding.severity.toUpperCase()}
                      </Badge>
                      <Badge colorScheme={finding.status === 'resolved' ? 'green' : 'red'}>
                        {finding.status.toUpperCase()}
                      </Badge>
                      <span>{finding.title}</span>
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
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Severity</FormLabel>
                    <Select
                      value={finding.severity}
                      onChange={(e) => handleFindingChange(index, 'severity', e.target.value)}
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
                    <Input
                      type="number"
                      min={0}
                      max={10}
                      step={0.1}
                      value={finding.cvss_score}
                      onChange={(e) => handleFindingChange(index, 'cvss_score', parseFloat(e.target.value))}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Summary</FormLabel>
                    <Textarea
                      value={finding.summary}
                      onChange={(e) => handleFindingChange(index, 'summary', e.target.value)}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Affected Assets</FormLabel>
                    <Textarea
                      value={finding.affected_assets.join('\n')}
                      onChange={(e) => handleFindingChange(index, 'affected_assets', e.target.value.split('\n'))}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Technical Details - Impact</FormLabel>
                    <Textarea
                      value={finding.technical_details.impact}
                      onChange={(e) => handleFindingChange(index, 'technical_details', {
                        ...finding.technical_details,
                        impact: e.target.value,
                      })}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Technical Details - Testing Process</FormLabel>
                    <Textarea
                      value={finding.technical_details.testing_process}
                      onChange={(e) => handleFindingChange(index, 'technical_details', {
                        ...finding.technical_details,
                        testing_process: e.target.value,
                      })}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Recommendations</FormLabel>
                    <Textarea
                      value={finding.recommendations.join('\n')}
                      onChange={(e) => handleFindingChange(index, 'recommendations', e.target.value.split('\n'))}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>References</FormLabel>
                    <Textarea
                      value={finding.references?.join('\n') || ''}
                      onChange={(e) => handleFindingChange(index, 'references', e.target.value.split('\n'))}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Status</FormLabel>
                    <Select
                      value={finding.status}
                      onChange={(e) => handleFindingChange(index, 'status', e.target.value)}
                    >
                      <option value="unresolved">Unresolved</option>
                      <option value="resolved">Resolved</option>
                      <option value="accepted_risk">Accepted Risk</option>
                      <option value="false_positive">False Positive</option>
                    </Select>
                  </FormControl>

                  <Button colorScheme="red" onClick={() => handleRemoveFinding(index)}>
                    Remove Finding
                  </Button>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Template Selection Modal */}
        <Modal isOpen={isTemplateModalOpen} onClose={() => setIsTemplateModalOpen(false)} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Select Template</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4} align="stretch">
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <FiSearch color="gray.300" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </InputGroup>

                {filteredTemplates.map((template) => (
                  <Box
                    key={template.id}
                    p={4}
                    borderWidth="1px"
                    borderRadius="md"
                    cursor="pointer"
                    _hover={{ bg: 'gray.50' }}
                    onClick={() => handleAddFromTemplate(template)}
                  >
                    <VStack align="stretch" spacing={2}>
                      <HStack>
                        <Badge colorScheme={getSeverityColor(template.severity)}>
                          {template.severity.toUpperCase()}
                        </Badge>
                        <Text fontWeight="bold">{template.title}</Text>
                      </HStack>
                      <Text noOfLines={2}>{template.summary}</Text>
                    </VStack>
                  </Box>
                ))}
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={() => setIsTemplateModalOpen(false)}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
}; 