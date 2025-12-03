# Contributing to MCP Kali Server

Thank you for your interest in contributing to MCP Kali Server! This document provides guidelines for contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct (see CODE_OF_CONDUCT.md).

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected behavior** vs actual behavior
- **Environment details** (OS, Docker version, Node.js version)
- **Logs and error messages**
- **Screenshots** if applicable

### Suggesting Enhancements

Enhancement suggestions are welcome! Please provide:

- **Clear use case** for the enhancement
- **Detailed description** of the proposed functionality
- **Possible implementation approach** (if you have ideas)
- **Impact on existing features**

### Pull Requests

1. **Fork** the repository
2. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**:
   - Follow the coding style
   - Add tests if applicable
   - Update documentation
4. **Test your changes**:
   ```bash
   npm run build
   npm test
   ./scripts/test-setup.sh
   ```
5. **Commit** with clear messages:
   ```bash
   git commit -m "Add: New feature description"
   ```
6. **Push** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open a Pull Request** with:
   - Clear description of changes
   - Related issue numbers
   - Testing performed
   - Screenshots (if UI changes)

## Development Guidelines

### Coding Style

- **TypeScript**: Use strict typing, avoid `any` when possible
- **Formatting**: Use consistent indentation (2 spaces)
- **Naming**:
  - Functions: `camelCase`
  - Classes: `PascalCase`
  - Constants: `UPPER_SNAKE_CASE`
- **Comments**: Add JSDoc comments for public functions

### Project Structure

```
src/
├── index.ts           # Main MCP server
├── docker-manager.ts  # Docker operations
└── tools/            # Individual tool implementations (future)
```

### Adding New Security Tools

To add a new security tool:

1. **Add to Dockerfile**:
   ```dockerfile
   RUN apt-get install -y your-tool
   ```

2. **Add tool definition** in `src/index.ts`:
   ```typescript
   {
     name: 'your_tool',
     description: 'Description of what it does',
     inputSchema: {
       type: 'object',
       properties: {
         target: {
           type: 'string',
           description: 'Target to scan'
         }
       },
       required: ['target']
     }
   }
   ```

3. **Implement handler** in `handleToolCall()`:
   ```typescript
   case 'your_tool': {
     const { target } = args;
     command = `your-tool ${target}`;
     result = await dockerManager.executeCommand(command);
     break;
   }
   ```

4. **Update documentation**:
   - Add to README.md "Available Tools" section
   - Add examples to EXAMPLES.md

5. **Test thoroughly**:
   - Build Docker image
   - Test tool execution
   - Verify error handling

### Testing

- Test changes in isolated environment
- Verify Docker container builds successfully
- Test MCP integration with Claude CLI
- Check for security implications

### Documentation

- Update README.md for feature changes
- Add examples to EXAMPLES.md
- Update QUICKSTART.md if setup changes
- Add JSDoc comments for new functions

## Security Considerations

⚠️ **Important**: This project provides access to penetration testing tools.

When contributing:

- **Never commit** real credentials, API keys, or sensitive data
- **Test responsibly** - only on authorized targets
- **Document security implications** of new features
- **Review dependencies** for vulnerabilities
- **Consider abuse potential** of new features

### Security Checklist

- [ ] No hardcoded credentials
- [ ] Input validation for all tool parameters
- [ ] Proper error handling (don't expose system info)
- [ ] Command injection prevention
- [ ] Documentation includes responsible use warnings

## Git Commit Messages

Use conventional commits format:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples**:
```
feat(tools): Add masscan integration
fix(docker): Resolve container startup timeout
docs(readme): Update installation instructions
```

## Release Process

1. Update version in `package.json`
2. Update CHANGELOG.md
3. Create git tag: `git tag v1.x.x`
4. Push tag: `git push --tags`
5. Create GitHub release with changelog

## Questions?

- Open a [Discussion](https://github.com/eutectico/mcp-kali-server/discussions)
- Join our community chat (if available)
- Check existing [Issues](https://github.com/eutectico/mcp-kali-server/issues)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to MCP Kali Server! 🚀
