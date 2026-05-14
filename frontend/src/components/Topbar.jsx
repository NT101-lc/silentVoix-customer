function Topbar({ t, lang, theme, currentRoute, user, onLangChange, onThemeChange, onNavigate }) {
  const navItems = [
    { key: 'home', label: t.navHome, path: '/' },
    { key: 'courses', label: t.navCourses, path: '/courses' },
    { key: 'learn', label: t.navLearn, path: '/learn/1' },
    { key: 'glove', label: t.navGlove, path: '/glove' },
    { key: 'dashboard', label: t.navDashboard, path: '/dashboard' }
  ];

  return (
    <header className="topbar">
      <button className="brand brand-button" onClick={() => onNavigate('/')}>
        <span className="brand-dot" aria-hidden="true" />
        {t.brand}
      </button>

      <nav className="nav" aria-label={t.mainNavAria}>
        {navItems.map((item) => (
          <button
            key={item.key}
            className={`nav-link ${currentRoute === item.key ? 'active' : ''}`}
            onClick={() => onNavigate(item.path)}
            aria-current={currentRoute === item.key ? 'page' : undefined}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="controls">
        <button
          className="auth-link"
          onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
          title={t.themeToggleLabel}
        >
          {theme === 'dark' ? t.themeLight : t.themeDark}
        </button>
        <label className="sr-only" htmlFor="topbar-language">
          {t.languageSelectLabel}
        </label>
        <select
          id="topbar-language"
          value={lang}
          onChange={(event) => onLangChange(event.target.value)}
          className="lang-select"
          aria-label={t.languageSelectLabel}
        >
          <option value="en">English</option>
          <option value="vi">Tiếng Việt</option>
        </select>
        <div className="auth-controls" aria-label={t.authNavAria}>
          {user ? (
            <button
              className="profile-icon-button"
              onClick={() => onNavigate('/settings')}
              title={t.navSettings}
              aria-label={t.profileSettingsLabel}
            >
              <span className="profile-avatar" aria-hidden="true">
                {user.avatarDataUrl ? (
                  <img src={user.avatarDataUrl} alt="" className="profile-avatar-image" />
                ) : (
                  getInitials(user.fullName)
                )}
              </span>
            </button>
          ) : (
            <>
              <button
                className={`auth-link ${currentRoute === 'login' ? 'active' : ''}`}
                onClick={() => onNavigate('/login')}
                aria-current={currentRoute === 'login' ? 'page' : undefined}
              >
                {t.navLogin}
              </button>
              <button
                className={`auth-link ${currentRoute === 'signup' ? 'active' : ''}`}
                onClick={() => onNavigate('/signup')}
                aria-current={currentRoute === 'signup' ? 'page' : undefined}
              >
                {t.navSignup}
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function getInitials(fullName) {
  if (!fullName) {
    return '?';
  }
  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');
}

export default Topbar;
