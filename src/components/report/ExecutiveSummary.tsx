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
} from '@chakra-ui/react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { Report } from '../../utils/db';

type RiskRating = 'low' | 'medium' | 'high' | 'critical';

interface ExecutiveSummaryProps {
  report: Report;
  onSave: (report: Report) => Promise<void>;
  onDirtyChange: (isDirty: boolean) => void;
  onFormDataChange: (data: Report) => void;
}

const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({
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

  const handleChange = (field: string, value: string | RiskRating) => {
    const newData: Report = {
      ...formData,
      executive_summary: {
        ...formData.executive_summary,
        [field]: value,
      },
    };
    setFormData(newData);
    onFormDataChange(newData);
    onDirtyChange(true);
  };

  const handleArrayChange = (field: 'strengths' | 'challenges' | 'strategic_recommendations', index: number, value: string) => {
    const newArray = [...formData.executive_summary[field]];
    newArray[index] = value;
    const newData: Report = {
      ...formData,
      executive_summary: {
        ...formData.executive_summary,
        [field]: newArray,
      },
    };
    setFormData(newData);
    onFormDataChange(newData);
    onDirtyChange(true);
  };

  const addArrayItem = (field: 'strengths' | 'challenges' | 'strategic_recommendations') => {
    const newArray = [...formData.executive_summary[field], ''];
    const newData: Report = {
      ...formData,
      executive_summary: {
        ...formData.executive_summary,
        [field]: newArray,
      },
    };
    setFormData(newData);
    onFormDataChange(newData);
    onDirtyChange(true);
  };

  const removeArrayItem = (field: 'strengths' | 'challenges' | 'strategic_recommendations', index: number) => {
    const newArray = formData.executive_summary[field].filter((_, i) => i !== index);
    const newData: Report = {
      ...formData,
      executive_summary: {
        ...formData.executive_summary,
        [field]: newArray,
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
        description: 'Executive summary saved successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save executive summary',
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
          <FormLabel>Risk Rating</FormLabel>
          <Select
            value={formData.executive_summary.risk_rating}
            onChange={(e) => handleChange('risk_rating', e.target.value as RiskRating)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Business Impact</FormLabel>
          <Textarea
            value={formData.executive_summary.business_impact}
            onChange={(e) => handleChange('business_impact', e.target.value)}
            placeholder="Describe the potential business impact of the findings"
          />
        </FormControl>

        <Box>
          <HStack justify="space-between" mb={4}>
            <Text fontWeight="bold">Strengths</Text>
            <Button leftIcon={<FiPlus />} size="sm" onClick={() => addArrayItem('strengths')}>
              Add Strength
            </Button>
          </HStack>
          <VStack spacing={4}>
            {formData.executive_summary.strengths.map((strength, index) => (
              <HStack key={index} spacing={4} align="start">
                <FormControl isRequired>
                  <Input
                    value={strength}
                    onChange={(e) => handleArrayChange('strengths', index, e.target.value)}
                    placeholder="Enter a strength"
                  />
                </FormControl>
                <IconButton
                  aria-label="Remove strength"
                  icon={<FiTrash2 />}
                  onClick={() => removeArrayItem('strengths', index)}
                />
              </HStack>
            ))}
          </VStack>
        </Box>

        <Box>
          <HStack justify="space-between" mb={4}>
            <Text fontWeight="bold">Challenges</Text>
            <Button leftIcon={<FiPlus />} size="sm" onClick={() => addArrayItem('challenges')}>
              Add Challenge
            </Button>
          </HStack>
          <VStack spacing={4}>
            {formData.executive_summary.challenges.map((challenge, index) => (
              <HStack key={index} spacing={4} align="start">
                <FormControl isRequired>
                  <Input
                    value={challenge}
                    onChange={(e) => handleArrayChange('challenges', index, e.target.value)}
                    placeholder="Enter a challenge"
                  />
                </FormControl>
                <IconButton
                  aria-label="Remove challenge"
                  icon={<FiTrash2 />}
                  onClick={() => removeArrayItem('challenges', index)}
                />
              </HStack>
            ))}
          </VStack>
        </Box>

        <Box>
          <HStack justify="space-between" mb={4}>
            <Text fontWeight="bold">Strategic Recommendations</Text>
            <Button leftIcon={<FiPlus />} size="sm" onClick={() => addArrayItem('strategic_recommendations')}>
              Add Recommendation
            </Button>
          </HStack>
          <VStack spacing={4}>
            {formData.executive_summary.strategic_recommendations.map((recommendation, index) => (
              <HStack key={index} spacing={4} align="start">
                <FormControl isRequired>
                  <Input
                    value={recommendation}
                    onChange={(e) => handleArrayChange('strategic_recommendations', index, e.target.value)}
                    placeholder="Enter a strategic recommendation"
                  />
                </FormControl>
                <IconButton
                  aria-label="Remove recommendation"
                  icon={<FiTrash2 />}
                  onClick={() => removeArrayItem('strategic_recommendations', index)}
                />
              </HStack>
            ))}
          </VStack>
        </Box>

        <Button colorScheme="blue" onClick={handleSubmit}>
          Save Changes
        </Button>
      </VStack>
    </Box>
  );
};

export default ExecutiveSummary; 