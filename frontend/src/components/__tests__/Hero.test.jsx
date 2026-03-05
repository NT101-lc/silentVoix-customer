import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Hero from '../Hero';
import { copy } from '../../data/content';

describe('Hero', () => {
  it('renders hero title, subtitle and stats', () => {
    render(<Hero t={copy.en} />);

    expect(screen.getByRole('heading', { name: copy.en.heroTitle })).toBeInTheDocument();
    expect(screen.getByText(copy.en.heroSubtitle)).toBeInTheDocument();
    expect(screen.getByText(copy.en.heroStatOne)).toBeInTheDocument();
    expect(screen.getByText(copy.en.heroStatTwo)).toBeInTheDocument();
    expect(screen.getByText(copy.en.heroStatThree)).toBeInTheDocument();
  });
});
