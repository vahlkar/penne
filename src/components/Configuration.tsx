import React from 'react';
import { Container, Heading, Text, VStack } from '@chakra-ui/react';

const Configuration: React.FC = () => {
  return (
    <Container maxW="container.xl" pt={20}>
      <VStack spacing={6} align="stretch">
        <Heading>Configuration</Heading>
        <Text>System configuration and settings will be implemented here.</Text>
      </VStack>
    </Container>
  );
};

export default Configuration; 