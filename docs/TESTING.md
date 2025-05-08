# Testing Guidelines for 10xBikeTravels

This document provides an overview of the testing approach, technologies used, and best practices for testing the 10xBikeTravels application.

## Table of Contents

- [Testing Technologies](#testing-technologies)
- [Test Structure](#test-structure)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Mocking](#mocking)
- [Coverage Requirements](#coverage-requirements)

## Testing Technologies

- **Jest**: Core testing framework for running tests and assertions
- **React Testing Library**: For testing React components focusing on user interactions
- **MSW (Mock Service Worker)**: For mocking API requests at the network level
- **Testing Utilities**: Custom utilities for test setup and providers

## Test Structure

```
__tests__/
├── components/        # Tests for React components
│   ├── auth/          # Authentication components tests
│   ├── common/        # Common components tests
│   ├── routes/        # Route-related components tests
│   └── ...
├── lib/               # Tests for service modules
│   ├── ai/            # AI services tests
│   └── ...
├── mocks/             # MSW mocks setup
│   ├── handlers/      # API handlers for mocking
│   └── server/        # MSW server configuration
└── utils/             # Testing utilities
    └── test-utils.tsx # Common testing utilities
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (useful during development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npm test -- path/to/test.ts

# Run tests matching a pattern
npm test -- -t "pattern"
```

## Writing Tests

### Component Tests

For testing React components, use the custom render function from test utilities:

```typescript
import { render, screen, fireEvent } from '../../utils/test-utils';
import YourComponent from '../../../components/YourComponent';

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent />);
    expect(screen.getByText('Expected Text')).toBeTruthy();
  });

  it('handles user interactions', async () => {
    render(<YourComponent />);
    fireEvent.click(screen.getByRole('button', { name: 'Click Me' }));
    expect(await screen.findByText('Result')).toBeTruthy();
  });
});
```

### Service Tests

For testing service modules:

```typescript
import { YourService } from '../../../lib/your-service';
import { server } from '../../mocks/server/server';
import { http, HttpResponse } from 'msw';

describe('YourService', () => {
  it('processes data correctly', async () => {
    // Arrange
    const service = new YourService();

    // Act
    const result = await service.processData();

    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('handles errors', async () => {
    // Override default MSW handler to simulate error
    server.use(
      http.post('/api/endpoint', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    // Arrange
    const service = new YourService();

    // Act & Assert
    await expect(service.processData()).rejects.toThrow();
  });
});
```

## Mocking

### API Mocking with MSW

The app uses MSW to intercept and mock network requests. To create a new mock:

1. Add a handler in `__tests__/mocks/handlers/` directory
2. Export the handler in `__tests__/mocks/handlers/index.ts`

Example handler:

```typescript
import { http, HttpResponse } from 'msw';

export const yourApiHandlers = [
  http.get('/api/resource', () => {
    return HttpResponse.json({
      data: 'mocked response',
    });
  }),

  http.post('/api/resource', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      id: 'new-id',
      ...body,
    });
  }),
];
```

### Environment Variables

For tests requiring environment variables:

```typescript
// At the beginning of your test file
process.env.NEXT_PUBLIC_SOME_VAR = 'test-value';

// Clean up after tests
afterAll(() => {
  delete process.env.NEXT_PUBLIC_SOME_VAR;
});
```

## Coverage Requirements

- **Unit Tests**: 80% line coverage for all service modules
- **Component Tests**: All interactive components should have at least basic rendering and interaction tests
- **Integration Tests**: Key user flows should be covered with integration tests

### Excluding Code from Coverage

Code that doesn't need to be tested (configuration files, types, etc.) can be excluded in the jest.config.js file.

## Debugging Tests

If a test is failing, you can:

1. Use `console.log` statements (they will appear in the Jest output)
2. Use the `--verbose` flag with Jest to see more details
3. Use the `debug()` function from React Testing Library:

```typescript
import { render, screen } from '../../utils/test-utils';

test('debugging example', () => {
  render(<YourComponent />);
  screen.debug(); // Will print the current DOM state
});
```

## Best Practices

1. **Test User Behavior**: Focus on testing what users would do, not implementation details
2. **Isolation**: Tests should be independent and not rely on the state of other tests
3. **Descriptive Names**: Use descriptive test names that explain the expected behavior
4. **Minimal Mocking**: Mock only what's necessary to test the specific functionality
5. **Keep Tests DRY**: Use setup functions for common test setup, but prioritize readability over DRY
6. **Test Edge Cases**: Include tests for error conditions and edge cases
