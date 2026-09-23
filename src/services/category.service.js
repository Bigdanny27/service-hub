import slugify from "slugify";
import Category from "../models/category.model.js";

const makeError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const createCategoryService = async ({ name, description }) => {
  if (!name) {
    throw makeError("Category name is required", 400);
  }

  const slug = slugify(name, { lower: true, strict: true });
  const existingCategory = await Category.findOne({ $or: [{ name }, { slug }] });

  if (existingCategory) {
    throw makeError("Category already exists", 409);
  }

  const category = await Category.create({
    name,
    slug,
    description: description || "",
  });

  return {
    statusCode: 201,
    message: "Category created successfully",
    category,
  };
};

export const getAllCategoriesService = async () => {
  const categories = await Category.find();

  if (categories.length === 0) {
    throw makeError("No categories found", 404);
  }

  return {
    statusCode: 200,
    message: "Categories fetched successfully",
    categories,
  };
};

export const getSingleCategoryService = async ({ id }) => {
  if (!id) {
    throw makeError("Category id is required", 400);
  }

  const category = await Category.findById(id);
  if (!category) {
    throw makeError("Category not found", 404);
  }

  return {
    statusCode: 200,
    message: "Category fetched successfully",
    category,
  };
};

export const updateCategoryService = async ({ id, name, description }) => {
  if (!id) {
    throw makeError("Category id is required", 400);
  }

  const category = await Category.findById(id);
  if (!category) {
    throw makeError("Category not found", 404);
  }

  const updateData = {};

  if (name) {
    updateData.name = name;
    updateData.slug = slugify(name, { lower: true, strict: true });
  }

  if (description !== undefined) {
    updateData.description = description;
  }

  const updatedCategory = await Category.findByIdAndUpdate(id, updateData, { new: true });

  return {
    statusCode: 200,
    message: "Category updated successfully",
    category: updatedCategory,
  };
};

export const deleteCategoryService = async ({ id }) => {
  if (!id) {
    throw makeError("Category id is required", 400);
  }

  const category = await Category.findById(id);
  if (!category) {
    throw makeError("Category not found", 404);
  }

  category.isDeleted = true;
  category.deletedAt = new Date();
  await category.save();

  return {
    statusCode: 200,
    message: "Category deleted successfully",
  };
};

export const restoreCategoryService = async ({ id }) => {
  if (!id) {
    throw makeError("Category id is required", 400);
  }

  const category = await Category.findById(id);
  if (!category) {
    throw makeError("Category not found", 404);
  }

  category.isDeleted = false;
  category.deletedAt = null;
  await category.save();

  return {
    statusCode: 200,
    message: "Category restored successfully",
    category,
  };
};
