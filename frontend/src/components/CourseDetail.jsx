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
      <div className="section-head">
        <h2>{lesson.title[lang]}</h2>
        <p>{lesson.description[lang]}</p>
      </div>

      <div className="detail-meta">
        <span>{t.level}: {lesson.level}</span>
        <span>{t.duration}: {lesson.durationMinutes} {t.minutes}</span>
      </div>

      <div className="detail-about">
        <h3>{t.whatYouLearn}</h3>
        <ul>
          <li>{t.learnBulletOne}</li>
          <li>{t.learnBulletTwo}</li>
          <li>{t.learnBulletThree}</li>
        </ul>
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
