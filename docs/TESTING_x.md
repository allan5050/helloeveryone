# Testing Guide

This document provides comprehensive instructions for running and maintaining tests in the
HelloEveryone project.

## Test Structure

```
tests/                          # Legacy test files (being updated)
├── __tests__/                 # Main test directory for existing features
│   ├── privacy.test.ts
│   ├── matching.test.ts
│   ├── rsvp.test.ts
│   ├── favorites.test.ts
│   ├── chat.test.tsx
│   └── calendar.test.ts
├── e2e/                       # Playwright end-to-end tests
│   └── user-journey.spec.ts
└── integration/               # Integration tests

__tests__/                     # New test structure for components
├── app/
│   └── page.test.tsx          # Landing page tests
└── components/
    └── landing/
        └── LandingClient.test.tsx  # Landing components tests
```

## Prerequisites

Ensure you have the following installed:

- Node.js 18+
- npm or yarn package manager
- All project dependencies: `npm install`

## Test Commands

### Unit Tests (Jest)

```bash
# Run all Jest tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- privacy.test.ts

# Run tests matching pattern
npm test -- --testPathPattern="landing"
```

### End-to-End Tests (Playwright)

```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests in headed mode
npm run test:e2e -- --headed

# Run specific E2E test
npx playwright test user-journey.spec.ts
```

### Integration Tests

```bash
# Run integration tests
npm run test:integration
```

## Test Configuration

### Jest Configuration (`jest.config.js`)

The project uses Next.js Jest configuration with the following key settings:

- **Test Environment**: `jsdom` for React component testing
- **Module Resolution**: Path aliases (`@/` maps to project root)
- **Coverage Threshold**: 70% for statements, branches, functions, and lines
- **Setup Files**: `jest.setup.js` for global test configuration

### Environment Variables

Tests require these environment variables (set in `jest.setup.js`):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://test.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=test-anon-key
```

## Writing Tests

### Component Tests

For React components, follow this pattern:

```typescript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ComponentName from '@/components/ComponentName';

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('handles user interactions', () => {
    render(<ComponentName />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Updated Text')).toBeInTheDocument();
  });
});
```

### API/Logic Tests

For business logic and API functions:

```typescript
import { functionToTest } from '@/lib/module'

describe('functionToTest', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns expected result for valid input', async () => {
    const result = await functionToTest('valid-input')
    expect(result.success).toBe(true)
    expect(result.data).toEqual(expectedData)
  })
})
```

## Mock Strategies

### Supabase Client

```typescript
jest.mock('@supabase/supabase-js')
const mockSupabase = {
  from: jest.fn(),
  auth: { getUser: jest.fn() },
  rpc: jest.fn(),
}
;(createClient as jest.MockedFunction<typeof createClient>).mockReturnValue(mockSupabase as any)
```

### Next.js Router

```typescript
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/current-path',
  }),
}))
```

### External Components

```typescript
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));
```

## Test Coverage

### Current Status

- **Overall Coverage**: ~7% (needs improvement)
- **Target Coverage**: 70% minimum
- **Critical Areas**: Landing page components, authentication, matching algorithm

### Coverage Reports

```bash
# Generate detailed coverage report
npm test -- --coverage --coverageReporters=html

# View coverage in browser
open coverage/lcov-report/index.html
```

## Manual Testing Checklist

### Landing Page

- [ ] Hero section displays correctly
- [ ] Navigation links work (smooth scroll)
- [ ] Feature cards have hover animations
- [ ] Testimonials display with star ratings
- [ ] FAQ accordion expands/collapses
- [ ] CTA buttons link to correct pages
- [ ] Footer links are functional
- [ ] Mobile responsive design

### User Authentication

- [ ] Login page loads correctly
- [ ] Registration form validates inputs
- [ ] Password reset functionality
- [ ] Protected routes redirect correctly
- [ ] User session persists correctly

### Core Features

- [ ] Event browsing and filtering
- [ ] RSVP functionality
- [ ] Matching algorithm results
- [ ] Chat messaging
- [ ] Calendar integration
- [ ] Profile management

## Debugging Tests

### Common Issues

1. **Module Not Found Errors**

   ```bash
   # Clear Jest cache
   npx jest --clearCache

   # Check path aliases in jest.config.js
   ```

2. **Async Test Failures**

   ```typescript
   // Always await async operations
   await waitFor(() => {
     expect(screen.getByText('Loading')).toBeInTheDocument()
   })
   ```

3. **Mock Issues**
   ```typescript
   // Clear mocks between tests
   beforeEach(() => {
     jest.clearAllMocks()
   })
   ```

### Debug Mode

```bash
# Run tests with debugging
npm test -- --verbose --no-cache

# Debug specific test
node --inspect-brk node_modules/.bin/jest --runInBand specific-test.test.ts
```

## Continuous Integration

### GitHub Actions

The project should include automated testing in CI:

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm test -- --coverage
      - run: npm run test:e2e
```

## Performance Testing

### Load Testing

```bash
# Install k6 for performance testing
npm install -g k6

# Run performance tests
k6 run tests/performance/load-test.js
```

## Contributing to Tests

### Before Submitting PR

1. Ensure all existing tests pass
2. Add tests for new features
3. Maintain minimum 70% coverage
4. Follow established testing patterns
5. Update this documentation if needed

### Test Naming Convention

```
describe('Feature/Component Name', () => {
  describe('Specific Functionality', () => {
    it('should do something specific when condition', () => {
      // Test implementation
    });
  });
});
```

## Troubleshooting

### Common Test Failures

1. **Syntax Errors**: Check for proper TypeScript imports
2. **Mock Issues**: Ensure mocks are properly configured
3. **Async Issues**: Use proper async/await patterns
4. **Environment Issues**: Verify environment variables are set

### Getting Help

- Check Jest documentation: https://jestjs.io/docs/
- Review Testing Library guides: https://testing-library.com/
- Consult Playwright docs: https://playwright.dev/

## Test Maintenance

### Regular Tasks

- [ ] Review and update failing tests monthly
- [ ] Improve coverage for critical paths
- [ ] Update mocks when APIs change
- [ ] Refactor duplicate test code
- [ ] Archive obsolete tests

### Performance Monitoring

- Monitor test execution time
- Optimize slow tests
- Parallelize test suites where possible
- Keep test database lightweight
