import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Routes, Route, Link } from 'react-router-dom';
import {
  Box,
  VStack,
  Text,
  Flex,
  useColorModeValue,
  Button,
  Icon,
  Badge,
  HStack,
  useToast,
  IconButton,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';
import { Report, Finding, getReport, updateReport, getFindingsByReport, addFinding, deleteFinding, updateFinding } from '../utils/db';
import GeneralInformation from './report/GeneralInformation';
import FindingDetail from './report/FindingDetail';
import FindingSort from './report/FindingSort';

const ReportDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [report, setReport] = useState<Report | null>(null);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [selectedFindingId, setSelectedFindingId] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const { isOpen: isDeleteAlertOpen, onOpen: onDeleteAlertOpen, onClose: onDeleteAlertClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const [reportData, findingsData] = await Promise.all([
          getReport(id),
          getFindingsByReport(id)
        ]);
        
        if (reportData) {
          setReport(reportData);
          setFindings(findingsData);
        } else {
          toast({
            title: 'Error',
            description: 'Report not found',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          navigate('/');
        }
      } catch (error) {
        console.error('Failed to load data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load report data',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        navigate('/');
      }
    };

    loadData();
  }, [id, navigate, toast]);

  const handleSaveReport = async (updatedReport: Report) => {
    try {
      await updateReport(updatedReport);
      setReport(updatedReport);
      setIsDirty(false);
      toast({
        title: 'Success',
        description: 'Report saved successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Failed to save report:', error);
      toast({
        title: 'Error',
        description: 'Failed to save report',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSaveFinding = async (finding: Finding) => {
    try {
      if (finding.id) {
        await updateFinding(finding);
        setFindings(prev => prev.map(f => f.id === finding.id ? finding : f));
      } else {
        const newFinding = await addFinding(finding);
        setFindings(prev => [...prev, newFinding]);
        navigate(`/report/${id}/finding/${newFinding.id}`);
      }
      toast({
        title: 'Success',
        description: 'Finding saved successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setIsDirty(false);
    } catch (error) {
      console.error('Failed to save finding:', error);
      toast({
        title: 'Error',
        description: 'Failed to save finding',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteFinding = async (findingId: string) => {
    try {
      await deleteFinding(findingId);
      setFindings(prev => prev.filter(f => f.id !== findingId));
      if (selectedFindingId === findingId) {
        setSelectedFindingId(null);
        navigate(`/report/${id}`);
      }
      toast({
        title: 'Success',
        description: 'Finding deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Failed to delete finding:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete finding',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleNewFinding = async () => {
    if (!id) return;
    const newFinding: Omit<Finding, 'id'> = {
      reportId: id,
      title: '',
      type: 'Web',
      cvssScore: 0,
      description: '',
      recommendation: '',
      references: '',
      affectedAssets: '',
      stepsToReproduce: '',
      cvssVector: {
        attackVector: 'network',
        scope: 'unchanged',
        attackComplexity: 'low',
        privilegesRequired: 'none',
        userInteraction: 'none',
        confidentialityImpact: 'none',
        integrityImpact: 'none',
        availabilityImpact: 'none',
        exploitCodeMaturity: 'not-defined',
        remediationLevel: 'not-defined',
        reportConfidence: 'not-defined',
        confidentialityRequirement: 'not-defined',
        integrityRequirement: 'not-defined',
        availabilityRequirement: 'not-defined',
      },
      isCompleted: false,
    };
    try {
      const savedFinding = await addFinding(newFinding);
      setFindings(prev => [...prev, savedFinding]);
      navigate(`/report/${id}/finding/${savedFinding.id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create new finding',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (!report) {
    return null; // or a loading spinner
  }

  return (
    <Box pt="60px">
      <Flex h="calc(100vh - 60px)">
        {/* Left Sidebar */}
        <Box
          w="300px"
          borderRight="1px"
          borderColor={borderColor}
          bg={bgColor}
          p={4}
        >
          <VStack align="stretch" spacing={4}>
            <Button
              variant={selectedFindingId ? 'solid' : 'ghost'}
              justifyContent="flex-start"
              onClick={() => setSelectedFindingId(null)}
            >
              General Information
            </Button>
            <Box>
              <HStack justify="space-between" mb={2}>
                <Text fontWeight="bold">
                  Findings ({findings.length})
                </Text>
                <HStack>
                  <FindingSort
                    findings={findings}
                    onSort={setFindings}
                  />
                  <IconButton
                    aria-label="Add finding"
                    icon={<FiPlus />}
                    size="sm"
                    variant="ghost"
                    onClick={handleNewFinding}
                  />
                </HStack>
              </HStack>
              <VStack align="stretch" spacing={2}>
                {findings.map((finding) => (
                  <Button
                    key={finding.id}
                    variant={selectedFindingId === finding.id ? 'solid' : 'ghost'}
                    justifyContent="flex-start"
                    onClick={() => {
                      setSelectedFindingId(finding.id);
                    }}
                  >
                    <Flex justify="space-between" w="100%" align="center">
                      <Text>{finding.title}</Text>
                      <Badge colorScheme="red">{finding.cvssScore}</Badge>
                    </Flex>
                  </Button>
                ))}
              </VStack>
            </Box>
          </VStack>
        </Box>

        {/* Main Content */}
        <Box flex="1" p={6} overflowY="auto">
          <Routes>
            <Route path="/" element={
              <>
                <GeneralInformation 
                  report={report} 
                  onSave={handleSaveReport}
                  onDirtyChange={setIsDirty}
                />
                <Box>
                  <Flex justify="space-between" align="center" mb={4}>
                    <Text fontSize="xl" fontWeight="bold">Findings</Text>
                    <HStack>
                      <FindingSort findings={findings} onSort={setFindings} />
                      <IconButton
                        aria-label="Add finding"
                        icon={<FiPlus />}
                        onClick={handleNewFinding}
                      />
                    </HStack>
                  </Flex>
                  <VStack spacing={2} align="stretch">
                    {findings.map(finding => (
                      <Link key={finding.id} to={`/report/${id}/finding/${finding.id}`}>
                        <Box
                          p={4}
                          borderWidth={1}
                          borderRadius="md"
                          _hover={{ bg: 'gray.50' }}
                        >
                          <Text fontWeight="bold">{finding.title}</Text>
                          <Text color="gray.600">Type: {finding.type}</Text>
                          <Text color="gray.600">CVSS Score: {finding.cvssScore}</Text>
                        </Box>
                      </Link>
                    ))}
                  </VStack>
                </Box>
              </>
            } />
            <Route path="/finding/:findingId" element={
              <FindingDetail
                findingId={selectedFindingId}
                finding={findings.find(f => f.id === selectedFindingId)}
                onDelete={handleDeleteFinding}
                onSave={handleSaveFinding}
                onDirtyChange={setIsDirty}
              />
            } />
          </Routes>
        </Box>
      </Flex>
    </Box>
  );
};

export default ReportDetail; 