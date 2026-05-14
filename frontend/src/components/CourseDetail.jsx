import { visualAssets } from '../data/content';

function CourseDetail({ t, lang, lesson, onBackToCatalog, onStartLearning }) {
  if (!lesson) {
    return (
      <section className="panel page-state">
        <h2>{t.courseNotFoundTitle}</h2>
        <p>{t.courseNotFoundSub}</p>
        <button className="action" onClick={onBackToCatalog}>
          {t.backToCourses}
        </button>
      </section>
    );
  }

  return (
    <section className="panel course-detail">
      <div className="course-detail-hero">
        <img src={visualAssets.lessons[lesson.id]} alt="" />
        <div className="section-head">
          <h2>{lesson.title[lang]}</h2>
          <p>{lesson.description[lang]}</p>
        </div>
      </div>

      <div className="detail-meta">
        <span>{t.level}: {lesson.level}</span>
        <span>{t.duration}: {lesson.durationMinutes} {t.minutes}</span>
      </div>

      <div className="detail-about">
        <h3>{t.whatYouLearn}</h3>
        <p>{lesson.script?.[lang]}</p>
        <div className="detail-sign-grid">
          {(lesson.signs || []).map((sign) => (
            <article key={sign.label.en} className="sign-preview">
              <span>{sign.label[lang]}</span>
              <p>{sign.cue[lang]}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="course-actions">
        <button className="action ghost" onClick={onBackToCatalog}>
          {t.backToCourses}
        </button>
        <button className="action" onClick={() => onStartLearning(lesson.id)}>
          {t.startLearning}
        </button>
      </div>
    </section>
  );
}

export default CourseDetail;
