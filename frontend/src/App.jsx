import { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';

const copy = {
  en: {
    brand: 'SilentVoix',
    navLessons: 'Lessons',
    navStudio: 'Studio',
    navProgress: 'Progress',
    heroTitle: 'Train Customer Sign Language With Confidence',
    heroSubtitle:
      'A modern practice space for customer teams to learn sign language with guided lessons and live camera feedback.',
    heroStatOne: 'Hands-on lessons',
    heroStatTwo: 'EN / VI learning mode',
    heroStatThree: 'Live mirror camera practice',
    lessonsTitle: 'Lesson Library',
    lessonsSub: 'Start with essentials for real customer conversations.',
    level: 'Level',
    duration: 'Duration',
    minutes: 'min',
    studioTitle: 'Practice Studio',
    studioSub: 'Watch the lesson and mirror the signs in your camera.',
    lessonVideo: 'Lesson Video',
    speed: 'Speed',
    cameraTitle: 'Your Camera',
    cameraHelp: 'Allow camera access and keep your hands + face in frame.',
    cameraOn: 'Enable Camera',
    cameraOff: 'Turn Off Camera',
    tipsTitle: 'Coach Tips',
    tip1: 'Keep your shoulders visible for clearer gestures.',
    tip2: 'Repeat each sign slowly before increasing playback speed.',
    tip3: 'Use pauses to compare your hand shape with the tutor.',
    footer: 'UI/UX Prototype Only - Backend comes next.'
  },
  vi: {
    brand: 'SilentVoix',
    navLessons: 'Bai hoc',
    navStudio: 'Phong tap',
    navProgress: 'Tien do',
    heroTitle: 'Luyen Sign Language Cho Cham Soc Khach Hang',
    heroSubtitle:
      'Khong gian hoc hien dai cho doi ngu khach hang voi bai hoc huong dan va camera thuc hanh truc tiep.',
    heroStatOne: 'Bai hoc thuc hanh',
    heroStatTwo: 'Che do EN / VI',
    heroStatThree: 'Tap voi camera guong',
    lessonsTitle: 'Thu Vien Bai Hoc',
    lessonsSub: 'Bat dau voi cac tinh huong giao tiep khach hang co ban.',
    level: 'Cap do',
    duration: 'Thoi luong',
    minutes: 'phut',
    studioTitle: 'Phong Tap',
    studioSub: 'Xem video bai hoc va tap theo bang camera cua ban.',
    lessonVideo: 'Video Bai Hoc',
    speed: 'Toc do',
    cameraTitle: 'Camera Cua Ban',
    cameraHelp: 'Cho phep camera va giu ro tay + khuon mat trong khung.',
    cameraOn: 'Bat Camera',
    cameraOff: 'Tat Camera',
    tipsTitle: 'Meo Luyen Tap',
    tip1: 'Giup thay ro dong tac bang cach de lo phan vai.',
    tip2: 'Tap cham truoc, sau do moi tang toc do video.',
    tip3: 'Dung tam dung de so sanh dang tay voi giao vien.',
    footer: 'Day la ban UI/UX, backend se lam sau.'
  }
};

const lessons = [
  {
    id: 1,
    level: 'Beginner',
    durationMinutes: 8,
    title: {
      en: 'Greeting Customers',
      vi: 'Chao Hoi Khach Hang'
    },
    description: {
      en: 'Learn hello, welcome, and thank you signs for front-desk interactions.',
      vi: 'Hoc cac ky hieu xin chao, chao mung va cam on cho quay tiep tan.'
    },
    videoUrl: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4'
  },
  {
    id: 2,
    level: 'Intermediate',
    durationMinutes: 12,
    title: {
      en: 'Support Questions',
      vi: 'Hoi Dap Ho Tro'
    },
    description: {
      en: 'Practice signs for asking needs, clarifying requests, and confirming understanding.',
      vi: 'Luyen ky hieu de hoi nhu cau, lam ro yeu cau va xac nhan thong tin.'
    },
    videoUrl: 'https://samplelib.com/lib/preview/mp4/sample-10s.mp4'
  },
  {
    id: 3,
    level: 'Advanced',
    durationMinutes: 15,
    title: {
      en: 'Order Confirmation Flow',
      vi: 'Quy Trinh Xac Nhan Don'
    },
    description: {
      en: 'Advanced lesson for product confirmation, quantity, and payment communication.',
      vi: 'Bai hoc nang cao cho xac nhan san pham, so luong va thanh toan.'
    },
    videoUrl: 'https://samplelib.com/lib/preview/mp4/sample-15s.mp4'
  }
];

function App() {
  const [lang, setLang] = useState('en');
  const [activeLessonId, setActiveLessonId] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const cameraRef = useRef(null);
  const lessonVideoRef = useRef(null);
  const streamRef = useRef(null);

  const t = useMemo(() => copy[lang], [lang]);
  const activeLesson = lessons.find((lesson) => lesson.id === activeLessonId) || lessons[0];

  useEffect(() => {
    if (lessonVideoRef.current) {
      lessonVideoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate, activeLessonId]);

  async function enableCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });
      streamRef.current = stream;
      if (cameraRef.current) {
        cameraRef.current.srcObject = stream;
      }
      setCameraEnabled(true);
    } catch (error) {
      console.error('Unable to access camera:', error);
    }
  }

  function disableCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (cameraRef.current) {
      cameraRef.current.srcObject = null;
    }
    setCameraEnabled(false);
  }

  useEffect(() => {
    return () => {
      disableCamera();
    };
  }, []);

  return (
    <div className="app">
      <div className="bg-glow bg-glow-top" />
      <div className="bg-glow bg-glow-bottom" />

      <header className="topbar">
        <div className="brand">
          <span className="brand-dot" />
          {t.brand}
        </div>

        <nav className="nav">
          <a href="#lessons">{t.navLessons}</a>
          <a href="#studio">{t.navStudio}</a>
          <a href="#progress">{t.navProgress}</a>
        </nav>

        <select value={lang} onChange={(event) => setLang(event.target.value)} className="lang-select">
          <option value="en">English</option>
          <option value="vi">Tieng Viet</option>
        </select>
      </header>

      <section className="hero">
        <h1>{t.heroTitle}</h1>
        <p>{t.heroSubtitle}</p>
        <div className="hero-stats">
          <span>{t.heroStatOne}</span>
          <span>{t.heroStatTwo}</span>
          <span>{t.heroStatThree}</span>
        </div>
      </section>

      <section className="content" id="lessons">
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
                  onClick={() => setActiveLessonId(lesson.id)}
                >
                  <div className="lesson-head">
                    <h3>{lesson.title[lang]}</h3>
                    <span>{lesson.level}</span>
                  </div>
                  <p>{lesson.description[lang]}</p>
                  <div className="lesson-meta">
                    <span>{t.level}: {lesson.level}</span>
                    <span>{t.duration}: {lesson.durationMinutes} {t.minutes}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </article>

        <article className="panel studio" id="studio">
          <div className="section-head">
            <h2>{t.studioTitle}</h2>
            <p>{t.studioSub}</p>
          </div>

          <div className="studio-grid">
            <div className="video-card">
              <div className="card-head">
                <h3>{t.lessonVideo}</h3>
                <label className="speed">
                  {t.speed}
                  <select value={playbackRate} onChange={(event) => setPlaybackRate(Number(event.target.value))}>
                    <option value={0.5}>0.5x</option>
                    <option value={0.75}>0.75x</option>
                    <option value={1}>1.0x</option>
                    <option value={1.25}>1.25x</option>
                    <option value={1.5}>1.5x</option>
                  </select>
                </label>
              </div>
              <video key={activeLesson.id} ref={lessonVideoRef} className="media" controls src={activeLesson.videoUrl} />
            </div>

            <div className="video-card">
              <div className="card-head">
                <h3>{t.cameraTitle}</h3>
              </div>
              <video ref={cameraRef} className="media mirror" autoPlay muted playsInline />
              <p className="camera-help">{t.cameraHelp}</p>
              {cameraEnabled ? (
                <button className="action danger" onClick={disableCamera}>
                  {t.cameraOff}
                </button>
              ) : (
                <button className="action" onClick={enableCamera}>
                  {t.cameraOn}
                </button>
              )}
            </div>
          </div>

          <div className="tips" id="progress">
            <h3>{t.tipsTitle}</h3>
            <ul>
              <li>{t.tip1}</li>
              <li>{t.tip2}</li>
              <li>{t.tip3}</li>
            </ul>
          </div>
        </article>
      </section>

      <footer className="footer">{t.footer}</footer>
    </div>
  );
}

export default App;
