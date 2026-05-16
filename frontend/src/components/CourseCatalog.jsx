import { visualAssets } from '../data/content';

function CourseCatalog({ t, lang, lessons, onOpenCourse, onStartLearning }) {
  const getBentoClass = (id) => {
    const classes = {
      1: 'featured',
      2: 'tall',
      3: 'wide'
    };
    return classes[id] || '';
  };

  return (
    <section className="panel catalog">
      <div className="section-head">
        <h2>{t.catalogTitle}</h2>
        <p>{t.catalogSub}</p>
      </div>

      <div className="course-grid bento">
        {lessons.map((lesson) => (
          <article
            key={lesson.id}
            className={`course-card ${getBentoClass(lesson.id)}`}
          >
            <div className="course-thumbnail">
              <img className="course-image" src={visualAssets.lessons[lesson.id]} alt={t.courseImageAlt} />
              <div className="thumbnail-gradient" />
            </div>
            <div className="course-badge">{lesson.level}</div>

            <div className="course-content">
              <h3>{lesson.title[lang]}</h3>
              <div className="lesson-signs course-signs">
                {(lesson.signs || []).slice(0, 3).map((sign) => (
                  <span key={sign.label.en}>{sign.label[lang]}</span>
                ))}
              </div>

              <div className="course-footer">
                <div className="course-meta-inline">
                  <span>{lesson.durationMinutes} {t.minutes}</span>
                  <span>{(lesson.signs || []).length} {t.signsCount}</span>
                </div>
                <button
                  className="action compact-action ghost"
                  onClick={() => onOpenCourse(lesson.id)}
                >
                  {t.viewCourse}
                </button>
                <button
                  className="action compact-action"
                  onClick={(e) => {
                    onStartLearning(lesson.id);
                  }}
                >
                  {t.startLearning}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default CourseCatalog;
