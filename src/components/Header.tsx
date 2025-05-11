import React from 'react';
import { Box, Tabs, TabList, Tab, useColorModeValue, Flex } from '@chakra-ui/react';
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
      <Flex justify="center" align="center">
        <Tabs 
          variant="enclosed" 
          index={location.pathname === '/' ? 0 : 
                 location.pathname === '/vulnerabilities' ? 1 : 
                 location.pathname === '/configuration' ? 2 :
                 location.pathname === '/about' ? 3 : 0}
        >
          <TabList>
            <Tab as={Link} to="/">Reports</Tab>
            <Tab as={Link} to="/vulnerabilities">Vulnerabilities</Tab>
            <Tab as={Link} to="/configuration">Configuration</Tab>
            <Tab as={Link} to="/about">About</Tab>
          </TabList>
        </Tabs>
      </Flex>
    </Box>
  );
};

export default Header; 