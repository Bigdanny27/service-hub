import User from "../models/user.model.js";

const makeError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const getAllUsersService = async () => {
  const users = await User.find().select("-password");

  if (!users || users.length === 0) {
    throw makeError("no users found", 404);
  }

  return {
    statusCode: 200,
    message: "users successfully found",
    users,
  };
};

// export const toggleUserStatusService = async ({ userId }) => {
//   if (!userId) {
//     throw makeError("userId is required", 400);
//   }

//   const user = await User.findById(userId);
//   if (!user) {
//     throw makeError("User not found", 404);
//   }

//   user.isActive = !user.isActive;
//   await user.save();

//   return {
//     statusCode: 200,
//     message: user.isActive ? "User activated successfully" : "User deactivated successfully",
//     user,
//   };
// };

export const activateUserService = async ({ userId }) => {
  if (!userId) {
    throw makeError("userId is required", 400);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw makeError("User not found", 404);
  }

  user.isActive = true;
  await user.save();

  return {
    statusCode: 200,
    message: "User activated successfully",
    user,
  };
};

export const deactivateUserService = async ({ userId }) => {
  if (!userId) {
    throw makeError("userId is required", 400);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw makeError("User not found", 404);
  }

  user.isActive = false;
  await user.save();

  return {
    statusCode: 200,
    message: "User deactivated successfully",
    user,
  };
};

export const deleteUserService = async ({ userId }) => {
  if (!userId) {
    throw makeError("userId is required", 400);
  }

  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw makeError("user not found", 404);
  }

  return {
    statusCode: 200,
    message: "user successfully deleted",
  };
};
