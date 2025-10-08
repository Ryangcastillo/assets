# Contributing to Assets Repository

Thank you for your interest in contributing to this assets repository! This document provides guidelines and information to help you contribute effectively.

## 🎯 How to Contribute

### Types of Contributions

- **Assets**: High-quality images, icons, videos, audio files, documents
- **Components**: Reusable UI and functional components
- **Code Blocks**: Useful code snippets and patterns
- **Resources**: Curated links, tools, and reference materials
- **AI Agents**: Prompts, workflows, and automation scripts
- **Templates**: Project and component boilerplates
- **Documentation**: Improvements to guides and examples

### Before You Start

1. Check existing issues and pull requests to avoid duplicates
2. Read the relevant directory README for specific guidelines
3. Ensure your contribution adds value and follows our standards
4. For large contributions, create an issue to discuss first

## 📋 Contribution Process

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/assets.git
cd assets
```

### 2. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

Use descriptive branch names:
- `feature/add-ui-components`
- `fix/update-broken-links`
- `docs/improve-readme`

### 3. Make Your Changes

Follow the guidelines for each asset type:

#### For Assets
- Optimize file sizes appropriately
- Use descriptive filenames (kebab-case)
- Place files in correct subdirectories
- Include attribution if required

#### For Components
- Follow existing code style
- Include comprehensive documentation
- Add usage examples
- Include tests where applicable
- Ensure accessibility compliance

#### For Documentation
- Use clear, concise language
- Follow Markdown best practices
- Include code examples
- Update table of contents if needed

### 4. Test Your Changes

- Verify all links work
- Test code components
- Check file formats and sizes
- Ensure documentation renders correctly

### 5. Commit Your Changes

Use conventional commit format:

```bash
git commit -m "feat: add new UI button components"
git commit -m "docs: update contributing guidelines"
git commit -m "fix: correct broken resource links"
```

Commit types:
- `feat`: New features or assets
- `fix`: Bug fixes or corrections
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### 6. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Create a pull request with:
- Clear title and description
- Link to related issues
- Screenshots for visual changes
- Checklist of changes made

## 📏 Quality Standards

### Asset Requirements

#### Images
- ✅ High resolution (minimum 1920px width for backgrounds)
- ✅ Optimized file size
- ✅ Appropriate format (PNG for transparency, JPG for photos)
- ✅ Descriptive filename
- ❌ Copyrighted material without permission

#### Code Components
- ✅ Clean, readable code
- ✅ Comprehensive documentation
- ✅ Usage examples
- ✅ Error handling
- ✅ Accessibility compliance
- ❌ Hardcoded values without configuration
- ❌ Missing dependencies

#### Documentation
- ✅ Clear explanations
- ✅ Working examples
- ✅ Proper formatting
- ✅ Up-to-date information
- ❌ Broken links
- ❌ Outdated screenshots

### File Organization

```
category/
├── README.md              # Category documentation
├── subcategory/           # Logical grouping
│   ├── README.md         # Subcategory documentation
│   ├── asset-name.*      # Main files
│   └── examples/         # Usage examples
```

## 🔍 Review Process

### Automated Checks
- File size validation
- Link checking
- Code linting
- Documentation validation
- Security scanning

### Manual Review
- Content quality assessment
- Relevance and usefulness
- Compliance with guidelines
- Integration with existing assets

### Approval Process
1. Automated checks must pass
2. At least one maintainer review
3. Community feedback (for significant changes)
4. Final approval and merge

## 🎨 Style Guidelines

### Naming Conventions

#### Files
- Use kebab-case: `my-component.js`
- Be descriptive: `hero-background.jpg` not `img1.jpg`
- Include version when applicable: `logo-v2.svg`

#### Directories
- Use kebab-case
- Singular nouns preferred
- Group related items

### Code Style
- Follow language-specific conventions
- Use EditorConfig settings
- Include meaningful comments
- Follow existing patterns in the repository

### Documentation Style
- Use active voice
- Write concisely
- Include examples
- Structure with clear headings
- Use bullet points for lists

## 🚫 What Not to Contribute

### Prohibited Content
- Copyrighted material without proper license
- Low-quality or inappropriate images
- Malicious code or security vulnerabilities
- Personal or confidential information
- Duplicate or redundant assets
- Outdated or deprecated technologies (without clear purpose)

### Technical Restrictions
- Files larger than 50MB (use Git LFS or external links)
- Executable files without prior approval
- Dependencies with known security issues
- Code without proper documentation

## 🆘 Getting Help

### Resources
- [Repository Discussions](https://github.com/Ryangcastillo/assets/discussions)
- [Issue Tracker](https://github.com/Ryangcastillo/assets/issues)
- Directory-specific README files
- [GitHub Docs](https://docs.github.com)

### Common Questions

**Q: How do I add large files?**
A: For files over 50MB, consider using Git LFS or hosting externally and providing links.

**Q: Can I reorganize existing files?**
A: Significant reorganization should be discussed in an issue first to avoid breaking existing integrations.

**Q: How do I update someone else's contribution?**
A: Create a pull request with improvements and mention the original contributor for context.

## 📄 License

By contributing to this repository, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

Thank you for helping make this assets repository better for everyone! 🙏