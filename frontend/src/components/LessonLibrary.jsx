function LessonLibrary({ t, lang, lessons, activeLessonId, onLessonSelect }) {
  return (
    <article className="panel lessons">
      <div className="section-head">
        <h2>{t.lessonsTitle}</h2>
        <p>{t.lessonsSub}</p>
      </div>

      <div className="lesson-list">
        {lessons.map((lesson) => {
          const isActive = lesson.id === activeLessonId;
          return (
            <button
              key={lesson.id}
              className={`lesson-card ${isActive ? 'active' : ''}`}
              onClick={() => onLessonSelect(lesson.id)}
            >
              <div className="lesson-head">
                <h3>{lesson.title[lang]}</h3>
                <span>{lesson.level}</span>
              </div>
              <p>{lesson.description[lang]}</p>
              <div className="lesson-meta">
                <span>
                  {t.level}: {lesson.level}
                </span>
                <span>
                  {t.duration}: {lesson.durationMinutes} {t.minutes}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </article>
  );
}

export default LessonLibrary;
