import User from "../models/user.model.js";

const makeError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const getOwnProfileService = async ({ userId }) => {
  if (!userId) {
    throw makeError("userId is required", 400);
  }

  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw makeError("User not found", 404);
  }

  return {
    statusCode: 200,
    message: "User profile retrieved successfully",
    user,
  };
};

export const updateOwnProfileService = async ({ userId, updatedData }) => {
  if (!userId) {
    throw makeError("userId is required", 400);
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true }).select("-password");
  if (!updatedUser) {
    throw makeError("User not found", 404);
  }

  return {
    statusCode: 200,
    message: "User profile updated successfully",
    user: updatedUser,
  };
};

export const uploadProfilePictureService = async ({ file }) => {
  if (!file) {
    throw makeError("No file uploaded", 400);
  }

  return {
    statusCode: 200,
    message: "File uploaded successfully",
    url: file.path,
  };
};
