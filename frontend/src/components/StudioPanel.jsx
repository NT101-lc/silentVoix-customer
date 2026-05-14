import { useMemo, useState } from 'react';

function StudioPanel({
  t,
  lang,
  activeLesson,
  playbackRate,
  onPlaybackRateChange,
  lessonVideoRef,
  cameraRef,
  cameraEnabled,
  onEnableCamera,
  onDisableCamera
}) {
  const [activeSignIndex, setActiveSignIndex] = useState(0);
  const signs = useMemo(() => activeLesson.signs || [], [activeLesson.signs]);

  // Mock Motion Paths for Phase #3
  const motionPaths = {
    'Hello': "M 300 200 Q 400 150 500 200",
    'Welcome': "M 200 300 Q 400 350 600 300",
    'Thank You': "M 400 100 L 400 300",
    'Need': "M 400 200 L 400 350",
    'Question': "M 400 150 Q 500 150 500 250 T 400 350",
    'Understand': "M 400 100 Q 450 150 400 200",
    'Confirm': "M 400 250 L 400 250",
    'Quantity': "M 400 250 L 400 250",
    'Pay': "M 300 350 L 500 350"
  };

  const activePath = motionPaths[signs[activeSignIndex]?.label.en] || "M 0 0";
  const handleSignKeyDown = (event, index) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setActiveSignIndex(index);
    }
  };

  return (
    <article className="studio" id="studio">
      <div className="studio-main">
        {/* Fixed Viewport Section (#3 Motion Paths) */}
        <section className="viewport-card">
          <div className="video-overlay-container">
            <video 
              key={activeLesson.id} 
              ref={lessonVideoRef} 
              src={activeLesson.videoUrl} 
              autoPlay 
              loop 
              muted 
            />
            
            {/* SVG Overlay for Motion Paths */}
            <svg className="motion-overlay" viewBox="0 0 800 450" aria-hidden="true" focusable="false">
              <path 
                className="motion-path animate" 
                d={activePath} 
              />
            </svg>

            {/* Floating Controls */}
            <div className="player-controls" style={{ position: 'absolute', bottom: 12, right: 12, zIndex: 10 }}>
              <label className="sr-only" htmlFor="lesson-playback-speed">
                {t.playbackSpeedLabel}
              </label>
              <select 
                id="lesson-playback-speed"
                className="lang-select"
                value={playbackRate} 
                onChange={(e) => onPlaybackRateChange(Number(e.target.value))}
                style={{ background: 'rgba(0,0,0,0.6)', border: '0', color: 'white' }}
              >
                <option value={0.5}>0.5x Slow</option>
                <option value={0.75}>0.75x</option>
                <option value={1}>1.0x Normal</option>
              </select>
            </div>
          </div>
        </section>

        {/* Sign-Along Scroll (#2 Scroll Experience) */}
        <section className="sign-scroll-container">
          <div className="section-head">
            <h2>{activeLesson.title[lang]}</h2>
            <p>{t.studioSub}</p>
          </div>

          {signs.map((sign, index) => (
            <article
              key={sign.label.en} 
              className={`sign-step-card ${index === activeSignIndex ? 'active' : ''}`}
              onClick={() => setActiveSignIndex(index)}
              onKeyDown={(event) => handleSignKeyDown(event, index)}
              role="button"
              tabIndex={0}
              aria-pressed={index === activeSignIndex}
              aria-label={`${index === activeSignIndex ? t.selectedSignLabel : t.selectSignLabel}: ${sign.label[lang]}`}
            >
              <div className="sign-step-header">
                <h4>{sign.label[lang]}</h4>
                <div className="course-badge" style={{ position: 'static' }}>Step {index + 1}</div>
              </div>
              
              <div className="visual-instruction">
                <div className="visual-instruction-item">
                  <span>{t.handShape}</span>
                  <p>{sign.handShape[lang]}</p>
                </div>
                <div className="visual-instruction-item">
                  <span>{t.movement}</span>
                  <p>{sign.movement[lang]}</p>
                </div>
              </div>

              {index === activeSignIndex && (
                <div className="drill-list" style={{ marginTop: 12, borderTop: '1px solid var(--line)', paddingTop: 12 }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--accent-strong)', fontWeight: 700 }}>
                    Coach Tip: {sign.mistake[lang]}
                  </p>
                </div>
              )}
            </article>
          ))}

          {/* Camera Mini-View */}
          <div className="camera-mini-card">
            <video ref={cameraRef} autoPlay muted playsInline className="mirror" />
            <div className="camera-mini-content">
              <h5>{t.cameraTitle}</h5>
              <p>{t.cameraHelp}</p>
              <button 
                className={`action compact-action ${cameraEnabled ? 'danger' : ''}`}
                onClick={cameraEnabled ? onDisableCamera : onEnableCamera}
                style={{ marginTop: 8, width: '100%' }}
              >
                {cameraEnabled ? t.cameraOff : t.cameraOn}
              </button>
            </div>
          </div>
        </section>
      </div>
    </article>
  );
}

export default StudioPanel;
