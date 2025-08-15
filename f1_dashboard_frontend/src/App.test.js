import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app shell', () => {
  render(<App />);
  const shellElement = screen.getByText(/A modern F1 dashboard/i);
  expect(shellElement).toBeInTheDocument();
});
