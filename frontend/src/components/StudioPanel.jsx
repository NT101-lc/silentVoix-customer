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
  const [projectorMode, setProjectorMode] = useState(false);
  const signs = useMemo(() => activeLesson.signs || [], [activeLesson.signs]);
  const activeSign = signs[activeSignIndex] || signs[0];

  return (
    <article className={`panel studio ${projectorMode ? 'projector-mode' : ''}`} id="studio">
      <div className="section-head">
        <h2>{t.studioTitle}</h2>
        <p>{t.studioSub}</p>
      </div>

      <div className="lesson-script">
        <span>{t.lessonScript}</span>
        <p>{activeLesson.script?.[lang]}</p>
      </div>

      <div className="studio-grid">
        <div className="video-card lesson-player">
          <div className="card-head">
            <h3>{t.lessonVideo}</h3>
            <div className="player-controls">
              <label className="speed">
                {t.speed}
                <select value={playbackRate} onChange={(event) => onPlaybackRateChange(Number(event.target.value))}>
                  <option value={0.5}>0.5x</option>
                  <option value={0.75}>0.75x</option>
                  <option value={1}>1.0x</option>
                  <option value={1.25}>1.25x</option>
                  <option value={1.5}>1.5x</option>
                </select>
              </label>
              <button className="action ghost compact-action" onClick={() => setProjectorMode((value) => !value)}>
                {projectorMode ? t.exitProjector : t.projectorMode}
              </button>
            </div>
          </div>
          <video key={activeLesson.id} ref={lessonVideoRef} className="media" controls src={activeLesson.videoUrl} />
        </div>

        <div className="video-card camera-card">
          <div className="card-head">
            <h3>{t.cameraTitle}</h3>
          </div>
          <video ref={cameraRef} className="media mirror" autoPlay muted playsInline />
          <p className="camera-help">{t.cameraHelp}</p>
          {cameraEnabled ? (
            <button className="action danger" onClick={onDisableCamera}>
              {t.cameraOff}
            </button>
          ) : (
            <button className="action" onClick={onEnableCamera}>
              {t.cameraOn}
            </button>
          )}
        </div>
      </div>

      {activeSign ? (
        <section className="sign-coach" aria-labelledby="sign-coach-title">
          <div className="section-head sign-coach-head">
            <div>
              <h2 id="sign-coach-title">{t.signGuideTitle}</h2>
              <p>{t.signGuideSub}</p>
            </div>
            <div className="sign-tabs" role="tablist" aria-label={t.signGuideTitle}>
              {signs.map((sign, index) => (
                <button
                  key={sign.label.en}
                  className={`sign-tab ${index === activeSignIndex ? 'active' : ''}`}
                  onClick={() => setActiveSignIndex(index)}
                  role="tab"
                  aria-selected={index === activeSignIndex}
                >
                  {sign.label[lang]}
                </button>
              ))}
            </div>
          </div>

          <div className="sign-detail">
            <div className="hand-visual" aria-hidden="true">
              <span className="hand-badge">{activeSign.label[lang]}</span>
              <div className="palm-shape">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
              <div className="motion-line" />
            </div>

            <div className="sign-instructions">
              <div>
                <span>{t.handShape}</span>
                <p>{activeSign.handShape[lang]}</p>
              </div>
              <div>
                <span>{t.movement}</span>
                <p>{activeSign.movement[lang]}</p>
              </div>
              <div>
                <span>{t.practiceCue}</span>
                <p>{activeSign.cue[lang]}</p>
              </div>
              <div>
                <span>{t.commonMistake}</span>
                <p>{activeSign.mistake[lang]}</p>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <div className="tips" id="progress">
        <h3>{t.tipsTitle}</h3>
        <ul className="drill-list">
          <li>{t.drillWatch}</li>
          <li>{t.drillLearn}</li>
          <li>{t.drillMirror}</li>
          <li>{t.drillRepeat}</li>
          <li>{t.tip1}</li>
        </ul>
      </div>
    </article>
  );
}

export default StudioPanel;
