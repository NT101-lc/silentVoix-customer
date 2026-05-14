import { visualAssets } from '../data/content';

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
            <div className="course-image-wrap">
              <img className="course-image" src={visualAssets.lessons[lesson.id]} alt="" />
              <span className="course-level">{lesson.level}</span>
            </div>
            <h3>{lesson.title[lang]}</h3>
            <div className="course-meta">
              <span>
                {t.duration}: {lesson.durationMinutes} {t.minutes}
              </span>
              <span>
                {(lesson.signs || []).length} {t.signsCount}
              </span>
            </div>
            <div className="lesson-signs">
              {(lesson.signs || []).slice(0, 3).map((sign) => (
                <span key={sign.label.en}>{sign.label[lang]}</span>
              ))}
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
