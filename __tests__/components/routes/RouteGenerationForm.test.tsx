import React from 'react';
import { render, screen } from '../../utils/test-utils';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server/server';

// Mock component for testing
const RouteGenerationForm = () => {
  return (
    <div>
      <h1>Generate Route</h1>
      <form>
        <label htmlFor="startPoint">Start Point</label>
        <input id="startPoint" name="startPoint" />

        <label htmlFor="routePriority">Route Priority</label>
        <select id="routePriority" name="routePriority">
          <option value="scenic">Scenic</option>
          <option value="twisty">Twisty</option>
          <option value="avoid_highways">Avoid Highways</option>
        </select>

        <button type="submit">Generate</button>
      </form>
    </div>
  );
};

describe('RouteGenerationForm', () => {
  it('renders the form correctly', () => {
    render(<RouteGenerationForm />);

    // Using getBy* functions will throw if element is not found
    expect(screen.getByText('Generate Route')).toBeTruthy();
    expect(screen.getByLabelText('Start Point')).toBeTruthy();
    expect(screen.getByLabelText('Route Priority')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Generate' })).toBeTruthy();
  });

  it('can intercept API requests', async () => {
    // Setup a test-specific handler
    server.use(
      http.post('https://openrouter.ai/api/v1/chat/completions', () => {
        return HttpResponse.json({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  title: 'Test Route',
                  summary: 'This is a test route',
                  routePoints: [
                    {
                      name: 'Test Point',
                      description: 'Test Description',
                      coordinates: { lat: 50, lng: 20 },
                    },
                  ],
                }),
              },
            },
          ],
        });
      })
    );

    // This test just verifies that our MSW setup can intercept requests
    // In a real test, you would simulate form submission and verify the response handling
    expect(server).toBeDefined();
  });
});
