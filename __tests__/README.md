# 10xBikeTravels Testing Setup

This directory contains the test setup for the 10xBikeTravels application. The testing infrastructure is built using:

- **Jest**: The primary testing framework
- **React Testing Library**: For testing React components
- **MSW (Mock Service Worker)**: For mocking API responses without making real network requests

## Structure

- `__tests__/mocks/`: Contains mock handlers and server setup for MSW
  - `handlers/`: API mock handlers (OpenRouter API mocks)
  - `server/`: MSW server setup
- `__tests__/utils/`: Testing utilities
  - `test-utils.tsx`: Custom render function with providers
- `jest.config.js`: Jest configuration
- `jest.setup.js`: Jest setup file
- `jest.polyfills.js`: Polyfills for web APIs in Node.js environment

## Running Tests

```
npm test               # Run all tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Run tests with coverage report
```

## Writing Tests

### API Service Tests

Tests for API services should focus on request formatting, response handling, and error cases:

```typescript
import { OpenRouterService } from '../../../lib/ai/openrouter-service';

describe('OpenRouterService', () => {
  it('should generate a route successfully', async () => {
    // Test implementation
  });
});
```

### Component Tests

Component tests should render the component and test user interactions:

```typescript
import { render, screen } from '../../utils/test-utils';

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component />);
    expect(screen.getByText('Some text')).toBeTruthy();
  });
});
```

### Mocking API Requests

Use MSW to intercept network requests:

```typescript
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server/server';

// Setup a test-specific handler
server.use(
  http.post('https://api.example.com', () => {
    return HttpResponse.json({ data: 'mocked response' });
  })
);
```

## Notes

- MSW is configured to intercept all requests in testing environments.
- Jest is configured to use the JSDOM environment for component tests.
- Polyfills are provided for web APIs not available in Node.js/JSDOM.
