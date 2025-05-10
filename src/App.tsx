import React from 'react';

interface AppProps {
  title?: string;
}

const App: React.FC<AppProps> = ({ title = 'Hello, World!' }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>{title}</h1>
    </div>
  );
};

export default App; 