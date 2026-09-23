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

export const getAllServicesService = async (query = {}) => {
    const {
        search,
        category,
        provider,
        minPrice,
        maxPrice,
        sort,
        page = 1,
        limit = 10
    } = query;

    const filter = {};

    if (search) {
        filter.name = {
            $regex: search,
            $options: "i",
        };
    }

    if (category) {
        filter.category = category;
    }

    if (provider) {
        filter.provider = provider;
    }

    if (minPrice || maxPrice) {
        filter.price = {};

        if (minPrice) {
            filter.price.$gte = Number(minPrice);
        }

        if (maxPrice) {
            filter.price.$lte = Number(maxPrice);
        }
    }

    let sortOption = { createdAt: -1 };

    if (sort === "price") {
        sortOption = { price: 1 };
    }

    if (sort === "-price") {
        sortOption = { price: -1 };
    }

    if (sort === "name") {
        sortOption = { name: 1 };
    }

    if (sort === "-name") {
        sortOption = { name: -1 };
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const services = await Service.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limitNumber);

    return services;
}