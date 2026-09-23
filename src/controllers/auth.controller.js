import {
  registerUserService,
  loginUserService,
  logoutUserService,
  changePasswordService,
  verifyEmailService,
  forgotPasswordService,
  resetPasswordService,
} from "../services/auth.service.js";

const handleServiceError = (error, res) => {
  const statusCode = error.statusCode || 500;
  return res.status(statusCode).json({
    message: error.message || "internal server error",
    ...(statusCode >= 500 ? { error: error.message } : {}),
  });
};

export const registerUser = async (req, res) => {
  try {
    const result = await registerUserService({
      ...req.body,
      avatar: req.file?.path || "",
    });

    return res.status(result.statusCode).json({
      message: result.message,
      user: result.user,
    });
  } catch (error) {
    return handleServiceError(error, res);
  }
};

export const loginUser = async (req, res) => {
  try {
    const result = await loginUserService(req.body);
    return res.status(result.statusCode).json({
      message: result.message,
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    return handleServiceError(error, res);
  }
};

export const logoutUser = async (req, res) => {
  try {
    const result = await logoutUserService();
    return res.status(result.statusCode).json({ message: result.message });
  } catch (error) {
    return handleServiceError(error, res);
  }
};

export const changePassword = async (req, res) => {
  try {
    const result = await changePasswordService(req.body);
    return res.status(result.statusCode).json({ message: result.message });
  } catch (error) {
    return handleServiceError(error, res);
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const result = await verifyEmailService(req.body);
    return res.status(result.statusCode).json({ message: result.message });
  } catch (error) {
    return handleServiceError(error, res);
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const result = await forgotPasswordService(req.body);
    return res.status(result.statusCode).json({ message: result.message });
  } catch (error) {
    return handleServiceError(error, res);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const result = await resetPasswordService(req.body);
    return res.status(result.statusCode).json({ message: result.message });
  } catch (error) {
    return handleServiceError(error, res);
  }
};