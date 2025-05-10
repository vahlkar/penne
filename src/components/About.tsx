import React from 'react';

const About: React.FC = () => {
  return (
    <div style={{
      padding: '2rem',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1>About This App</h1>
      <p>This is a sample React application demonstrating routing capabilities.</p>
      <p>Features:</p>
      <ul>
        <li>React with TypeScript</li>
        <li>Vite for fast development</li>
        <li>React Router for navigation</li>
      </ul>
    </div>
  );
};

export default About; 