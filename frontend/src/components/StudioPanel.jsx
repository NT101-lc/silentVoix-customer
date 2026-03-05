function StudioPanel({
  t,
  activeLesson,
  playbackRate,
  onPlaybackRateChange,
  lessonVideoRef,
  cameraRef,
  cameraEnabled,
  onEnableCamera,
  onDisableCamera
}) {
  return (
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
              <select value={playbackRate} onChange={(event) => onPlaybackRateChange(Number(event.target.value))}>
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

      <div className="tips" id="progress">
        <h3>{t.tipsTitle}</h3>
        <ul>
          <li>{t.tip1}</li>
          <li>{t.tip2}</li>
          <li>{t.tip3}</li>
        </ul>
      </div>
    </article>
  );
}

export default StudioPanel;
