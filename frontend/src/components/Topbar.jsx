function Topbar({ t, lang, theme, onLangChange, onThemeToggle }) {
  return (
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

      <div className="controls">
        <button className="theme-toggle" onClick={onThemeToggle}>
          {theme === 'light' ? t.themeDark : t.themeLight}
        </button>
        <select value={lang} onChange={(event) => onLangChange(event.target.value)} className="lang-select">
          <option value="en">English</option>
          <option value="vi">Tieng Viet</option>
        </select>
      </div>
    </header>
  );
}

export default Topbar;
