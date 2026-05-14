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

      <div className="course-grid">
        {lessons.map((lesson) => (
          <article 
            key={lesson.id} 
            className="course-card"
            onClick={() => onContinueLesson(lesson.id)}
            style={{ cursor: 'pointer' }}
          >
            <div className="course-thumbnail" style={{ aspectRatio: '2/1' }}>
              <div className="thumbnail-gradient" />
            </div>
            <div className="course-content">
              <h3>{lesson.title[lang]}</h3>
              <div className="course-footer">
                <div className="course-meta-inline">
                  <span>⏱️ {lesson.durationMinutes} {t.minutes}</span>
                </div>
                <button 
                  className="action compact-action ghost" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onContinueLesson(lesson.id);
                  }}
                >
                  {t.continueLabel}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Dashboard;
