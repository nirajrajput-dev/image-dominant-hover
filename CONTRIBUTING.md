# Contributing to @niraj/image-dominant-hover

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## 🤝 Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## 🐛 Reporting Bugs

Before creating a bug report, please check existing issues to avoid duplicates.

### How to Report a Bug

1. Use the [GitHub Issues](https://github.com/nirajrajput-dev/image-dominant-hover/issues) page
2. Provide a clear and descriptive title
3. Include steps to reproduce the issue
4. Describe the expected vs. actual behavior
5. Include your environment details:
   - Node.js version
   - npm version
   - React version
   - Browser and version
   - Operating system

### Bug Report Template

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:

1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment**

- Node.js: [e.g., v18.0.0]
- React: [e.g., 18.2.0]
- Browser: [e.g., Chrome 120]
- OS: [e.g., Windows 11]
```

## 💡 Suggesting Enhancements

Enhancement suggestions are welcome! Please:

1. Check if the enhancement has already been suggested
2. Provide a clear use case
3. Explain why this enhancement would be useful
4. Consider implementation complexity

## 🔧 Development Setup

### Prerequisites

- Node.js 18+ and npm 9+
- Git

### Getting Started

1. **Fork the repository**

2. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR_USERNAME/image-dominant-hover.git
   cd image-dominant-hover
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 🏗️ Project Structure

```
image-dominant-hover/
├── src/
│   ├── lib/                # Library source code
│   │   ├── components/     # React components
│   │   │   ├── ImageCard.tsx
│   │   │   └── ImageCard.test.tsx
│   │   ├── utils/          # Utility functions
│   │   │   ├── colorExtractor.ts
│   │   │   └── colorExtractor.test.ts
│   │   └── index.ts        # Public API exports
│   └── test/               # Test configuration
│       └── setup.ts
├── demo/                   # Demo application
│   └── src/
├── dist/                   # Build output (generated)
└── coverage/               # Test coverage (generated)
```

## 🧪 Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

**Requirements:**

- All tests must pass
- Test coverage must remain above 80%
- New features must include tests

## 🎨 Coding Standards

### TypeScript

- Use TypeScript strict mode
- All functions must have explicit return types
- Avoid `any` types (use `unknown` if necessary)
- Use meaningful variable names

### React Components

- Use functional components with hooks
- Include PropTypes or TypeScript interfaces
- Follow React best practices
- Ensure components are accessible (ARIA attributes)

### Testing

- Write descriptive test names
- Test both success and failure cases
- Mock external dependencies
- Aim for high code coverage

### Code Style

```bash
# Check linting
npm run lint

# Check types
npm run typecheck
```

## 📝 Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Test additions or changes
- `chore`: Build process or auxiliary tool changes

### Examples

```bash
feat(ImageCard): add support for custom border radius

fix(colorExtractor): handle transparent images correctly

docs(README): update installation instructions

test(ImageCard): add tests for keyboard navigation
```

## 🔄 Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new features
3. **Ensure all tests pass** (`npm test`)
4. **Check type safety** (`npm run typecheck`)
5. **Verify linting** (`npm run lint`)
6. **Update CHANGELOG.md** with your changes

### Pull Request Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Tests pass locally
- [ ] Coverage remains above 80%
- [ ] Manual testing completed

## Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings generated
```

## 🚀 Building and Publishing

### Build Library

```bash
# Build the library
npm run build:lib

# Build demo
npm run build:demo
```

### Local Testing

```bash
# Link package locally
npm link

# In another project
npm link @niraj/image-dominant-hover
```

## 📚 Documentation

When adding new features:

1. Update `README.md` with usage examples
2. Add JSDoc comments to functions
3. Update TypeScript types
4. Include code examples in documentation

## ❓ Questions?

Feel free to:

- Open an issue for discussion
- Reach out to maintainers
- Check existing issues and discussions

## 🙏 Thank You!

Your contributions make this project better for everyone. We appreciate your time and effort!
