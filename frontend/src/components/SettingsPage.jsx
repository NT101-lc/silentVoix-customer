import { useState } from 'react';

function SettingsPage({ t, user, lang, theme, onLangChange, onThemeChange, onSave, onLogout }) {
  const [fullName, setFullName] = useState(user.fullName || '');
  const [avatarDataUrl, setAvatarDataUrl] = useState(user.avatarDataUrl || '');

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
            <label className="auth-link upload-button">
              {t.settingsUploadPhoto}
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden-file-input" />
            </label>
            {avatarDataUrl ? (
              <button className="auth-link" type="button" onClick={() => setAvatarDataUrl('')}>
                {t.settingsRemovePhoto}
              </button>
            ) : null}
          </div>
        </div>

        <label className="auth-label">
          {t.authFullName}
          <input type="text" value={fullName} onChange={(event) => setFullName(event.target.value)} required />
        </label>

        <label className="auth-label">
          {t.authEmail}
          <input type="email" value={user.email || ''} readOnly disabled />
          <span className="auth-help">{t.settingsEmailLocked}</span>
        </label>

        <button className="action" type="submit">
          {t.settingsSave}
        </button>
      </form>

      <div className="settings-section">
        <h3>{t.settingsAppearance}</h3>
        <label className="auth-label">
          {t.settingsTheme}
          <select value={theme} onChange={(event) => onThemeChange(event.target.value)} className="lang-select">
            <option value="light">{t.themeLight}</option>
            <option value="dark">{t.themeDark}</option>
          </select>
        </label>

        <label className="auth-label">
          {t.settingsLanguage}
          <select value={lang} onChange={(event) => onLangChange(event.target.value)} className="lang-select">
            <option value="en">English</option>
            <option value="vi">Tieng Viet</option>
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
