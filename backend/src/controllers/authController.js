import AuthService from "../services/AuthService.js";
import { catchAsync } from "../utils/catchAsync.js";

const authService = new AuthService();

/**
 * POST /api/auth/register
 */
export const register = catchAsync(async (req, res) => {
  const { email, password, firstName, lastName, phone } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: email, password, firstName, lastName",
    });
  }

  const result = await authService.register({ email, password, firstName, lastName, phone });
  res.status(201).json({ success: true, data: result });
});

/**
 * POST /api/auth/login
 */
export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  const result = await authService.login(email, password);
  res.json({ success: true, data: result });
});
