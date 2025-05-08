import React, { useState } from 'react';
import { render, screen, fireEvent, waitFor } from '../../utils/test-utils';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server/server';
import type { RouteGenerationResult } from '../../../lib/ai/openrouter-service';

// Mock component with actual form submission functionality
const RouteGenerationForm = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RouteGenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const startPoint = formData.get('startPoint') as string;
    const routePriority = formData.get('routePriority') as 'scenic' | 'twisty' | 'avoid_highways';
    const distance = Number(formData.get('distance'));

    try {
      // Simulating a fetch request that will be intercepted by MSW
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer test-key`,
        },
        body: JSON.stringify({
          model: 'test-model',
          messages: [
            {
              role: 'user',
              content: `Generate route from ${startPoint} with priority ${routePriority} and distance ${distance}`,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate route');
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No content received');
      }

      // Parse the content as JSON
      const parsedRoute = JSON.parse(content);
      setResult(parsedRoute);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Generate Route</h1>
      {error && (
        <div role="alert" className="error">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="startPoint">Start Point</label>
          <input id="startPoint" name="startPoint" required />
        </div>

        <div>
          <label htmlFor="routePriority">Route Priority</label>
          <select id="routePriority" name="routePriority" required>
            <option value="scenic">Scenic</option>
            <option value="twisty">Twisty</option>
            <option value="avoid_highways">Avoid Highways</option>
          </select>
        </div>

        <div>
          <label htmlFor="distance">Distance (km)</label>
          <input id="distance" name="distance" type="number" required min="1" />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </form>

      {result && (
        <div data-testid="route-result">
          <h2>{result.title}</h2>
          <p>{result.summary}</p>
          <h3>Route Points:</h3>
          <ul>
            {result.routePoints.map((point, index) => (
              <li key={index}>
                <strong>{point.name}</strong>: {point.description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

describe('RouteGenerationForm', () => {
  it('renders the form correctly', () => {
    render(<RouteGenerationForm />);

    expect(screen.getByText('Generate Route')).toBeTruthy();
    expect(screen.getByLabelText('Start Point')).toBeTruthy();
    expect(screen.getByLabelText('Route Priority')).toBeTruthy();
    expect(screen.getByLabelText('Distance (km)')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Generate' })).toBeTruthy();
  });

  it('handles form submission and displays the generated route', async () => {
    render(<RouteGenerationForm />);

    // Fill the form
    fireEvent.change(screen.getByLabelText('Start Point'), {
      target: { value: 'Warsaw' },
    });

    fireEvent.change(screen.getByLabelText('Route Priority'), {
      target: { value: 'scenic' },
    });

    fireEvent.change(screen.getByLabelText('Distance (km)'), {
      target: { value: '200' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Generate' }));

    // Wait for the loading state
    expect(screen.getByRole('button', { name: 'Generating...' })).toBeTruthy();

    // Wait for the result to be displayed
    await waitFor(() => {
      expect(screen.getByTestId('route-result')).toBeTruthy();
    });

    // Verify the result content
    expect(screen.getByText('Beautiful Mountain Ride from Warsaw')).toBeTruthy();
    expect(screen.getByText('Route Points:')).toBeTruthy();
    expect(screen.getByText(/Starting point in the heart of Warsaw/)).toBeTruthy();
  });

  it('displays error message when route generation fails', async () => {
    // Override the default handler for this test
    server.use(
      http.post('https://openrouter.ai/api/v1/chat/completions', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    render(<RouteGenerationForm />);

    // Fill the form
    fireEvent.change(screen.getByLabelText('Start Point'), {
      target: { value: 'Warsaw' },
    });

    fireEvent.change(screen.getByLabelText('Distance (km)'), {
      target: { value: '200' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Generate' }));

    // Wait for the error message to be displayed
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeTruthy();
    });

    expect(screen.getByText('Failed to generate route')).toBeTruthy();
  });

  it('handles invalid response format', async () => {
    // Override the default handler to return invalid JSON
    server.use(
      http.post('https://openrouter.ai/api/v1/chat/completions', () => {
        return HttpResponse.json({
          choices: [
            {
              message: {
                content: 'This is not valid JSON',
              },
            },
          ],
        });
      })
    );

    render(<RouteGenerationForm />);

    // Fill and submit the form
    fireEvent.change(screen.getByLabelText('Start Point'), {
      target: { value: 'Warsaw' },
    });

    fireEvent.change(screen.getByLabelText('Distance (km)'), {
      target: { value: '200' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Generate' }));

    // Wait for the error message
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeTruthy();
    });

    // The error should be related to JSON parsing
    expect(screen.getByText(/unexpected token/i, { exact: false })).toBeTruthy();
  });
});
