import React, { useState, useEffect } from 'react';
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
} from '@chakra-ui/react';
import { FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useParams, useNavigate } from 'react-router-dom';
import GeneralInformation from './report/GeneralInformation';
import FindingDetail from './report/FindingDetail';
import FindingSort from './report/FindingSort';
import { Report, Finding, getReport, updateReport, getFindingsByReport, addFinding, deleteFinding, updateFinding } from '../utils/db';

const ReportDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [report, setReport] = useState<Report | null>(null);
  const [activeSection, setActiveSection] = useState<'general' | 'finding'>('general');
  const [selectedFinding, setSelectedFinding] = useState<string | null>(null);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [sortBy, setSortBy] = useState('cvss');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [autoSort, setAutoSort] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
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

  const handleSaveFinding = async (updatedFinding: Finding) => {
    try {
      await updateFinding(updatedFinding);
      setFindings(prev => prev.map(f => f.id === updatedFinding.id ? updatedFinding : f));
      setIsDirty(false);
      toast({
        title: 'Success',
        description: 'Finding saved successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
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

  const handleAddFinding = async () => {
    if (!id) return;
    try {
      const newFinding = await addFinding({
        reportId: id,
        title: 'New Finding',
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
        },
        isCompleted: false,
      });
      setFindings(prev => [...prev, newFinding]);
      setSelectedFinding(newFinding.id);
      setActiveSection('finding');
      toast({
        title: 'Success',
        description: 'New finding added',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Failed to add finding:', error);
      toast({
        title: 'Error',
        description: 'Failed to add finding',
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
      if (selectedFinding === findingId) {
        setSelectedFinding(null);
        setActiveSection('general');
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

  const handleSave = async () => {
    if (activeSection === 'general' && report) {
      await handleSaveReport(report);
    } else if (activeSection === 'finding' && selectedFinding) {
      const finding = findings.find(f => f.id === selectedFinding);
      if (finding) {
        await handleSaveFinding(finding);
      }
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteAlertOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedFinding) {
      await handleDeleteFinding(selectedFinding);
      setIsDeleteAlertOpen(false);
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
              variant={activeSection === 'general' ? 'solid' : 'ghost'}
              justifyContent="flex-start"
              onClick={() => setActiveSection('general')}
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
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    sortDirection={sortDirection}
                    setSortDirection={setSortDirection}
                    autoSort={autoSort}
                    setAutoSort={setAutoSort}
                  />
                  <IconButton
                    aria-label="Add finding"
                    icon={<FiPlus />}
                    size="sm"
                    variant="ghost"
                    onClick={handleAddFinding}
                  />
                </HStack>
              </HStack>
              <VStack align="stretch" spacing={2}>
                {findings.map((finding) => (
                  <Button
                    key={finding.id}
                    variant={selectedFinding === finding.id ? 'solid' : 'ghost'}
                    justifyContent="flex-start"
                    onClick={() => {
                      setSelectedFinding(finding.id);
                      setActiveSection('finding');
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
          <Flex justify="flex-end" mb={4}>
            <HStack spacing={4}>
              {activeSection === 'finding' && (
                <>
                  <Button colorScheme="orange">
                    Propose Creation/Update
                  </Button>
                  <Button
                    leftIcon={<Icon as={FiTrash2} />}
                    colorScheme="red"
                    onClick={handleDeleteClick}
                  >
                    Delete
                  </Button>
                </>
              )}
              <Button
                leftIcon={<Icon as={FiSave} />}
                colorScheme="blue"
                size="md"
                onClick={handleSave}
                isDisabled={!isDirty}
              >
                Save (ctrl+s)
              </Button>
            </HStack>
          </Flex>
          
          {/* Add AlertDialog for delete confirmation */}
          <AlertDialog
            isOpen={isDeleteAlertOpen}
            leastDestructiveRef={cancelRef}
            onClose={() => setIsDeleteAlertOpen(false)}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Delete Finding
                </AlertDialogHeader>

                <AlertDialogBody>
                  Are you sure you want to delete this finding? This action cannot be undone.
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={() => setIsDeleteAlertOpen(false)}>
                    Cancel
                  </Button>
                  <Button colorScheme="red" onClick={handleDeleteConfirm} ml={3}>
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
          
          {activeSection === 'general' ? (
            <GeneralInformation 
              report={report} 
              onSave={handleSaveReport}
              onDirtyChange={setIsDirty}
            />
          ) : (
            <FindingDetail
              findingId={selectedFinding}
              finding={findings.find(f => f.id === selectedFinding)}
              onDelete={handleDeleteFinding}
              onSave={handleSaveFinding}
              onDirtyChange={setIsDirty}
            />
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default ReportDetail; 