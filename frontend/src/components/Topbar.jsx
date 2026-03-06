function Topbar({ t, lang, theme, currentRoute, onLangChange, onThemeToggle, onNavigate }) {
  const navItems = [
    { key: 'home', label: t.navHome, path: '/' },
    { key: 'courses', label: t.navCourses, path: '/courses' },
    { key: 'learn', label: t.navLearn, path: '/learn/1' },
    { key: 'dashboard', label: t.navDashboard, path: '/dashboard' }
  ];

  return (
    <header className="topbar">
      <button className="brand brand-button" onClick={() => onNavigate('/')}>
        <span className="brand-dot" />
        {t.brand}
      </button>

      <nav className="nav" aria-label={t.mainNavAria}>
        {navItems.map((item) => (
          <button
            key={item.key}
            className={`nav-link ${currentRoute === item.key ? 'active' : ''}`}
            onClick={() => onNavigate(item.path)}
          >
            {item.label}
          </button>
        ))}
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
