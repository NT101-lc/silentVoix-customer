import { useState } from 'react';

function SettingsPage({ t, user, lang, theme, onLangChange, onThemeChange, onSave, onLogout }) {
  const [fullName, setFullName] = useState(user.fullName || '');
  const [avatarDataUrl, setAvatarDataUrl] = useState(user.avatarDataUrl || '');
  const emailHelpId = 'settings-email-help';

  function handleSubmit(event) {
    event.preventDefault();
    onSave({
      ...user,
      fullName: fullName.trim(),
      avatarDataUrl
    });
  }

  function handleAvatarChange(event) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatarDataUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <section className="panel settings-page">
      <div className="section-head">
        <h2>{t.settingsTitle}</h2>
        <p>{t.settingsSub}</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="settings-avatar-row">
          <span className="profile-avatar profile-avatar-large" aria-hidden="true">
            {avatarDataUrl ? <img src={avatarDataUrl} alt="" className="profile-avatar-image" /> : getInitials(fullName)}
          </span>
          <div className="settings-avatar-controls">
            <label className="auth-link upload-button" htmlFor="settings-avatar-upload">
              {t.settingsUploadPhoto}
              <input
                id="settings-avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden-file-input"
              />
            </label>
            {avatarDataUrl ? (
              <button className="auth-link" type="button" onClick={() => setAvatarDataUrl('')}>
                {t.settingsRemovePhoto}
              </button>
            ) : null}
          </div>
        </div>

        <label className="auth-label" htmlFor="settings-full-name">
          <span>{t.authFullName}</span>
          <input
            id="settings-full-name"
            type="text"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            required
            autoComplete="name"
          />
        </label>

        <label className="auth-label" htmlFor="settings-email">
          <span>{t.authEmail}</span>
          <input
            id="settings-email"
            type="email"
            value={user.email || ''}
            readOnly
            disabled
            aria-describedby={emailHelpId}
          />
          <span className="auth-help" id={emailHelpId}>{t.settingsEmailLocked}</span>
        </label>

        <button className="action" type="submit">
          {t.settingsSave}
        </button>
      </form>

      <div className="settings-section">
        <h3>{t.settingsAppearance}</h3>
        <label className="auth-label" htmlFor="settings-theme">
          <span>{t.settingsTheme}</span>
          <select
            id="settings-theme"
            value={theme}
            onChange={(event) => onThemeChange(event.target.value)}
            className="lang-select"
          >
            <option value="light">{t.themeLight}</option>
            <option value="dark">{t.themeDark}</option>
          </select>
        </label>

        <label className="auth-label" htmlFor="settings-language">
          <span>{t.settingsLanguage}</span>
          <select
            id="settings-language"
            value={lang}
            onChange={(event) => onLangChange(event.target.value)}
            className="lang-select"
          >
            <option value="en">English</option>
            <option value="vi">Tiếng Việt</option>
          </select>
        </label>
      </div>

      <div className="settings-section">
        <h3>{t.settingsAccount}</h3>
        <button className="action danger" type="button" onClick={onLogout}>
          {t.navLogout}
        </button>
      </div>
    </section>
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

export default SettingsPage;
