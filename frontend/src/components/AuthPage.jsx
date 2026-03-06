import { useState } from 'react';

function AuthPage({ t, mode, onSubmit, onNavigate }) {
  const isLogin = mode === 'login';
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSubmit({ fullName, email, password, mode });
    } catch (submitError) {
      setError(submitError.message || t.authUnknownError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel auth-page">
      <div className="section-head">
        <h2>{isLogin ? t.loginTitle : t.signupTitle}</h2>
        <p>{isLogin ? t.loginSub : t.signupSub}</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        {!isLogin ? (
          <label className="auth-label">
            {t.authFullName}
            <input
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder={t.authFullNamePlaceholder}
              required
            />
          </label>
        ) : null}

        <label className="auth-label">
          {t.authEmail}
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@company.com"
            required
          />
        </label>

        <label className="auth-label">
          {t.authPassword}
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="********"
            required
            minLength={8}
          />
        </label>

        {error ? <p className="auth-error">{error}</p> : null}

        <button className="action" type="submit" disabled={loading}>
          {loading ? t.authLoading : isLogin ? t.loginCta : t.signupCta}
        </button>
      </form>

      <div className="auth-switch">
        {isLogin ? (
          <button className="action ghost" onClick={() => onNavigate('/signup')}>
            {t.toSignup}
          </button>
        ) : (
          <button className="action ghost" onClick={() => onNavigate('/login')}>
            {t.toLogin}
          </button>
        )}
      </div>
    </section>
  );
}

export default AuthPage;
