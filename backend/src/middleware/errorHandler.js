export function errorHandler(error, _req, res, _next) {
  const status = error.status || 500;
  const message = error.message || 'Internal server error';
  return res.status(status).json({ error: message });
}
