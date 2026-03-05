import { useEffect, useMemo, useRef, useState } from 'react';
import Topbar from './components/Topbar';
import Hero from './components/Hero';
import LessonLibrary from './components/LessonLibrary';
import StudioPanel from './components/StudioPanel';
import { copy, lessons } from './data/content';
import './App.css';

function App() {
  const [lang, setLang] = useState('en');
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

  useEffect(() => {
    window.localStorage.setItem('silentvoix-theme', theme);
  }, [theme]);

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

  return (
    <div className={`app theme-${theme}`}>
      <div className="bg-glow bg-glow-top" />
      <div className="bg-glow bg-glow-bottom" />

      <Topbar t={t} lang={lang} theme={theme} onLangChange={setLang} onThemeToggle={toggleTheme} />

      <Hero t={t} />

      <section className="content" id="lessons">
        <LessonLibrary
          t={t}
          lang={lang}
          lessons={lessons}
          activeLessonId={activeLessonId}
          onLessonSelect={setActiveLessonId}
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
      </section>

      <footer className="footer">{t.footer}</footer>
    </div>
  );
}

export default App;
