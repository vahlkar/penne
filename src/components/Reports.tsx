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
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [reportToDelete, setReportToDelete] = useState<Report | null>(null);
  const toast = useToast();

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [testerFilter, setTesterFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [sortField, setSortField] = useState<string>('date_generated');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const setupDB = async () => {
      try {
        await initDB();
        const allReports = await getAllReports();
        setReports(allReports);
        setFilteredReports(allReports);
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

  // Filter and sort reports whenever filters or sort options change
  useEffect(() => {
    let result = [...reports];

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(report => 
        report.report_metadata.client_name.toLowerCase().includes(query) ||
        report.report_metadata.engagement_name.toLowerCase().includes(query) ||
        report.report_metadata.date_generated.toLowerCase().includes(query)
      );
    }

    // Apply individual filters
    if (nameFilter) {
      result = result.filter(report => 
        report.report_metadata.client_name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }
    if (typeFilter) {
      result = result.filter(report => 
        report.report_metadata.engagement_name.toLowerCase().includes(typeFilter.toLowerCase())
      );
    }
    if (testerFilter) {
      result = result.filter(report => 
        report.report_metadata.date_generated.toLowerCase().includes(testerFilter.toLowerCase())
      );
    }
    if (dateFilter) {
      result = result.filter(report => 
        report.report_metadata.date_generated.includes(dateFilter)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let aValue: string = '';
      let bValue: string = '';
      switch (sortField) {
        case 'client_name':
          aValue = a.report_metadata.client_name;
          bValue = b.report_metadata.client_name;
          break;
        case 'engagement_name':
          aValue = a.report_metadata.engagement_name;
          bValue = b.report_metadata.engagement_name;
          break;
        case 'date_generated':
          aValue = a.report_metadata.date_generated;
          bValue = b.report_metadata.date_generated;
          break;
        default:
          aValue = '';
          bValue = '';
      }
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

    setFilteredReports(result);
  }, [reports, searchQuery, nameFilter, typeFilter, testerFilter, dateFilter, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleNewReport = async (data: { name: string; assessmentType: string; tester: string }) => {
    try {
      const newReport = await addReport({
        report_metadata: {
          report_id: crypto.randomUUID(),
          client_name: data.name,
          engagement_name: data.assessmentType,
          engagement_id: '',
          date_generated: new Date().toISOString(),
          date_of_testing: { start: '', end: '' },
          tester_info: { company: '', team: [] },
          recipient: { company: '', contacts: [] },
          report_version: '1.0',
        },
        scope: { in_scope: [] },
        executive_summary: {
          risk_rating: 'low',
          business_impact: '',
          strengths: [],
          challenges: [],
          strategic_recommendations: [],
        },
        findings: [],
        artefacts: { tools_used: [] },
      });
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
          <Input 
            placeholder="Search reports..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
                    icon={sortField === 'client_name' ? (sortDirection === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />) : <ChevronUpIcon />}
                    size="xs"
                    variant="ghost"
                    ml={2}
                    onClick={() => handleSort('client_name')}
                  />
                </Flex>
                <Input 
                  size="sm" 
                  mt={2} 
                  placeholder="Filter name..." 
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                />
              </Th>
              <Th>
                <Flex align="center">
                  Assessment Type
                  <IconButton
                    aria-label="Sort by type"
                    icon={sortField === 'engagement_name' ? (sortDirection === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />) : <ChevronUpIcon />}
                    size="xs"
                    variant="ghost"
                    ml={2}
                    onClick={() => handleSort('engagement_name')}
                  />
                </Flex>
                <Input 
                  size="sm" 
                  mt={2} 
                  placeholder="Filter type..." 
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                />
              </Th>
              <Th>
                <Flex align="center">
                  Tester
                  <IconButton
                    aria-label="Sort by tester"
                    icon={sortField === 'date_generated' ? (sortDirection === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />) : <ChevronUpIcon />}
                    size="xs"
                    variant="ghost"
                    ml={2}
                    onClick={() => handleSort('date_generated')}
                  />
                </Flex>
                <Input 
                  size="sm" 
                  mt={2} 
                  placeholder="Filter tester..." 
                  value={testerFilter}
                  onChange={(e) => setTesterFilter(e.target.value)}
                />
              </Th>
              <Th>
                <Flex align="center">
                  Date
                  <IconButton
                    aria-label="Sort by date"
                    icon={sortField === 'date_generated' ? (sortDirection === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />) : <ChevronUpIcon />}
                    size="xs"
                    variant="ghost"
                    ml={2}
                    onClick={() => handleSort('date_generated')}
                  />
                </Flex>
                <Input 
                  size="sm" 
                  mt={2} 
                  placeholder="Filter date..." 
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredReports.map((report) => (
              <Tr key={report.id}>
                <Td>{report.report_metadata.client_name}</Td>
                <Td>{report.report_metadata.engagement_name}</Td>
                <Td>{report.report_metadata.date_generated}</Td>
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
        <Text>Showing {filteredReports.length} of {reports.length} entries</Text>
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
        reportName={reportToDelete?.report_metadata.engagement_name || ''}
      />
    </Container>
  );
};

export default Reports; 