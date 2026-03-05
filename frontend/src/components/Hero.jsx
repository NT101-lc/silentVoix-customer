function Hero({ t }) {
  return (
    <section className="hero">
      <h1>{t.heroTitle}</h1>
      <p>{t.heroSubtitle}</p>
      <div className="hero-stats">
        <span>{t.heroStatOne}</span>
        <span>{t.heroStatTwo}</span>
        <span>{t.heroStatThree}</span>
      </div>
    </section>
  );
}

export default Hero;
