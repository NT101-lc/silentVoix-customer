import { login, signup } from '../services/authService.js';
import { validateLoginInput, validateSignupInput } from '../utils/validators.js';

export async function signupController(req, res, next) {
  try {
    const { fullName, email, password } = req.body;
    const validationError = validateSignupInput({ fullName, email, password });

    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const authPayload = await signup({ fullName, email, password });
    return res.status(201).json(authPayload);
  } catch (error) {
    return next(error);
  }
}

export async function loginController(req, res, next) {
  try {
    const { email, password } = req.body;
    const validationError = validateLoginInput({ email, password });

    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const authPayload = await login({ email, password });
    return res.status(200).json(authPayload);
  } catch (error) {
    return next(error);
  }
}
