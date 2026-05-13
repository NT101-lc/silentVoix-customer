function Hero({ t }) {
  return (
    <section className="hero">
      <div className="hero-copy">
        <h1>{t.heroTitle}</h1>
        <p>{t.heroSubtitle}</p>
        <div className="hero-stats">
          <span>{t.heroStatOne}</span>
          <span>{t.heroStatTwo}</span>
          <span>{t.heroStatThree}</span>
        </div>
      </div>

      <div className="hero-visual" aria-hidden="true">
        <div className="hero-screen">
          <div className="hero-video-bar" />
          <div className="hero-hand-card primary">
            <span className="hand-palm">5</span>
            <span>Hello</span>
          </div>
          <div className="hero-hand-card secondary">
            <span className="hand-palm">2</span>
            <span>Practice</span>
          </div>
          <div className="hero-camera-frame">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
