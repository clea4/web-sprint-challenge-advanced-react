import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AppFunctional from './AppFunctional'; // Adjust path as needed


// Mocking the fetch API
beforeAll(() => {
  global.fetch = jest.fn((url, options) => 
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          message: 'Success!', // Simulated API response
        }),
    })
  );
});

afterAll(() => {
  global.fetch.mockClear();
});

test('sanity check', () => {
  expect(true).toBe(true);
});

test('renders the AppFunctional component', () => {
  render(<AppFunctional />);
  expect(screen.getByText(/coordinates/i)).toBeInTheDocument();
});

test('renders initial state correctly', () => {
  render(<AppFunctional />);
  expect(screen.getByText(/coordinates \(2, 2\)/i)).toBeInTheDocument();
  expect(screen.getByText(/you moved 0 times/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/type email/i)).toBeInTheDocument();
});

test('updates coordinates and steps on movement', () => {
  render(<AppFunctional />);
  fireEvent.click(screen.getByText(/up/i));
  expect(screen.getByText(/coordinates \(2, 1\)/i)).toBeInTheDocument();
  expect(screen.getByText(/you moved 1 time/i)).toBeInTheDocument();
});

test('displays a message when trying to move out of bounds', () => {
  render(<AppFunctional />);
  fireEvent.click(screen.getByText(/up/i));
  fireEvent.click(screen.getByText(/up/i)); // Out of bounds
  expect(screen.getByText(/you can't go up/i)).toBeInTheDocument();
});

test('resets state on reset button click', () => {
  render(<AppFunctional />);
  fireEvent.click(screen.getByText(/up/i));
  fireEvent.click(screen.getByText(/reset/i));
  expect(screen.getByText(/coordinates \(2, 2\)/i)).toBeInTheDocument();
  expect(screen.getByText(/you moved 0 times/i)).toBeInTheDocument();
});

test('displays error message when email is empty', () => {
  render(<AppFunctional />);
  fireEvent.click(screen.getByText(/submit/i));
  expect(screen.getByText(/email is required/i)).toBeInTheDocument();
});

test('submits form and shows success message', async () => {
  render(<AppFunctional />);
  fireEvent.change(screen.getByPlaceholderText(/type email/i), {
    target: { value: 'test@example.com' },
  });
  fireEvent.click(screen.getByText(/submit/i));
  expect(await screen.findByText(/success/i)).toBeInTheDocument();
});

test("displays 'time' for singular steps", () => {
  render(<AppFunctional />);
  fireEvent.click(screen.getByText(/up/i));
  expect(screen.getByText(/you moved 1 time/i)).toBeInTheDocument();
});

