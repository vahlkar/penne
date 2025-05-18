import React, { useState, useEffect } from 'react';
import {
  VStack,
  HStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Box,
  Text,
  Collapse,
  useDisclosure,
  useToast,
  Grid,
  GridItem,
  Flex,
  Button,
  RadioGroup,
  Radio,
  Divider,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';
import { Finding } from '../../utils/db';
import { FiChevronDown, FiChevronRight, FiSave, FiTrash2 } from 'react-icons/fi';

interface FindingDetailProps {
  findingId: string | null;
  finding: Finding | undefined;
  onSave: (finding: Finding) => void;
  onDelete: (findingId: string) => void;
  onDirtyChange: (isDirty: boolean) => void;
  onFormDataChange: (data: Finding) => void;
}

// Utility to parse and serialize CVSS vector strings
function parseCVSSVector(vector: string | undefined): Record<string, string> {
  if (!vector) return {};
  return vector.split('/').reduce((acc, metric) => {
    const [key, value] = metric.split(':');
    if (key && value) acc[key] = value;
    return acc;
  }, {} as Record<string, string>);
}
function serializeCVSSVector(metrics: Record<string, string>): string {
  return Object.entries(metrics).map(([k, v]) => `${k}:${v}`).join('/');
}

const FindingDetail: React.FC<FindingDetailProps> = ({
  findingId,
  finding,
  onSave,
  onDelete,
  onDirtyChange,
  onFormDataChange
}) => {
  const { isOpen: isTemporalOpen, onToggle: onTemporalToggle } = useDisclosure();
  const { isOpen: isEnvironmentalOpen, onToggle: onEnvironmentalToggle } = useDisclosure();
  const [formData, setFormData] = useState<Finding | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const toast = useToast();
  const [cvssMetrics, setCvssMetrics] = useState<Record<string, string>>({});

  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const selectedBg = useColorModeValue('blue.50', 'blue.900');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  const RadioBox = ({ value, label, isChecked, onChange }: { 
    value: string; 
    label: string; 
    isChecked: boolean; 
    onChange: (value: string) => void;
  }) => (
    <Box
      as="label"
      cursor="pointer"
      borderWidth="1px"
      borderRadius="md"
      borderColor={isChecked ? 'blue.500' : borderColor}
      bg={isChecked ? selectedBg : 'transparent'}
      _hover={{ bg: hoverBg }}
      p={2}
      px={3}
      transition="all 0.2s"
    >
      <input
        type="radio"
        value={value}
        checked={isChecked}
        onChange={() => onChange(value)}
        style={{ display: 'none' }}
      />
      <Text fontSize="sm">{label}</Text>
    </Box>
  );

  useEffect(() => {
    if (finding) {
      const metrics = parseCVSSVector(finding.cvss_vector);
      setCvssMetrics(metrics);
      setFormData(finding);
      setIsDirty(false);
    }
  }, [finding]);

  const handleChange = (field: keyof Finding, value: any) => {
    if (!formData) return;
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    setIsDirty(true);
    onDirtyChange(true);
    onFormDataChange(newData);
  };

  const handleCVSSChange = (metric: string, value: string) => {
    setCvssMetrics(prev => {
      const updated = { ...prev, [metric]: value };
      if (formData) {
        const newData = { ...formData, cvss_vector: serializeCVSSVector(updated) };
        setFormData(newData);
        onDirtyChange(true);
        onFormDataChange(newData);
      }
      return updated;
    });
  };

  const handleSave = async () => {
    if (!formData) return;
    try {
      await onSave(formData);
      toast({
        title: "Finding saved",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      setIsDirty(false);
      onDirtyChange(false);
    } catch (error) {
      toast({
        title: "Error saving finding",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (!formData) {
    return null;
  }

  return (
    <Box as="form" onSubmit={handleSave}>
      <VStack spacing={4} align="stretch">
        <FormControl isRequired>
          <FormLabel>Title</FormLabel>
          <Input
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Severity</FormLabel>
          <Select
            value={formData.severity}
            onChange={(e) => handleChange('severity', e.target.value)}
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
            value={formData.cvss_score}
            onChange={(e) => handleChange('cvss_score', parseFloat(e.target.value))}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Summary</FormLabel>
          <Textarea
            value={formData.summary}
            onChange={(e) => handleChange('summary', e.target.value)}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Affected Assets</FormLabel>
          <Textarea
            value={formData.affected_assets.join('\n')}
            onChange={(e) => handleChange('affected_assets', e.target.value.split('\n'))}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Technical Details - Impact</FormLabel>
          <Textarea
            value={formData.technical_details.impact}
            onChange={(e) => handleChange('technical_details', {
              ...formData.technical_details,
              impact: e.target.value,
            })}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Technical Details - Testing Process</FormLabel>
          <Textarea
            value={formData.technical_details.testing_process}
            onChange={(e) => handleChange('technical_details', {
              ...formData.technical_details,
              testing_process: e.target.value,
            })}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Recommendations</FormLabel>
          <Textarea
            value={formData.recommendations.join('\n')}
            onChange={(e) => handleChange('recommendations', e.target.value.split('\n'))}
          />
        </FormControl>

        <FormControl>
          <FormLabel>References</FormLabel>
          <Textarea
            value={formData.references?.join('\n') || ''}
            onChange={(e) => handleChange('references', e.target.value.split('\n'))}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Status</FormLabel>
          <Select
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            <option value="unresolved">Unresolved</option>
            <option value="resolved">Resolved</option>
            <option value="accepted_risk">Accepted Risk</option>
            <option value="false_positive">False Positive</option>
          </Select>
        </FormControl>

        <HStack spacing={4}>
          <Button type="submit" colorScheme="blue">
            Save
          </Button>
          <Button onClick={() => findingId && onDelete(findingId)}>
            Delete
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default FindingDetail; 