import mongoose from "mongoose"
import Service from "../models/service.model.js"
import Provider from "../models/provider.model.js"
import Category from "../models/category.model.js"

const makeError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const createServiceService = async ({ providerId, categoryId, name, description, price, duration }) => {
    if (!providerId || !categoryId || !name || !description || !price || !duration) {
        throw makeError("All fields are required", 400);
    }

    const provider = await Provider.findById(providerId);
    if (!provider) {
        throw makeError("Provider not found", 404);
    }

    const category = await Category.findById(categoryId);
    if (!category) {
        throw makeError("Category not found", 404);
    }

    const service = await Service.create({
        provider: providerId,
        category: categoryId,
        name,
        description,
        price,
        duration
    });

    return {
        message: "Service created successfully",
        service
    };
};