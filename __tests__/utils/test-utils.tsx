import React, { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Create a wrapper with all providers that components might need
interface AllProvidersProps {
  children: ReactNode;
}

function AllProviders({ children }: AllProvidersProps) {
  return (
    <>
      {/* Add any providers here that components need, e.g., ThemeProvider, etc. */}
      {children}
    </>
  );
}

// Function to create a custom render with all app providers
export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  // Return an object with the user-event instance and all of RTL's query functions
  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: AllProviders, ...options }),
  };
}

// Re-export everything from React Testing Library
export * from '@testing-library/react';

// Override render method
export { renderWithProviders as render };
