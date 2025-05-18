# Installation Guide

## Prerequisites

Before installing Pe'n'ne, ensure you have the following prerequisites:

- Node.js (v16 or higher)
- npm (v7 or higher)
- Modern web browser (Chrome, Firefox, Safari, or Edge)
- Git (for development)

## Installation Methods

### 1. Web Application

Pe'n'ne is available as a web application and can be accessed directly through your browser:

1. Visit the official website: [https://penne.arcturus.ch](https://penne.arcturus.ch)
2. No installation required
3. Works offline after initial load

### 2. Local Development

To set up Pe'n'ne for local development:

1. Clone the repository:
   ```bash
   git clone https://github.com/vahlkar/penne.git
   cd penne
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Browser Requirements

Pe'n'ne requires a modern web browser with support for:

- IndexedDB
- ES6+ JavaScript features
- CSS Grid and Flexbox
- Web Workers (optional)

### Supported Browsers

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Development Environment Setup

### 1. IDE Configuration

Recommended IDE: Visual Studio Code

Required extensions:
- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- GitLens

### 2. Environment Variables

Create a `.env` file in the project root with the following variables:
- `VITE_APP_TITLE`: Application title
- `VITE_APP_DESCRIPTION`: Application description
- `VITE_APP_VERSION`: Application version

### 3. Development Tools

Install development tools:
```bash
npm install -D @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D prettier eslint-config-prettier
```

## Troubleshooting

### Common Issues

1. **IndexedDB Not Available**
   - Enable IndexedDB in your browser settings
   - Check if you're in private/incognito mode
   - Clear browser cache and cookies

2. **Development Server Issues**
   - Check if port 5173 is available
   - Ensure all dependencies are installed
   - Check Node.js version

3. **Build Errors**
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules: `rm -rf node_modules`
   - Reinstall dependencies: `npm install`

### Getting Help

If you encounter any issues:

1. Check the [GitHub Issues](https://github.com/vahlkar/penne/issues)
2. Contact support at [support@arcturus.ch](mailto:support@arcturus.ch)

## Security Considerations

### 1. Local Development

- Use HTTPS in development
- Enable security headers
- Implement CSP

### 2. Production Deployment

- Enable all security headers
- Configure proper CORS settings
- Implement rate limiting

## Updating

### 1. Web Application

The web application updates automatically when you refresh the page.

### 2. Local Development

Update your local installation:

```bash
git pull origin main
npm install
npm run build
```

## Uninstallation

### 1. Web Application

No uninstallation required. Clear browser data to remove local storage.

### 2. Local Development

Remove the project:

```bash
cd ..
rm -rf penne
```

## Support

For additional support:

- GitHub: [github.com/vahlkar/penne](https://github.com/vahlkar/penne)