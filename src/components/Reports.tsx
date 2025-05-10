import React from 'react';
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
  InputRightElement,
  Icon,
} from '@chakra-ui/react';
import { SearchIcon, AddIcon, EditIcon, DownloadIcon, DeleteIcon, ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';

const Reports: React.FC = () => {
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
        <Button leftIcon={<AddIcon />} colorScheme="green">
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
            <Tr>
              <Td>Sample Report 1</Td>
              <Td>Web Application</Td>
              <Td>John Doe</Td>
              <Td>2024-01-15</Td>
              <Td>
                <HStack spacing={2}>
                  <IconButton
                    aria-label="Edit report"
                    icon={<EditIcon />}
                    size="sm"
                    variant="ghost"
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
                  />
                </HStack>
              </Td>
            </Tr>
            {/* Add more rows as needed */}
          </Tbody>
        </Table>
      </Box>

      {/* Footer */}
      <Flex justify="space-between" align="center" mt={4}>
        <Text>Showing 1-1 of 1 entries</Text>
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
    </Container>
  );
};

export default Reports; 