import {
  createCategoryService,
  getAllCategoriesService,
  getSingleCategoryService,
  updateCategoryService,
  deleteCategoryService,
  restoreCategoryService,
} from "../services/category.service.js";

const handleServiceError = (error, res) => {
  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    message: error.message || "internal server error",
    ...(statusCode >= 500 ? { error: error.message } : {}),
  });
};

export const createCategory = async (req, res) => {
  try {
    const result = await createCategoryService(req.body);
    return res.status(result.statusCode).json({
      message: result.message,
      category: result.category,
    });
  } catch (error) {
    return handleServiceError(error, res);
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const result = await getAllCategoriesService();
    return res.status(result.statusCode).json({
      message: result.message,
      categories: result.categories,
    });
  } catch (error) {
    return handleServiceError(error, res);
  }
};

export const getSingleCategory = async (req, res) => {
  try {
    const result = await getSingleCategoryService({ id: req.params.id });
    return res.status(result.statusCode).json({
      message: result.message,
      category: result.category,
    });
  } catch (error) {
    return handleServiceError(error, res);
  }
};

export const updateCategory = async (req, res) => {
  try {
    const result = await updateCategoryService({
      id: req.params.id,
      ...req.body,
    });

    return res.status(result.statusCode).json({
      message: result.message,
      category: result.category,
    });
  } catch (error) {
    return handleServiceError(error, res);
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const result = await deleteCategoryService({ id: req.params.id });
    return res.status(result.statusCode).json({
      message: result.message,
    });
  } catch (error) {
    return handleServiceError(error, res);
  }
};

export const restoreCategory = async (req, res) => {
  try {
    const result = await restoreCategoryService({ id: req.params.id });
    return res.status(result.statusCode).json({
      message: result.message,
      category: result.category,
    });
  } catch (error) {
    return handleServiceError(error, res);
  }
};