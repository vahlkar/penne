import React from 'react';
import { Container, Heading, Text, VStack, Switch, FormControl, FormLabel, useColorMode } from '@chakra-ui/react';

const Configuration: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Container maxW="container.xl" pt={20}>
      <VStack spacing={6} align="stretch">
        <Heading>Configuration</Heading>
        
        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="dark-mode" mb="0">
            Dark Mode
          </FormLabel>
          <Switch
            id="dark-mode"
            isChecked={colorMode === 'dark'}
            onChange={toggleColorMode}
            colorScheme="blue"
          />
        </FormControl>

        <Text>System configuration and settings will be implemented here.</Text>
      </VStack>
    </Container>
  );
};

export default Configuration; 