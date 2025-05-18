import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import type { Finding } from '../../utils/db';

interface FindingsProps {
  findings: Finding[];
  onFindingsChange: (findings: Finding[]) => void;
}

type Severity = 'informational' | 'low' | 'medium' | 'high' | 'critical';

const getSeverityColor = (severity: Severity): string => {
  switch (severity) {
    case 'critical':
      return 'red';
    case 'high':
      return 'orange';
    case 'medium':
      return 'yellow';
    case 'low':
      return 'green';
    case 'informational':
      return 'blue';
    default:
      return 'gray';
  }
};

export const Findings: React.FC<FindingsProps> = ({ findings, onFindingsChange }) => {
  const [formData, setFormData] = useState<Finding[]>(findings);
  const [editingFinding, setEditingFinding] = useState<number | null>(null);
  const toast = useToast();

  const handleFindingChange = (index: number, field: keyof Finding, value: any) => {
    const newFindings = [...formData];
    newFindings[index] = {
      ...newFindings[index],
      [field]: value,
    };
    setFormData(newFindings);
    onFindingsChange(newFindings);
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
    setFormData([...formData, newFinding]);
    onFindingsChange([...formData, newFinding]);
  };

  const handleRemoveFinding = (index: number) => {
    const newFindings = formData.filter((_, i) => i !== index);
    setFormData(newFindings);
    onFindingsChange(newFindings);
  };

  const handleSave = () => {
    onFindingsChange(formData);
    toast({
      title: 'Findings saved',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box>
      <VStack spacing={4} align="stretch">
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

        <HStack spacing={4}>
          <Button colorScheme="blue" onClick={handleAddFinding}>
            Add Finding
          </Button>
          <Button colorScheme="green" onClick={handleSave}>
            Save All Changes
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}; 