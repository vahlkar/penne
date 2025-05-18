# Security Policy

## Supported Versions

We currently support the following versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Security Features

Pe'n'ne implements several security measures to protect user data:

1. **Local Data Storage**
   - All data is stored locally in the user's browser using IndexedDB
   - No data is transmitted to external servers
   - Data remains under user control at all times

2. **Data Protection**
   - No sensitive data is stored in cookies or local storage
   - All data is stored in IndexedDB
   - Data is isolated to the application's origin

3. **Input Validation**
   - All user inputs are validated before processing
   - XSS protection measures are in place

## Reporting a Vulnerability

This is a personal open source project maintained on a voluntary basis. There are no commitments or guarantees regarding response times or fixes.

If you discover a security vulnerability:

1. Create a new security issue on GitHub: [https://github.com/vahlkar/penne/issues](https://github.com/vahlkar/penne/issues)
2. Include the following information:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Any suggested fixes

## Security Best Practices

When using Pe'n'ne, please follow these security best practices:

1. **Regular Backups**
   - Export your reports regularly
   - Keep backups in a secure location

2. **Browser Security**
   - Keep your browser updated
   - Use a modern, supported browser

3. **Data Management**
   - Regularly review and clean up old reports
   - Export reports and standard observations before clearing browser data

## Security Updates

Security updates are provided on a best-effort basis. To ensure you're using the most secure version:

1. Keep the application updated
2. Monitor the GitHub repository for updates
3. Follow the release notes for security-related updates

## Disclaimer

This project is maintained on a voluntary basis with no commitments or guarantees. All contributions, including security reports, are handled on a best-effort basis. Users are responsible for their own security and should not rely on this project for critical security needs without proper assessment.