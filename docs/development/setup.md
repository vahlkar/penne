# Development Setup Guide

## Development Environment

### 1. Required Tools

- Node.js (v16 or higher)
- npm (v7 or higher)
- Git
- Modern code editor (VS Code recommended)
- Modern web browser with developer tools

### 2. IDE Setup

#### Visual Studio Code

Recommended extensions:
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "eamodio.gitlens",
    "formulahendry.auto-rename-tag",
    "streetsidesoftware.code-spell-checker"
  ]
}
```

Settings (`settings.json`):
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

## Project Setup

### 1. Repository Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/penne.git
   cd penne
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment files:
   ```bash
   cp .env.example .env
   ```

### 2. Development Configuration

#### Environment Variables

Create `.env` file:
```env
VITE_APP_TITLE=Pe'n'ne
VITE_APP_DESCRIPTION=Pentest Evidence and Notes Editor
VITE_APP_VERSION=$npm_package_version
```

#### TypeScript Configuration

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": false,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## Development Workflow

### 1. Starting Development

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser to `http://localhost:5173`

3. Enable source maps in browser dev tools

### 2. Code Quality Tools

#### ESLint Configuration

`.eslintrc.js`:
```javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.js'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
}
```

#### Prettier Configuration

`.prettierrc`:
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

### 3. Testing Setup

1. Install testing dependencies:
   ```bash
   npm install -D vitest @testing-library/react @testing-library/jest-dom
   ```

2. Configure Vitest (`vitest.config.ts`):
   ```typescript
   import { defineConfig } from 'vitest/config';

   export default defineConfig({
     test: {
       environment: 'jsdom',
       globals: true,
       setupFiles: ['./src/test/setup.ts'],
     },
   });
   ```

## Development Guidelines

### 1. Code Organization

```
src/
├── components/     # React components
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
├── types/         # TypeScript types
├── constants/     # Constants and configuration
├── styles/        # Global styles
└── test/          # Test utilities
```

### 2. Component Structure

```typescript
// Component template
import React from 'react';
import { Box } from '@chakra-ui/react';

interface ComponentProps {
  // Props definition
}

export const Component: React.FC<ComponentProps> = ({ /* props */ }) => {
  // Component logic

  return (
    <Box>
      {/* Component JSX */}
    </Box>
  );
};
```

### 3. Testing Structure

```typescript
// Test template
import { render, screen } from '@testing-library/react';
import { Component } from './Component';

describe('Component', () => {
  it('should render correctly', () => {
    render(<Component />);
    // Test assertions
  });
});
```

## Debugging

### 1. Browser Dev Tools

- Use React Developer Tools
- Enable source maps
- Use console logging

### 2. VS Code Debugging

`.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}"
    }
  ]
}
```

## Performance Optimization

### 1. Development

- Use React DevTools Profiler
- Monitor bundle size
- Check performance metrics

### 2. Production

- Enable production builds
- Use code splitting
- Optimize assets

## Security Development

### 1. Security Headers

Configure security headers in development:
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    headers: {
      'Content-Security-Policy': "default-src 'self'",
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff'
    }
  }
});
```

### 2. Security Testing

- Run security audits
- Check dependencies
- Test input validation

## Deployment

### 1. Building

```bash
npm run build
```

### 2. Preview

```bash
npm run preview
```

## Additional Resources

- [React Documentation](https://reactjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Chakra UI Documentation](https://chakra-ui.com/docs)
- [Vite Documentation](https://vitejs.dev/guide) 