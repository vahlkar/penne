import React from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import About from './components/About';

const Home: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>Hello, World!</h1>
      <nav style={{ marginTop: '2rem' }}>
        <Link to="/about" style={{ 
          color: '#0066cc',
          textDecoration: 'none',
          fontSize: '1rem'
        }}>
          Learn more about this app
        </Link>
      </nav>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </HashRouter>
  );
};

export default App; 