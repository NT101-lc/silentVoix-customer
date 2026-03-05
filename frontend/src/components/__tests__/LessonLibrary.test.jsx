import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import LessonLibrary from '../LessonLibrary';
import { copy, lessons } from '../../data/content';

describe('LessonLibrary', () => {
  it('renders lessons with active state and selects a lesson when clicked', () => {
    const onLessonSelect = vi.fn();

    const { container } = render(
      <LessonLibrary
        t={copy.en}
        lang="en"
        lessons={lessons}
        activeLessonId={1}
        onLessonSelect={onLessonSelect}
      />
    );

    const firstLessonButton = screen.getByRole('heading', { name: lessons[0].title.en }).closest('button');
    const secondLessonButton = screen.getByRole('heading', { name: lessons[1].title.en }).closest('button');

    expect(screen.getByRole('heading', { name: copy.en.lessonsTitle })).toBeInTheDocument();
    expect(firstLessonButton).toHaveClass('active');
    expect(secondLessonButton).not.toHaveClass('active');
    expect(screen.getByText(`${copy.en.level}: ${lessons[0].level}`)).toBeInTheDocument();
    expect(screen.getByText(`${copy.en.duration}: ${lessons[0].durationMinutes} ${copy.en.minutes}`)).toBeInTheDocument();

    fireEvent.click(secondLessonButton);
    expect(onLessonSelect).toHaveBeenCalledWith(2);
    expect(onLessonSelect).toHaveBeenCalledTimes(1);

    expect(container.querySelectorAll('.lesson-card')).toHaveLength(lessons.length);
  });

  it('renders localized content when Vietnamese is selected', () => {
    render(
      <LessonLibrary
        t={copy.vi}
        lang="vi"
        lessons={lessons}
        activeLessonId={2}
        onLessonSelect={() => {}}
      />
    );

    expect(screen.getByRole('heading', { name: copy.vi.lessonsTitle })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: lessons[1].title.vi })).toBeInTheDocument();
    expect(screen.getByText(lessons[1].description.vi)).toBeInTheDocument();
    expect(screen.getByText(`${copy.vi.duration}: ${lessons[1].durationMinutes} ${copy.vi.minutes}`)).toBeInTheDocument();
  });
});
