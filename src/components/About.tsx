import React from 'react';
import { Container, Heading, Text, List, ListItem, VStack, Box, Divider, HStack, Image, Badge, Link } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';

const About: React.FC = () => {
  return (
    <Box pt="60px">
      <Container maxW="container.md" py={8}>
        <VStack spacing={6} align="stretch">
          <HStack spacing={4} align="center">
            <Image src="/favicon.svg" alt="Pe'n'ne Logo" boxSize="150px" />
            <VStack align="start" spacing={1}>
              <Heading>Pe'n'ne</Heading>
              <Text fontSize="md" color="gray.600">Pentest Evidence and Notes Editor</Text>
              <Link href="https://github.com/vahlkar/penne" isExternal color="blue.500">
                GitHub Repository <ExternalLinkIcon mx="2px" />
              </Link>
            </VStack>
          </HStack>

          <Text fontSize="lg">
            Pe'n'ne is a modern, frontend-only web application designed to streamline the process of creating and managing professional penetration test reports. It provides a secure, efficient, and user-friendly interface for documenting security findings and generating comprehensive reports.
          </Text>

          <Divider />

          <Text fontSize="lg" fontWeight="bold">Features:</Text>
          <List spacing={3}>
            <ListItem>📝 Create and manage multiple penetration test reports</ListItem>
            <ListItem>🔍 Detailed documentation of security findings and vulnerabilities</ListItem>
            <ListItem>📊 Professional report generation and export capabilities</ListItem>
            <ListItem>💾 Local data storage using IndexedDB</ListItem>
            <ListItem>🎨 Modern, responsive UI built with Chakra UI</ListItem>
            <ListItem>🔒 Secure by design with local data storage</ListItem>
          </List>

          <Divider />

          <Text fontSize="lg" fontWeight="bold">Technologies Used:</Text>
          <List spacing={3}>
            <ListItem>React with TypeScript</ListItem>
            <ListItem>Chakra UI</ListItem>
            <ListItem>IndexedDB</ListItem>
            <ListItem>Vite</ListItem>
          </List>

          <Divider />

          <Text fontSize="lg" fontWeight="bold">Project Status:</Text>
          <List spacing={3}>
            <ListItem>✅ Core functionality implemented</ListItem>
            <ListItem>🚧 Report export features in progress</ListItem>
            <ListItem>📋 Tool integration planned</ListItem>
          </List>

          <Divider />

          <Box>
            <Text fontSize="md" fontWeight="bold" mb={2}>License:</Text>
            <Link href="https://github.com/vahlkar/penne/blob/main/LICENSE" isExternal>
              <Badge colorScheme="yellow" fontSize="md">MIT License</Badge>
            </Link>
          </Box>

          <Text fontSize="md" color="gray.600">
            Note: All data is stored locally in your browser using IndexedDB. Make sure to regularly export your reports if you need 
            to preserve them across different browsers or devices.
          </Text>

          <Text fontSize="sm" color="gray.500" fontStyle="italic">
            This project is maintained on a voluntary basis with no commitments or guarantees. All contributions are handled on a best-effort basis. Users are responsible for their own security and should not rely on this project for critical security needs without proper assessment.
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

export default About; 