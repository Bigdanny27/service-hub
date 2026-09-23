import {
  getOwnProfileService,
  updateOwnProfileService,
  uploadProfilePictureService,
} from "../services/user.service.js";

const handleServiceError = (error, res) => {
  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    message: error.message || "internal server error",
    ...(statusCode >= 500 ? { error: error.message } : {}),
  });
};

export const getOwnProfile = async (req, res) => {
  try {
    const result = await getOwnProfileService({ userId: req.user._id });
    return res.status(result.statusCode).json({
      message: result.message,
      user: result.user,
    });
  } catch (error) {
    return handleServiceError(error, res);
  }
};

export const updateOwnProfile = async (req, res) => {
  try {
    const result = await updateOwnProfileService({
      userId: req.user._id,
      updatedData: req.body,
    });
    return res.status(result.statusCode).json({
      message: result.message,
      user: result.user,
    });
  } catch (error) {
    return handleServiceError(error, res);
  }
};

export const uploadProfilePicture = async (req, res) => {
  try {
    const result = await uploadProfilePictureService({ file: req.file });
    return res.status(result.statusCode).json({
      message: result.message,
      url: result.url,
    });
  } catch (error) {
    return handleServiceError(error, res);
  }
};