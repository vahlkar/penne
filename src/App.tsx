import React from 'react';
import { ChakraProvider, CSSReset } from '@chakra-ui/react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Reports from './components/Reports';
import ReportDetail from './components/ReportDetail';
import Header from './components/Header';
import StandardObservations from './components/StandardObservations';
import Configuration from './components/Configuration';
import About from './components/About';

const App: React.FC = () => {
  return (
    <ChakraProvider>
      <CSSReset />
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Reports />} />
          <Route path="/report/:id/*" element={<ReportDetail />} />
          <Route path="/standard-observations" element={<StandardObservations />} />
          <Route path="/configuration" element={<Configuration />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
};

export default App; 