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
  Heading,
} from '@chakra-ui/react';
import { FiSave, FiPlus, FiTrash2, FiArrowLeft } from 'react-icons/fi';
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
  const [currentFormData, setCurrentFormData] = useState<Finding | Report | null>(null);
  const { isOpen: isDeleteAlertOpen, onOpen: onDeleteAlertOpen, onClose: onDeleteAlertClose } = useDisclosure();
  const { isOpen: isUnsavedChangesOpen, onOpen: onUnsavedChangesOpen, onClose: onUnsavedChangesClose } = useDisclosure();
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);
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

  const handleNavigation = (navigationAction: () => void) => {
    if (isDirty) {
      setPendingNavigation(() => navigationAction);
      onUnsavedChangesOpen();
    } else {
      navigationAction();
    }
  };

  const handleConfirmNavigation = () => {
    if (pendingNavigation) {
      setIsDirty(false);
      pendingNavigation();
      setPendingNavigation(null);
    }
    onUnsavedChangesClose();
  };

  const handleCancelNavigation = () => {
    setPendingNavigation(null);
    onUnsavedChangesClose();
  };

  const handleSaveAndNavigate = async () => {
    if (!currentFormData) return;

    try {
      if (selectedFindingId) {
        await handleSaveFinding(currentFormData as Finding);
      } else if (report) {
        await handleSaveReport(currentFormData as Report);
      }
      handleConfirmNavigation();
    } catch (error) {
      console.error('Failed to save:', error);
      toast({
        title: 'Error',
        description: 'Failed to save changes',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleNewFinding = () => {
    handleNavigation(async () => {
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
        setSelectedFindingId(savedFinding.id);
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
    });
  };

  const handleFindingClick = (findingId: string) => {
    if (selectedFindingId === findingId) return;
    handleNavigation(() => {
      setSelectedFindingId(findingId);
      navigate(`/report/${id}/finding/${findingId}`);
    });
  };

  const handleGeneralInfoClick = () => {
    if (!selectedFindingId) return;
    handleNavigation(() => {
      setSelectedFindingId(null);
      navigate(`/report/${id}`);
    });
  };

  if (!report) {
    return null;
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
              variant={!selectedFindingId ? 'solid' : 'ghost'}
              justifyContent="flex-start"
              onClick={handleGeneralInfoClick}
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
                    onClick={() => handleFindingClick(finding.id)}
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
              <GeneralInformation 
                report={report} 
                onSave={handleSaveReport}
                onDirtyChange={setIsDirty}
                onFormDataChange={setCurrentFormData}
              />
            } />
            <Route path="/finding/:findingId" element={
              <FindingDetail
                findingId={selectedFindingId}
                finding={findings.find(f => f.id === selectedFindingId)}
                onDelete={handleDeleteFinding}
                onSave={handleSaveFinding}
                onDirtyChange={setIsDirty}
                onFormDataChange={setCurrentFormData}
              />
            } />
          </Routes>
        </Box>
      </Flex>

      {/* Unsaved Changes Alert Dialog */}
      <AlertDialog
        isOpen={isUnsavedChangesOpen}
        leastDestructiveRef={cancelRef}
        onClose={handleCancelNavigation}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Unsaved Changes
            </AlertDialogHeader>

            <AlertDialogBody>
              You have unsaved changes. Would you like to save them before continuing?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={handleCancelNavigation}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleConfirmNavigation}
                ml={3}
              >
                Discard Changes
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleSaveAndNavigate}
                ml={3}
              >
                Save & Continue
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default ReportDetail; 