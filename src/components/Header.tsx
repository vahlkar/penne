import React from 'react';
import { Box, Tabs, TabList, Tab, useColorModeValue, Flex, Link as ChakraLink } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box 
      as="header" 
      position="fixed" 
      w="100%" 
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      zIndex="sticky"
    >
      <Flex justify="space-between" align="center">
        <Tabs 
          variant="enclosed" 
          index={location.pathname === '/' ? 0 : 
                 location.pathname === '/vulnerabilities' ? 1 : 
                 location.pathname === '/configuration' ? 2 : 0}
        >
          <TabList>
            <Tab as={Link} to="/">Reports</Tab>
            <Tab as={Link} to="/vulnerabilities">Vulnerabilities</Tab>
            <Tab as={Link} to="/configuration">Configuration</Tab>
          </TabList>
        </Tabs>
        <ChakraLink
          as={Link}
          to="/about"
          mr={4}
          color="blue.500"
          _hover={{ textDecoration: 'none', color: 'blue.600' }}
        >
          About
        </ChakraLink>
      </Flex>
    </Box>
  );
};

export default Header; 