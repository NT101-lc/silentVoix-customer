function CourseCatalog({ t, lang, lessons, onOpenCourse, onStartLearning }) {
  return (
    <section className="panel catalog">
      <div className="section-head">
        <h2>{t.catalogTitle}</h2>
        <p>{t.catalogSub}</p>
      </div>

      <div className="course-grid">
        {lessons.map((lesson) => (
          <article key={lesson.id} className="course-card">
            <span className="course-level">{lesson.level}</span>
            <h3>{lesson.title[lang]}</h3>
            <p>{lesson.description[lang]}</p>
            <div className="course-meta">
              <span>
                {t.duration}: {lesson.durationMinutes} {t.minutes}
              </span>
            </div>
            <div className="course-actions">
              <button className="action ghost" onClick={() => onOpenCourse(lesson.id)}>
                {t.viewCourse}
              </button>
              <button className="action" onClick={() => onStartLearning(lesson.id)}>
                {t.startLearning}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default CourseCatalog;
