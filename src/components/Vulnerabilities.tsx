import React from 'react';
import { Container, Heading, Text, VStack } from '@chakra-ui/react';

const Vulnerabilities: React.FC = () => {
  return (
    <Container maxW="container.xl" pt={20}>
      <VStack spacing={6} align="stretch">
        <Heading>Vulnerabilities</Heading>
        <Text>Vulnerability management and reporting will be implemented here.</Text>
      </VStack>
    </Container>
  );
};

export default Vulnerabilities; 