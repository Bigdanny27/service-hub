import {
  getAllUsersService,
  activateUserService,
  deactivateUserService,
  deleteUserService
//   toggleUserStatusService,
} from "../services/admin.service.js";

const handleServiceError = (error, res) => {
  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    message: error.message || "internal server error",
    ...(statusCode >= 500 ? { error: error.message } : {}),
  });
};

export const getAllUsers = async (req, res) => {
  try {
    const result = await getAllUsersService();
    return res.status(result.statusCode).json({
      message: result.message,
      users: result.users,
    });
  } catch (error) {
    return handleServiceError(error, res);
  }
};

// export const toggleUserStatus = async (req, res) => {
//   try {
//     const result = await toggleUserStatusService({ userId: req.params.userId });
//     return res.status(result.statusCode).json({
//       message: result.message,
//       user: result.user,
//     });
//   } catch (error) {
//     return handleServiceError(error, res);
//   }
// };

export const activateUser = async (req, res) => {
  try {
    const result = await activateUserService({ userId: req.params.userId });
    return res.status(result.statusCode).json({
      message: result.message,
      user: result.user,
    });
  } catch (error) {
    return handleServiceError(error, res);
  }
};

export const deactivateUser = async (req, res) => {
  try {
    const result = await deactivateUserService({ userId: req.params.userId });
    return res.status(result.statusCode).json({
      message: result.message,
      user: result.user,
    });
  } catch (error) {
    return handleServiceError(error, res);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const result = await deleteUserService({ userId: req.params.userId });
    return res.status(result.statusCode).json({
      message: result.message,
    });
  } catch (error) {
    return handleServiceError(error, res);
  }
};