import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ChakraProvider, Box, ColorModeScript } from '@chakra-ui/react';
import Header from './components/Header';
import About from './components/About';
import Reports from './components/Reports';
import Vulnerabilities from './components/Vulnerabilities';
import Configuration from './components/Configuration';
import ReportDetail from './components/ReportDetail';
import theme from './theme';

const App: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <HashRouter>
        <Box minH="100vh" bg="gray.50" _dark={{ bg: 'gray.900' }}>
          <Header />
          <Routes>
            <Route path="/" element={<Reports />} />
            <Route path="/about" element={<About />} />
            <Route path="/vulnerabilities" element={<Vulnerabilities />} />
            <Route path="/configuration" element={<Configuration />} />
            <Route path="/report/:id" element={<ReportDetail />} />
          </Routes>
        </Box>
      </HashRouter>
    </ChakraProvider>
  );
};

export default App; 