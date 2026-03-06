export function validateSignupInput({ fullName, email, password }) {
  if (!fullName || !fullName.trim()) {
    return 'Full name is required.';
  }
  if (!email || !email.trim()) {
    return 'Email is required.';
  }
  if (!password || password.length < 8) {
    return 'Password must be at least 8 characters.';
  }
  return null;
}

export function validateLoginInput({ email, password }) {
  if (!email || !email.trim()) {
    return 'Email is required.';
  }
  if (!password || !password.trim()) {
    return 'Password is required.';
  }
  return null;
}
