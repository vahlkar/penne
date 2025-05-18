# Contributing to Pe'n'ne

Thank you for your interest in contributing to Pe'n'ne! This document provides guidelines and standards for contributing to the project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## How to Contribute

1. Fork the repository
2. Create a new branch for your feature or fix
3. Make your changes
4. Submit a pull request

## Branch Naming Convention

- Feature branches: `feature/description`
- Bug fixes: `fix/description`
- Documentation: `docs/description`
- Security fixes: `security/description`

## Commit Message Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or modifying tests
- `chore`: Maintenance tasks

## Code Standards

## Style Guide

1. **TypeScript**
   - Use strict type checking
   - Avoid `any` type
   - Use interfaces for object shapes
   - Use type guards when necessary

2. **React Components**
   - Use functional components with hooks
   - Implement proper prop types
   - Follow the single responsibility principle
   - Use proper component composition

3. **State Management**
   - Use React hooks for local state
   - Keep state as local as possible
   - Use context for global state when necessary

### Code Style

1. **Formatting**
   - Use 2 spaces for indentation
   - Use semicolons
   - Use single quotes for strings
   - Maximum line length: 100 characters

2. **Naming Conventions**
   - Components: PascalCase
   - Functions: camelCase
   - Variables: camelCase
   - Constants: UPPER_SNAKE_CASE
   - Interfaces: PascalCase with 'I' prefix
   - Types: PascalCase

3. **File Organization**
   - One component per file
   - Group related components in directories
   - Use index files for clean exports

## Testing

1. **Unit Tests**
   - Write tests for all new features
   - Maintain existing test coverage
   - Use Jest and React Testing Library

2. **Test Naming**
   - Use descriptive test names
   - Follow the pattern: `describe('Component', () => { it('should do something', () => {}) })`

## Documentation

1. **Code Documentation**
   - Document complex functions and components
   - Use JSDoc comments for public APIs
   - Keep documentation up to date

2. **Component Documentation**
   - Document props and their types
   - Include usage examples
   - Document any side effects

## Pull Request Process

1. Update documentation for any new features
2. Add tests for new functionality
3. Ensure all tests pass
4. Update the changelog
5. Request review from maintainers

## Review Process

1. Code review by at least one maintainer
2. All tests must pass
3. Documentation must be complete
4. Code must follow style guidelines

## Getting Help

- Open an issue for bugs or feature requests
- Check existing documentation

## License

By contributing to Pe'n'ne, you agree that your contributions will be licensed under the project's MIT License. 