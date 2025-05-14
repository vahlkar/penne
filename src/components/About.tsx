import React from 'react';
import { Container, Heading, Text, List, ListItem, VStack, Box, Divider } from '@chakra-ui/react';

const About: React.FC = () => {
  return (
    <Box pt="60px">
      <Container maxW="container.md" py={8}>
        <VStack spacing={6} align="stretch">
          <Heading>About</Heading>
          
          <Text fontSize="lg">
            This application is designed to streamline the process of creating and managing professional penetration test reports.
          </Text>

          <Divider />

          <Text fontSize="lg" fontWeight="bold">Key Features:</Text>
          <List spacing={3}>
            <ListItem>Create and manage multiple penetration test reports</ListItem>
            <ListItem>Detailed documentation of security findings and vulnerabilities</ListItem>
            <ListItem>Professional report generation and export capabilities</ListItem>
            <ListItem>Local data storage using IndexedDB</ListItem>
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

          <Text fontSize="md" color="gray.600">
            Note: All data is stored locally in your browser using IndexedDB. Make sure to regularly export your reports if you need 
            to preserve them across different browsers or devices.
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

export default About; 