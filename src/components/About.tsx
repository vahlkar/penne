import React from 'react';
import { Container, Heading, Text, List, ListItem, VStack } from '@chakra-ui/react';

const About: React.FC = () => {
  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading>About This App</Heading>
        <Text fontSize="lg">
          This is a sample React application demonstrating routing capabilities.
        </Text>
        <Text fontSize="lg" fontWeight="bold">Features:</Text>
        <List spacing={3}>
          <ListItem>React with TypeScript</ListItem>
          <ListItem>Vite for fast development</ListItem>
          <ListItem>React Router for navigation</ListItem>
          <ListItem>Chakra UI for beautiful components</ListItem>
        </List>
      </VStack>
    </Container>
  );
};

export default About; 