import { visualAssets } from '../data/content';

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
        <img className="hero-photo" src={visualAssets.hero} alt="" />
      </div>
    </section>
  );
}

export default Hero;
