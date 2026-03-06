function Dashboard({ t, lang, lessons, completedCount, onContinueLesson }) {
  const progress = Math.round((completedCount / lessons.length) * 100);

  return (
    <section className="panel dashboard">
      <div className="section-head">
        <h2>{t.dashboardTitle}</h2>
        <p>{t.dashboardSub}</p>
      </div>

      <div className="progress-meter" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}>
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <p className="progress-label">{t.progressLabel}: {progress}%</p>

      <div className="course-grid compact">
        {lessons.map((lesson) => (
          <article key={lesson.id} className="course-card compact">
            <h3>{lesson.title[lang]}</h3>
            <p>
              {t.duration}: {lesson.durationMinutes} {t.minutes}
            </p>
            <button className="action ghost" onClick={() => onContinueLesson(lesson.id)}>
              {t.continueLabel}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Dashboard;
