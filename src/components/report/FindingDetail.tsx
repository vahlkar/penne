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
  onDelete: (findingId: string) => Promise<void>;
  onSave: (finding: Finding) => Promise<void>;
  onDirtyChange: (isDirty: boolean) => void;
}

const FindingDetail: React.FC<FindingDetailProps> = ({ 
  findingId, 
  finding, 
  onDelete, 
  onSave,
  onDirtyChange 
}) => {
  const { isOpen: isTemporalOpen, onToggle: onTemporalToggle } = useDisclosure();
  const { isOpen: isEnvironmentalOpen, onToggle: onEnvironmentalToggle } = useDisclosure();
  const [formData, setFormData] = useState<Finding | null>(null);
  const toast = useToast();

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
      // Set default values for temporal and environmental metrics if not present
      const defaultCVSSVector = {
        ...finding.cvssVector,
        exploitCodeMaturity: finding.cvssVector.exploitCodeMaturity || 'not-defined',
        remediationLevel: finding.cvssVector.remediationLevel || 'not-defined',
        reportConfidence: finding.cvssVector.reportConfidence || 'not-defined',
        confidentialityRequirement: finding.cvssVector.confidentialityRequirement || 'not-defined',
        integrityRequirement: finding.cvssVector.integrityRequirement || 'not-defined',
        availabilityRequirement: finding.cvssVector.availabilityRequirement || 'not-defined',
      };
      setFormData({
        ...finding,
        cvssVector: defaultCVSSVector
      });
    }
  }, [finding]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      if (!prev) return null;
      const newData = {
        ...prev,
        [name]: value
      };
      onDirtyChange(true);
      return newData;
    });
  };

  const handleCVSSChange = (metric: string, value: string) => {
    setFormData(prev => {
      if (!prev) return null;
      const newData = {
        ...prev,
        cvssVector: {
          ...prev.cvssVector,
          [metric]: value
        }
      };
      onDirtyChange(true);
      return newData;
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
    <VStack spacing={6} align="stretch">
      <Flex justify="space-between" align="center">
        <HStack spacing={4}>
          <FormControl w="300px">
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Finding Title"
            />
          </FormControl>
          <FormControl w="200px">
            <Select
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="Web">Web</option>
              <option value="Mobile">Mobile</option>
              <option value="Network">Network</option>
              <option value="API">API</option>
            </Select>
          </FormControl>
        </HStack>
        <HStack spacing={2}>
          <Button
            leftIcon={<FiSave />}
            colorScheme="blue"
            onClick={handleSave}
          >
            Save
          </Button>
          <Button
            leftIcon={<FiTrash2 />}
            colorScheme="red"
            variant="outline"
            onClick={() => findingId && onDelete(findingId)}
          >
            Delete
          </Button>
        </HStack>
      </Flex>

      <Tabs variant="enclosed" w="100%">
        <TabList>
          <Tab>DEFINITION</Tab>
          <Tab>TECHNICAL DETAILS</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <VStack spacing={6} align="stretch">
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter finding description"
                  minH="200px"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Recommendation</FormLabel>
                <Textarea
                  name="recommendation"
                  value={formData.recommendation}
                  onChange={handleChange}
                  placeholder="Enter recommendation"
                  minH="200px"
                />
              </FormControl>

              <FormControl>
                <FormLabel>References</FormLabel>
                <Textarea
                  name="references"
                  value={formData.references}
                  onChange={handleChange}
                  placeholder="Enter references"
                />
              </FormControl>
            </VStack>
          </TabPanel>

          <TabPanel>
            <VStack spacing={6} align="stretch">
              <Box borderWidth={1} p={4} borderRadius="md">
                <Text fontWeight="bold" mb={4}>CVSS v3.1 Base Score</Text>
                <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                  <GridItem>
                    <FormControl>
                      <FormLabel fontWeight="bold">Attack Vector (AV)</FormLabel>
                      <RadioGroup
                        value={formData.cvssVector.attackVector}
                        onChange={(value) => handleCVSSChange('attackVector', value)}
                      >
                        <HStack spacing={2}>
                          <RadioBox
                            value="network"
                            label="Network (AV:N)"
                            isChecked={formData.cvssVector.attackVector === 'network'}
                            onChange={(value) => handleCVSSChange('attackVector', value)}
                          />
                          <RadioBox
                            value="adjacent"
                            label="Adjacent (AV:A)"
                            isChecked={formData.cvssVector.attackVector === 'adjacent'}
                            onChange={(value) => handleCVSSChange('attackVector', value)}
                          />
                          <RadioBox
                            value="local"
                            label="Local (AV:L)"
                            isChecked={formData.cvssVector.attackVector === 'local'}
                            onChange={(value) => handleCVSSChange('attackVector', value)}
                          />
                          <RadioBox
                            value="physical"
                            label="Physical (AV:P)"
                            isChecked={formData.cvssVector.attackVector === 'physical'}
                            onChange={(value) => handleCVSSChange('attackVector', value)}
                          />
                        </HStack>
                      </RadioGroup>
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl>
                      <FormLabel fontWeight="bold">Scope (S)</FormLabel>
                      <RadioGroup
                        value={formData.cvssVector.scope}
                        onChange={(value) => handleCVSSChange('scope', value)}
                      >
                        <HStack spacing={2}>
                          <RadioBox
                            value="unchanged"
                            label="Unchanged (S:U)"
                            isChecked={formData.cvssVector.scope === 'unchanged'}
                            onChange={(value) => handleCVSSChange('scope', value)}
                          />
                          <RadioBox
                            value="changed"
                            label="Changed (S:C)"
                            isChecked={formData.cvssVector.scope === 'changed'}
                            onChange={(value) => handleCVSSChange('scope', value)}
                          />
                        </HStack>
                      </RadioGroup>
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl>
                      <FormLabel fontWeight="bold">Attack Complexity (AC)</FormLabel>
                      <RadioGroup
                        value={formData.cvssVector.attackComplexity}
                        onChange={(value) => handleCVSSChange('attackComplexity', value)}
                      >
                        <HStack spacing={2}>
                          <RadioBox
                            value="low"
                            label="Low (AC:L)"
                            isChecked={formData.cvssVector.attackComplexity === 'low'}
                            onChange={(value) => handleCVSSChange('attackComplexity', value)}
                          />
                          <RadioBox
                            value="high"
                            label="High (AC:H)"
                            isChecked={formData.cvssVector.attackComplexity === 'high'}
                            onChange={(value) => handleCVSSChange('attackComplexity', value)}
                          />
                        </HStack>
                      </RadioGroup>
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl>
                      <FormLabel fontWeight="bold">Privileges Required (PR)</FormLabel>
                      <RadioGroup
                        value={formData.cvssVector.privilegesRequired}
                        onChange={(value) => handleCVSSChange('privilegesRequired', value)}
                      >
                        <HStack spacing={2}>
                          <RadioBox
                            value="none"
                            label="None (PR:N)"
                            isChecked={formData.cvssVector.privilegesRequired === 'none'}
                            onChange={(value) => handleCVSSChange('privilegesRequired', value)}
                          />
                          <RadioBox
                            value="low"
                            label="Low (PR:L)"
                            isChecked={formData.cvssVector.privilegesRequired === 'low'}
                            onChange={(value) => handleCVSSChange('privilegesRequired', value)}
                          />
                          <RadioBox
                            value="high"
                            label="High (PR:H)"
                            isChecked={formData.cvssVector.privilegesRequired === 'high'}
                            onChange={(value) => handleCVSSChange('privilegesRequired', value)}
                          />
                        </HStack>
                      </RadioGroup>
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl>
                      <FormLabel fontWeight="bold">User Interaction (UI)</FormLabel>
                      <RadioGroup
                        value={formData.cvssVector.userInteraction}
                        onChange={(value) => handleCVSSChange('userInteraction', value)}
                      >
                        <HStack spacing={2}>
                          <RadioBox
                            value="none"
                            label="None (UI:N)"
                            isChecked={formData.cvssVector.userInteraction === 'none'}
                            onChange={(value) => handleCVSSChange('userInteraction', value)}
                          />
                          <RadioBox
                            value="required"
                            label="Required (UI:R)"
                            isChecked={formData.cvssVector.userInteraction === 'required'}
                            onChange={(value) => handleCVSSChange('userInteraction', value)}
                          />
                        </HStack>
                      </RadioGroup>
                    </FormControl>
                  </GridItem>
                </Grid>

                <Divider my={4} />

                <Text fontWeight="bold" mb={4}>Impact Metrics</Text>
                <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                  <GridItem>
                    <FormControl>
                      <FormLabel fontWeight="bold">Confidentiality Impact (C)</FormLabel>
                      <RadioGroup
                        value={formData.cvssVector.confidentialityImpact}
                        onChange={(value) => handleCVSSChange('confidentialityImpact', value)}
                      >
                        <HStack spacing={2}>
                          <RadioBox
                            value="none"
                            label="None (C:N)"
                            isChecked={formData.cvssVector.confidentialityImpact === 'none'}
                            onChange={(value) => handleCVSSChange('confidentialityImpact', value)}
                          />
                          <RadioBox
                            value="low"
                            label="Low (C:L)"
                            isChecked={formData.cvssVector.confidentialityImpact === 'low'}
                            onChange={(value) => handleCVSSChange('confidentialityImpact', value)}
                          />
                          <RadioBox
                            value="high"
                            label="High (C:H)"
                            isChecked={formData.cvssVector.confidentialityImpact === 'high'}
                            onChange={(value) => handleCVSSChange('confidentialityImpact', value)}
                          />
                        </HStack>
                      </RadioGroup>
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl>
                      <FormLabel fontWeight="bold">Integrity Impact (I)</FormLabel>
                      <RadioGroup
                        value={formData.cvssVector.integrityImpact}
                        onChange={(value) => handleCVSSChange('integrityImpact', value)}
                      >
                        <HStack spacing={2}>
                          <RadioBox
                            value="none"
                            label="None (I:N)"
                            isChecked={formData.cvssVector.integrityImpact === 'none'}
                            onChange={(value) => handleCVSSChange('integrityImpact', value)}
                          />
                          <RadioBox
                            value="low"
                            label="Low (I:L)"
                            isChecked={formData.cvssVector.integrityImpact === 'low'}
                            onChange={(value) => handleCVSSChange('integrityImpact', value)}
                          />
                          <RadioBox
                            value="high"
                            label="High (I:H)"
                            isChecked={formData.cvssVector.integrityImpact === 'high'}
                            onChange={(value) => handleCVSSChange('integrityImpact', value)}
                          />
                        </HStack>
                      </RadioGroup>
                    </FormControl>
                  </GridItem>
                  <GridItem>
                    <FormControl>
                      <FormLabel fontWeight="bold">Availability Impact (A)</FormLabel>
                      <RadioGroup
                        value={formData.cvssVector.availabilityImpact}
                        onChange={(value) => handleCVSSChange('availabilityImpact', value)}
                      >
                        <HStack spacing={2}>
                          <RadioBox
                            value="none"
                            label="None (A:N)"
                            isChecked={formData.cvssVector.availabilityImpact === 'none'}
                            onChange={(value) => handleCVSSChange('availabilityImpact', value)}
                          />
                          <RadioBox
                            value="low"
                            label="Low (A:L)"
                            isChecked={formData.cvssVector.availabilityImpact === 'low'}
                            onChange={(value) => handleCVSSChange('availabilityImpact', value)}
                          />
                          <RadioBox
                            value="high"
                            label="High (A:H)"
                            isChecked={formData.cvssVector.availabilityImpact === 'high'}
                            onChange={(value) => handleCVSSChange('availabilityImpact', value)}
                          />
                        </HStack>
                      </RadioGroup>
                    </FormControl>
                  </GridItem>
                </Grid>

                <Divider my={4} />

                <Box>
                  <Button
                    variant="ghost"
                    onClick={onEnvironmentalToggle}
                    mb={4}
                    leftIcon={<Icon as={isEnvironmentalOpen ? FiChevronDown : FiChevronRight} />}
                  >
                    Environmental Score Metrics
                  </Button>
                  <Collapse in={isEnvironmentalOpen}>
                    <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                      <GridItem>
                        <FormControl>
                          <FormLabel fontWeight="bold">Confidentiality Requirement (CR)</FormLabel>
                          <RadioGroup
                            value={formData.cvssVector.confidentialityRequirement}
                            onChange={(value) => handleCVSSChange('confidentialityRequirement', value)}
                          >
                            <HStack spacing={2}>
                              <RadioBox
                                value="not-defined"
                                label="Not Defined (CR:X)"
                                isChecked={formData.cvssVector.confidentialityRequirement === 'not-defined'}
                                onChange={(value) => handleCVSSChange('confidentialityRequirement', value)}
                              />
                              <RadioBox
                                value="low"
                                label="Low (CR:L)"
                                isChecked={formData.cvssVector.confidentialityRequirement === 'low'}
                                onChange={(value) => handleCVSSChange('confidentialityRequirement', value)}
                              />
                              <RadioBox
                                value="medium"
                                label="Medium (CR:M)"
                                isChecked={formData.cvssVector.confidentialityRequirement === 'medium'}
                                onChange={(value) => handleCVSSChange('confidentialityRequirement', value)}
                              />
                              <RadioBox
                                value="high"
                                label="High (CR:H)"
                                isChecked={formData.cvssVector.confidentialityRequirement === 'high'}
                                onChange={(value) => handleCVSSChange('confidentialityRequirement', value)}
                              />
                            </HStack>
                          </RadioGroup>
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl>
                          <FormLabel fontWeight="bold">Integrity Requirement (IR)</FormLabel>
                          <RadioGroup
                            value={formData.cvssVector.integrityRequirement}
                            onChange={(value) => handleCVSSChange('integrityRequirement', value)}
                          >
                            <HStack spacing={2}>
                              <RadioBox
                                value="not-defined"
                                label="Not Defined (IR:X)"
                                isChecked={formData.cvssVector.integrityRequirement === 'not-defined'}
                                onChange={(value) => handleCVSSChange('integrityRequirement', value)}
                              />
                              <RadioBox
                                value="low"
                                label="Low (IR:L)"
                                isChecked={formData.cvssVector.integrityRequirement === 'low'}
                                onChange={(value) => handleCVSSChange('integrityRequirement', value)}
                              />
                              <RadioBox
                                value="medium"
                                label="Medium (IR:M)"
                                isChecked={formData.cvssVector.integrityRequirement === 'medium'}
                                onChange={(value) => handleCVSSChange('integrityRequirement', value)}
                              />
                              <RadioBox
                                value="high"
                                label="High (IR:H)"
                                isChecked={formData.cvssVector.integrityRequirement === 'high'}
                                onChange={(value) => handleCVSSChange('integrityRequirement', value)}
                              />
                            </HStack>
                          </RadioGroup>
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl>
                          <FormLabel fontWeight="bold">Availability Requirement (AR)</FormLabel>
                          <RadioGroup
                            value={formData.cvssVector.availabilityRequirement}
                            onChange={(value) => handleCVSSChange('availabilityRequirement', value)}
                          >
                            <HStack spacing={2}>
                              <RadioBox
                                value="not-defined"
                                label="Not Defined (AR:X)"
                                isChecked={formData.cvssVector.availabilityRequirement === 'not-defined'}
                                onChange={(value) => handleCVSSChange('availabilityRequirement', value)}
                              />
                              <RadioBox
                                value="low"
                                label="Low (AR:L)"
                                isChecked={formData.cvssVector.availabilityRequirement === 'low'}
                                onChange={(value) => handleCVSSChange('availabilityRequirement', value)}
                              />
                              <RadioBox
                                value="medium"
                                label="Medium (AR:M)"
                                isChecked={formData.cvssVector.availabilityRequirement === 'medium'}
                                onChange={(value) => handleCVSSChange('availabilityRequirement', value)}
                              />
                              <RadioBox
                                value="high"
                                label="High (AR:H)"
                                isChecked={formData.cvssVector.availabilityRequirement === 'high'}
                                onChange={(value) => handleCVSSChange('availabilityRequirement', value)}
                              />
                            </HStack>
                          </RadioGroup>
                        </FormControl>
                      </GridItem>
                    </Grid>
                  </Collapse>
                </Box>

                <Divider my={4} />

                <Box>
                  <Button
                    variant="ghost"
                    onClick={onTemporalToggle}
                    mb={4}
                    leftIcon={<Icon as={isTemporalOpen ? FiChevronDown : FiChevronRight} />}
                  >
                    Temporal Score Metrics
                  </Button>
                  <Collapse in={isTemporalOpen}>
                    <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                      <GridItem>
                        <FormControl>
                          <FormLabel fontWeight="bold">Exploit Code Maturity (E)</FormLabel>
                          <RadioGroup
                            value={formData.cvssVector.exploitCodeMaturity}
                            onChange={(value) => handleCVSSChange('exploitCodeMaturity', value)}
                          >
                            <HStack spacing={2}>
                              <RadioBox
                                value="not-defined"
                                label="Not Defined (E:X)"
                                isChecked={formData.cvssVector.exploitCodeMaturity === 'not-defined'}
                                onChange={(value) => handleCVSSChange('exploitCodeMaturity', value)}
                              />
                              <RadioBox
                                value="unproven"
                                label="Unproven (E:U)"
                                isChecked={formData.cvssVector.exploitCodeMaturity === 'unproven'}
                                onChange={(value) => handleCVSSChange('exploitCodeMaturity', value)}
                              />
                              <RadioBox
                                value="proof-of-concept"
                                label="POC (E:P)"
                                isChecked={formData.cvssVector.exploitCodeMaturity === 'proof-of-concept'}
                                onChange={(value) => handleCVSSChange('exploitCodeMaturity', value)}
                              />
                              <RadioBox
                                value="functional"
                                label="Functional (E:F)"
                                isChecked={formData.cvssVector.exploitCodeMaturity === 'functional'}
                                onChange={(value) => handleCVSSChange('exploitCodeMaturity', value)}
                              />
                              <RadioBox
                                value="high"
                                label="High (E:H)"
                                isChecked={formData.cvssVector.exploitCodeMaturity === 'high'}
                                onChange={(value) => handleCVSSChange('exploitCodeMaturity', value)}
                              />
                            </HStack>
                          </RadioGroup>
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl>
                          <FormLabel fontWeight="bold">Remediation Level (RL)</FormLabel>
                          <RadioGroup
                            value={formData.cvssVector.remediationLevel}
                            onChange={(value) => handleCVSSChange('remediationLevel', value)}
                          >
                            <HStack spacing={2}>
                              <RadioBox
                                value="not-defined"
                                label="Not Defined (RL:X)"
                                isChecked={formData.cvssVector.remediationLevel === 'not-defined'}
                                onChange={(value) => handleCVSSChange('remediationLevel', value)}
                              />
                              <RadioBox
                                value="official-fix"
                                label="Official (RL:O)"
                                isChecked={formData.cvssVector.remediationLevel === 'official-fix'}
                                onChange={(value) => handleCVSSChange('remediationLevel', value)}
                              />
                              <RadioBox
                                value="temporary-fix"
                                label="Temporary (RL:T)"
                                isChecked={formData.cvssVector.remediationLevel === 'temporary-fix'}
                                onChange={(value) => handleCVSSChange('remediationLevel', value)}
                              />
                              <RadioBox
                                value="workaround"
                                label="Workaround (RL:W)"
                                isChecked={formData.cvssVector.remediationLevel === 'workaround'}
                                onChange={(value) => handleCVSSChange('remediationLevel', value)}
                              />
                              <RadioBox
                                value="unavailable"
                                label="Unavailable (RL:U)"
                                isChecked={formData.cvssVector.remediationLevel === 'unavailable'}
                                onChange={(value) => handleCVSSChange('remediationLevel', value)}
                              />
                            </HStack>
                          </RadioGroup>
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl>
                          <FormLabel fontWeight="bold">Report Confidence (RC)</FormLabel>
                          <RadioGroup
                            value={formData.cvssVector.reportConfidence}
                            onChange={(value) => handleCVSSChange('reportConfidence', value)}
                          >
                            <HStack spacing={2}>
                              <RadioBox
                                value="not-defined"
                                label="Not Defined (RC:X)"
                                isChecked={formData.cvssVector.reportConfidence === 'not-defined'}
                                onChange={(value) => handleCVSSChange('reportConfidence', value)}
                              />
                              <RadioBox
                                value="unknown"
                                label="Unknown (RC:U)"
                                isChecked={formData.cvssVector.reportConfidence === 'unknown'}
                                onChange={(value) => handleCVSSChange('reportConfidence', value)}
                              />
                              <RadioBox
                                value="reasonable"
                                label="Reasonable (RC:R)"
                                isChecked={formData.cvssVector.reportConfidence === 'reasonable'}
                                onChange={(value) => handleCVSSChange('reportConfidence', value)}
                              />
                              <RadioBox
                                value="confirmed"
                                label="Confirmed (RC:C)"
                                isChecked={formData.cvssVector.reportConfidence === 'confirmed'}
                                onChange={(value) => handleCVSSChange('reportConfidence', value)}
                              />
                            </HStack>
                          </RadioGroup>
                        </FormControl>
                      </GridItem>
                    </Grid>
                  </Collapse>
                </Box>
              </Box>

              <FormControl>
                <FormLabel>Affected Assets</FormLabel>
                <Textarea
                  name="affectedAssets"
                  value={formData.affectedAssets}
                  onChange={handleChange}
                  placeholder="Enter affected assets"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Steps to Reproduce</FormLabel>
                <Textarea
                  name="stepsToReproduce"
                  value={formData.stepsToReproduce}
                  onChange={handleChange}
                  placeholder="Enter steps to reproduce"
                  minH="200px"
                />
              </FormControl>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
};

export default FindingDetail; 