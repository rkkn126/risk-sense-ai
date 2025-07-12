# Contributing to Risk Sense AI

Thank you for your interest in contributing to Risk Sense AI! This document provides guidelines for contributing to the project.

## Code of Conduct

Please be respectful and professional in all interactions. We welcome contributions from everyone.

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Git
- API keys for News API and OpenRouter

### Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/risk-sense-ai.git
   cd risk-sense-ai
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

5. Start development server:
   ```bash
   npm run dev
   ```

## Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow existing code formatting
- Use meaningful variable and function names
- Add comments for complex logic

### Component Structure
- Keep components focused and single-purpose
- Use TypeScript interfaces for props
- Implement proper error handling
- Follow React best practices

### API Integration
- Use proper error handling for external APIs
- Implement caching where appropriate
- Document API endpoints
- Follow RESTful conventions

## Making Changes

### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

### Commit Messages
Use clear, descriptive commit messages:
```
feat: add climate risk analysis tab
fix: resolve GDP data display issue
docs: update API documentation
refactor: optimize data fetching logic
```

### Pull Request Process

1. Create a feature branch from main
2. Make your changes
3. Test your changes thoroughly
4. Update documentation if needed
5. Submit a pull request with:
   - Clear description of changes
   - Any related issues
   - Screenshots if UI changes

## Testing

- Test all functionality manually
- Ensure no console errors
- Verify API integrations work correctly
- Test responsive design on different screen sizes

## Documentation

- Update README.md for significant changes
- Document new API endpoints
- Update technical documentation
- Include code comments for complex logic

## Reporting Issues

When reporting bugs, please include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser/environment details
- Screenshots if applicable

## Feature Requests

For new features:
- Describe the use case
- Explain the expected functionality
- Consider implementation complexity
- Discuss potential alternatives

## Questions

If you have questions about contributing, please open an issue or reach out to the maintainers.

Thank you for contributing to Risk Sense AI!