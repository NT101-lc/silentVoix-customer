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
<<<<<<< HEAD
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
=======
          <article 
            key={lesson.id} 
            className={`course-card ${getBentoClass(lesson.id)}`}
            onClick={() => onOpenCourse(lesson.id)}
            style={{ cursor: 'pointer' }}
          >
            <div className="course-badge">{lesson.level}</div>
            
            <div className="course-thumbnail">
              <div className="thumbnail-gradient" />
>>>>>>> 93b3114 (new: fe visual)
            </div>

            <div className="course-content">
              <h3>{lesson.title[lang]}</h3>
              <p>{lesson.description[lang]}</p>
              
              <div className="course-footer">
                <div className="course-meta-inline">
                  <span>⏱️ {lesson.durationMinutes} {t.minutes}</span>
                  <span>🤟 {(lesson.signs || []).length} {t.signsCount}</span>
                </div>
                <button 
                  className="action compact-action" 
                  onClick={(e) => {
                    e.stopPropagation();
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
