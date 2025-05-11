import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Flex,
  Select,
  Text,
  HStack,
  useToast,
} from '@chakra-ui/react';
import { SearchIcon, AddIcon, EditIcon, DownloadIcon, DeleteIcon, ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import NewReportModal from './NewReportModal';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import { Report, initDB, addReport, getAllReports, deleteReport } from '../utils/db';

const Reports: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [reportToDelete, setReportToDelete] = useState<Report | null>(null);
  const toast = useToast();

  useEffect(() => {
    const setupDB = async () => {
      try {
        await initDB();
        const allReports = await getAllReports();
        setReports(allReports);
      } catch (error) {
        console.error('Failed to initialize database:', error);
        toast({
          title: 'Error',
          description: 'Failed to load reports',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    setupDB();
  }, [toast]);

  const handleNewReport = async (data: { name: string; assessmentType: string; tester: string }) => {
    try {
      const newReport = await addReport(data);
      setReports((prev) => [...prev, newReport]);
      toast({
        title: 'Success',
        description: 'New report created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Failed to create report:', error);
      toast({
        title: 'Error',
        description: 'Failed to create report',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteClick = (report: Report) => {
    setReportToDelete(report);
  };

  const handleDeleteConfirm = async () => {
    if (!reportToDelete) return;

    try {
      await deleteReport(reportToDelete.id);
      setReports((prev) => prev.filter((report) => report.id !== reportToDelete.id));
      toast({
        title: 'Success',
        description: 'Report deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Failed to delete report:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete report',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setReportToDelete(null);
    }
  };

  const handleEditClick = (reportId: string) => {
    navigate(`/report/${reportId}`);
  };

  return (
    <Container maxW="container.xl" pt={20}>
      {/* Top Bar */}
      <Flex justify="space-between" mb={6}>
        <InputGroup maxW="400px">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input placeholder="Search reports..." />
        </InputGroup>
        <Button leftIcon={<AddIcon />} colorScheme="green" onClick={() => setIsModalOpen(true)}>
          New Penetration Test
        </Button>
      </Flex>

      {/* Table */}
      <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>
                <Flex align="center">
                  Name
                  <IconButton
                    aria-label="Sort by name"
                    icon={<ChevronUpIcon />}
                    size="xs"
                    variant="ghost"
                    ml={2}
                  />
                </Flex>
                <Input size="sm" mt={2} placeholder="Filter name..." />
              </Th>
              <Th>
                <Flex align="center">
                  Assessment Type
                  <IconButton
                    aria-label="Sort by type"
                    icon={<ChevronUpIcon />}
                    size="xs"
                    variant="ghost"
                    ml={2}
                  />
                </Flex>
                <Input size="sm" mt={2} placeholder="Filter type..." />
              </Th>
              <Th>
                <Flex align="center">
                  Tester
                  <IconButton
                    aria-label="Sort by tester"
                    icon={<ChevronUpIcon />}
                    size="xs"
                    variant="ghost"
                    ml={2}
                  />
                </Flex>
                <Input size="sm" mt={2} placeholder="Filter tester..." />
              </Th>
              <Th>
                <Flex align="center">
                  Date
                  <IconButton
                    aria-label="Sort by date"
                    icon={<ChevronUpIcon />}
                    size="xs"
                    variant="ghost"
                    ml={2}
                  />
                </Flex>
                <Input size="sm" mt={2} placeholder="Filter date..." />
              </Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {reports.map((report) => (
              <Tr key={report.id}>
                <Td>{report.name}</Td>
                <Td>{report.assessmentType}</Td>
                <Td>{report.tester}</Td>
                <Td>{report.date}</Td>
                <Td>
                  <HStack spacing={2}>
                    <IconButton
                      aria-label="Edit report"
                      icon={<EditIcon />}
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditClick(report.id)}
                    />
                    <IconButton
                      aria-label="Download report"
                      icon={<DownloadIcon />}
                      size="sm"
                      variant="ghost"
                    />
                    <IconButton
                      aria-label="Delete report"
                      icon={<DeleteIcon />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => handleDeleteClick(report)}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Footer */}
      <Flex justify="space-between" align="center" mt={4}>
        <Text>Showing {reports.length} of {reports.length} entries</Text>
        <HStack spacing={4}>
          <Text>Results per page:</Text>
          <Select w="70px" size="sm">
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </Select>
          <HStack>
            <IconButton
              aria-label="Previous page"
              icon={<ChevronUpIcon />}
              size="sm"
              variant="ghost"
              isDisabled
            />
            <Text>1 / 1</Text>
            <IconButton
              aria-label="Next page"
              icon={<ChevronDownIcon />}
              size="sm"
              variant="ghost"
              isDisabled
            />
          </HStack>
        </HStack>
      </Flex>

      <NewReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleNewReport}
      />

      <DeleteConfirmationDialog
        isOpen={!!reportToDelete}
        onClose={() => setReportToDelete(null)}
        onConfirm={handleDeleteConfirm}
        reportName={reportToDelete?.name || ''}
      />
    </Container>
  );
};

export default Reports; 