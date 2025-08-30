# Development Setup Guide

This guide explains how to set up the development environment with pre-commit hooks and GitHub workflows.

## Pre-commit Hooks

### Installation

1. Install dependencies:
```bash
yarn install
```

2. Install husky:
```bash
yarn add -D husky
```

3. Initialize husky:
```bash
yarn prepare
```

4. Make the pre-commit hook executable:
```bash
chmod +x .husky/pre-commit
```

### What the Pre-commit Hook Does

The pre-commit hook automatically runs before each commit to ensure code quality:

- **ESLint**: Checks code style and catches potential errors
- **TypeScript Type Check**: Ensures type safety
- **Tests**: Runs tests if they exist
- **Build Check**: Ensures the project builds successfully

If any of these checks fail, the commit will be blocked until the issues are resolved.

### Manual Commands

You can also run these checks manually:

```bash
# Run linting
yarn lint

# Run type checking
yarn type-check

# Run both
yarn lint && yarn type-check
```

## GitHub Workflows

### Automatic Checks

The GitHub workflow automatically runs on:

- **Pull Requests**: When creating or updating PRs to `main` or `develop` branches
- **Pushes**: When pushing directly to `main` or `develop` branches

### What Gets Checked

1. **Code Linting**: ESLint rules enforcement
2. **Type Safety**: TypeScript compilation check
3. **Build Verification**: Ensures the project builds successfully
4. **PR Comments**: Automatically comments on PRs with results

### Workflow File Location

The workflow is located at: `.github/workflows/lint-check.yml`

## Development Workflow

### 1. Before Committing

The pre-commit hook will automatically run and check your code. Make sure to:

- Fix any linting errors
- Resolve TypeScript type issues
- Ensure tests pass (if they exist)

### 2. Creating Pull Requests

When you create a PR:

1. The GitHub workflow will automatically run
2. You'll see a comment indicating if checks passed
3. If checks fail, fix the issues and push again

### 3. Code Quality Standards

- **ESLint**: Follows Next.js recommended rules
- **TypeScript**: Strict type checking enabled
- **Prettier**: Consistent code formatting (if configured)

## Troubleshooting

### Pre-commit Hook Not Working

1. Ensure husky is installed: `yarn add -D husky`
2. Run `yarn prepare` to initialize husky
3. Check file permissions: `chmod +x .husky/pre-commit`
4. Verify the hook file exists: `.husky/pre-commit`

### GitHub Workflow Not Triggering

1. Check the workflow file exists: `.github/workflows/lint-check.yml`
2. Ensure the workflow is committed to the repository
3. Check GitHub Actions tab for workflow runs
4. Verify branch names match (`main`, `develop`)

### Linting Errors

1. Run `yarn lint` to see all errors
2. Fix errors according to ESLint rules
3. Use `yarn lint --fix` to auto-fix some issues
4. Check ESLint configuration in `eslint.config.mjs`

### TypeScript Errors

1. Run `yarn type-check` to see type errors
2. Fix type issues in your code
3. Check `tsconfig.json` for configuration
4. Ensure all imports and exports are properly typed

## Best Practices

1. **Always run checks locally** before pushing
2. **Fix linting errors** as you code, don't wait until commit
3. **Keep TypeScript strict** - don't use `any` unless absolutely necessary
4. **Test your changes** before creating PRs
5. **Review workflow results** on GitHub before merging

## Configuration Files

- **ESLint**: `eslint.config.mjs`
- **TypeScript**: `tsconfig.json`
- **Husky**: `.husky/pre-commit`
- **GitHub Workflow**: `.github/workflows/lint-check.yml`
- **Package Scripts**: `package.json` scripts section
