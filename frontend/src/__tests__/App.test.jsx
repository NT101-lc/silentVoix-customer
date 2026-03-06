import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { copy } from '../data/content';

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('toggles light/dark theme, flips theme label, and persists the choice', async () => {
    render(<App />);

    const appNode = document.querySelector('.app');
    const themeToggle = screen.getByRole('button', { name: copy.en.themeDark });
    const topGlow = document.querySelector('.bg-glow-top');

    expect(appNode).toHaveClass('theme-light');
    expect(topGlow).toBeInTheDocument();
    expect(document.querySelector('.app.theme-light .bg-glow-top')).toBeInTheDocument();

    fireEvent.click(themeToggle);

    await waitFor(() => {
      expect(appNode).toHaveClass('theme-dark');
      expect(window.localStorage.getItem('silentvoix-theme')).toBe('dark');
      expect(screen.getByRole('button', { name: copy.en.themeLight })).toBeInTheDocument();
      expect(document.querySelector('.app.theme-dark .bg-glow-top')).toBeInTheDocument();
    });
  });

  it('uses saved theme from localStorage on first render', () => {
    window.localStorage.setItem('silentvoix-theme', 'dark');

    render(<App />);

    const appNode = document.querySelector('.app');
    expect(appNode).toHaveClass('theme-dark');
    expect(screen.getByRole('button', { name: copy.en.themeLight })).toBeInTheDocument();
  });

  it('falls back to system dark mode when no saved theme exists', () => {
    vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false
    }));

    render(<App />);

    const appNode = document.querySelector('.app');
    expect(appNode).toHaveClass('theme-dark');
  });

  it('changes language from English to Vietnamese', () => {
    render(<App />);

    fireEvent.change(screen.getByDisplayValue('English'), { target: { value: 'vi' } });
    expect(screen.getByRole('heading', { name: copy.vi.catalogTitle })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: copy.vi.themeDark })).toBeInTheDocument();
  });
});
