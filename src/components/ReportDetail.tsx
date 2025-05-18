import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Routes, Route } from 'react-router-dom';
import {
  Box,
  VStack,
  Text,
  Flex,
  useColorModeValue,
  Button,
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
import { FiPlus, FiArrowLeft } from 'react-icons/fi';
import { Report, getReport, updateReport, Finding } from '../utils/db';

// Import section components
import ReportMetadata from './report/ReportMetadata';
import Scope from './report/Scope';
import ExecutiveSummary from './report/ExecutiveSummary';
import { Findings } from './report/Findings';
import Artefacts from './report/Artefacts';

const ReportDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [report, setReport] = useState<Report | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [currentFormData, setCurrentFormData] = useState<Report | null>(null);
  const { isOpen: isUnsavedChangesOpen, onOpen: onUnsavedChangesOpen, onClose: onUnsavedChangesClose } = useDisclosure();
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const reportData = await getReport(id);
        if (reportData) {
          setReport(reportData);
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
      await handleSaveReport(currentFormData);
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
              leftIcon={<FiArrowLeft />}
              variant="ghost"
              onClick={() => handleNavigation(() => navigate('/'))}
            >
              Back to Reports
            </Button>
            <Text fontWeight="bold" fontSize="lg">
              {report.report_metadata.engagement_name}
            </Text>
            <VStack align="stretch" spacing={2}>
              <Button
                variant="ghost"
                justifyContent="flex-start"
                onClick={() => handleNavigation(() => navigate(`/report/${id}/metadata`))}
              >
                Report Metadata
              </Button>
              <Button
                variant="ghost"
                justifyContent="flex-start"
                onClick={() => handleNavigation(() => navigate(`/report/${id}/scope`))}
              >
                Scope
              </Button>
              <Button
                variant="ghost"
                justifyContent="flex-start"
                onClick={() => handleNavigation(() => navigate(`/report/${id}/executive-summary`))}
              >
                Executive Summary
              </Button>
              <Button
                variant="ghost"
                justifyContent="flex-start"
                onClick={() => handleNavigation(() => navigate(`/report/${id}/findings`))}
              >
                Findings
                <Badge ml={2} colorScheme="red">
                  {report.findings.length}
                </Badge>
              </Button>
              <Button
                variant="ghost"
                justifyContent="flex-start"
                onClick={() => handleNavigation(() => navigate(`/report/${id}/artefacts`))}
              >
                Artefacts
              </Button>
            </VStack>
          </VStack>
        </Box>

        {/* Main Content */}
        <Box flex="1" p={6} overflowY="auto">
          <Routes>
            <Route path="/metadata" element={
              <ReportMetadata 
                report={report} 
                onSave={handleSaveReport}
                onDirtyChange={setIsDirty}
                onFormDataChange={setCurrentFormData}
              />
            } />
            <Route path="/scope" element={
              <Scope 
                report={report} 
                onSave={handleSaveReport}
                onDirtyChange={setIsDirty}
                onFormDataChange={setCurrentFormData}
              />
            } />
            <Route path="/executive-summary" element={
              <ExecutiveSummary 
                report={report} 
                onSave={handleSaveReport}
                onDirtyChange={setIsDirty}
                onFormDataChange={setCurrentFormData}
              />
            } />
            <Route path="/findings" element={
              <Findings
                findings={report.findings}
                onFindingsChange={(newFindings: Finding[]) => {
                  const updatedReport = { ...report, findings: newFindings };
                  setIsDirty(true);
                  setCurrentFormData(updatedReport);
                }}
                onSave={async (newFindings: Finding[]) => {
                  const updatedReport = { ...report, findings: newFindings };
                  await handleSaveReport(updatedReport);
                }}
                onDirtyChange={setIsDirty}
              />
            } />
            <Route path="/artefacts" element={
              <Artefacts 
                report={report} 
                onSave={handleSaveReport}
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