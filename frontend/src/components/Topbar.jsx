function Topbar({ t, lang, theme, currentRoute, user, onLangChange, onThemeChange, onNavigate }) {
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
        <button
          className="auth-link"
          onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? t.themeLight : t.themeDark}
        </button>
        <select value={lang} onChange={(event) => onLangChange(event.target.value)} className="lang-select">
          <option value="en">English</option>
          <option value="vi">Tieng Viet</option>
        </select>
        <div className="auth-controls" aria-label={t.authNavAria}>
          {user ? (
            <button className="profile-icon-button" onClick={() => onNavigate('/settings')} title={t.navSettings}>
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
              >
                {t.navLogin}
              </button>
              <button
                className={`auth-link ${currentRoute === 'signup' ? 'active' : ''}`}
                onClick={() => onNavigate('/signup')}
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
