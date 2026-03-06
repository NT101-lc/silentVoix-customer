import { useEffect, useMemo, useRef, useState } from 'react';
import Topbar from './components/Topbar';
import Hero from './components/Hero';
import LessonLibrary from './components/LessonLibrary';
import StudioPanel from './components/StudioPanel';
import CourseCatalog from './components/CourseCatalog';
import CourseDetail from './components/CourseDetail';
import Dashboard from './components/Dashboard';
import AuthPage from './components/AuthPage';
import { copy, lessons } from './data/content';
import { loginRequest, signupRequest } from './api';
import './App.css';

function getRoute(pathname) {
  const courseMatch = pathname.match(/^\/courses\/(\d+)$/);
  const learnMatch = pathname.match(/^\/learn\/(\d+)$/);

  if (pathname === '/') {
    return { name: 'home' };
  }
  if (pathname === '/courses') {
    return { name: 'courses' };
  }
  if (courseMatch) {
    return { name: 'course-detail', lessonId: Number(courseMatch[1]) };
  }
  if (learnMatch) {
    return { name: 'learn', lessonId: Number(learnMatch[1]) };
  }
  if (pathname === '/dashboard') {
    return { name: 'dashboard' };
  }
  if (pathname === '/login') {
    return { name: 'login' };
  }
  if (pathname === '/signup') {
    return { name: 'signup' };
  }
  return { name: 'not-found' };
}

function App() {
  const [lang, setLang] = useState('en');
  const [pathname, setPathname] = useState(() => window.location.pathname);
  const [theme, setTheme] = useState(() => {
    const savedTheme = window.localStorage.getItem('silentvoix-theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  const [activeLessonId, setActiveLessonId] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [auth, setAuth] = useState(() => {
    const savedAuth = window.localStorage.getItem('silentvoix-auth');
    if (!savedAuth) {
      return { token: null, user: null };
    }
    try {
      return JSON.parse(savedAuth);
    } catch {
      return { token: null, user: null };
    }
  });
  const cameraRef = useRef(null);
  const lessonVideoRef = useRef(null);
  const streamRef = useRef(null);

  const t = useMemo(() => copy[lang], [lang]);
  const route = useMemo(() => getRoute(pathname), [pathname]);
  const activeLesson = lessons.find((lesson) => lesson.id === activeLessonId) || lessons[0];

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    if (route.lessonId) {
      const matchedLesson = lessons.find((lesson) => lesson.id === route.lessonId);
      if (matchedLesson) {
        setActiveLessonId(matchedLesson.id);
      }
    }
  }, [route.lessonId]);

  useEffect(() => {
    if (lessonVideoRef.current) {
      lessonVideoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate, activeLessonId]);

  useEffect(() => {
    window.localStorage.setItem('silentvoix-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (auth?.token && auth?.user) {
      window.localStorage.setItem('silentvoix-auth', JSON.stringify(auth));
      return;
    }
    window.localStorage.removeItem('silentvoix-auth');
  }, [auth]);

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

  function toggleTheme() {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }

  function navigate(nextPath) {
    if (nextPath === pathname) {
      return;
    }
    window.history.pushState({}, '', nextPath);
    setPathname(nextPath);
  }

  function goToLearning(lessonId) {
    navigate(`/learn/${lessonId}`);
  }

  function openCourse(lessonId) {
    navigate(`/courses/${lessonId}`);
  }

  function markLessonDone(lessonId) {
    setCompletedLessons((prev) => (prev.includes(lessonId) ? prev : [...prev, lessonId]));
  }

  async function handleAuthSubmit({ fullName, email, password, mode }) {
    const payload = mode === 'signup' ? { fullName, email, password } : { email, password };
    const response = mode === 'signup' ? await signupRequest(payload) : await loginRequest(payload);
    setAuth(response);
    navigate('/dashboard');
  }

  function handleLogout() {
    setAuth({ token: null, user: null });
    navigate('/');
  }

  let pageContent = null;

  if (route.name === 'home') {
    pageContent = (
      <>
        <Hero t={t} />
        <CourseCatalog
          t={t}
          lang={lang}
          lessons={lessons.slice(0, 2)}
          onOpenCourse={openCourse}
          onStartLearning={goToLearning}
        />
      </>
    );
  }

  if (route.name === 'courses') {
    pageContent = (
      <CourseCatalog t={t} lang={lang} lessons={lessons} onOpenCourse={openCourse} onStartLearning={goToLearning} />
    );
  }

  if (route.name === 'course-detail') {
    const selectedLesson = lessons.find((lesson) => lesson.id === route.lessonId);
    pageContent = (
      <CourseDetail
        t={t}
        lang={lang}
        lesson={selectedLesson}
        onBackToCatalog={() => navigate('/courses')}
        onStartLearning={goToLearning}
      />
    );
  }

  if (route.name === 'learn') {
    pageContent = (
      <section className="content" id="learn-page">
        <LessonLibrary
          t={t}
          lang={lang}
          lessons={lessons}
          activeLessonId={activeLessonId}
          onLessonSelect={(lessonId) => {
            setActiveLessonId(lessonId);
            goToLearning(lessonId);
          }}
        />

        <StudioPanel
          t={t}
          activeLesson={activeLesson}
          playbackRate={playbackRate}
          onPlaybackRateChange={setPlaybackRate}
          lessonVideoRef={lessonVideoRef}
          cameraRef={cameraRef}
          cameraEnabled={cameraEnabled}
          onEnableCamera={enableCamera}
          onDisableCamera={disableCamera}
        />

        <div className="panel route-actions">
          <button className="action" onClick={() => markLessonDone(activeLessonId)}>
            {t.markAsDone}
          </button>
          <button className="action ghost" onClick={() => navigate('/dashboard')}>
            {t.toDashboard}
          </button>
        </div>
      </section>
    );
  }

  if (route.name === 'dashboard') {
    if (!auth.user) {
      pageContent = (
        <section className="panel page-state">
          <h2>{t.authRequiredTitle}</h2>
          <p>{t.authRequiredSub}</p>
          <button className="action" onClick={() => navigate('/login')}>
            {t.goToLogin}
          </button>
        </section>
      );
    } else {
      pageContent = (
        <Dashboard
          t={t}
          lang={lang}
          lessons={lessons}
          completedCount={completedLessons.length}
          onContinueLesson={goToLearning}
        />
      );
    }
  }

  if (route.name === 'login' || route.name === 'signup') {
    pageContent = (
      <AuthPage
        t={t}
        mode={route.name}
        onSubmit={handleAuthSubmit}
        onNavigate={navigate}
      />
    );
  }

  if (route.name === 'not-found') {
    pageContent = (
      <section className="panel page-state">
        <h2>{t.notFoundTitle}</h2>
        <p>{t.notFoundSub}</p>
        <button className="action" onClick={() => navigate('/')}>
          {t.backHome}
        </button>
      </section>
    );
  }

  const currentRoute = route.name === 'course-detail' ? 'courses' : route.name;

  return (
    <div className={`app theme-${theme}`}>
      <div className="bg-glow bg-glow-top" />
      <div className="bg-glow bg-glow-bottom" />

      <Topbar
        t={t}
        lang={lang}
        theme={theme}
        currentRoute={currentRoute}
        user={auth.user}
        onLangChange={setLang}
        onThemeToggle={toggleTheme}
        onNavigate={navigate}
        onLogout={handleLogout}
      />

      {pageContent}

      <footer className="footer">{t.footer}</footer>
    </div>
  );
}

export default App;
