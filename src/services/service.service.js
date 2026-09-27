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
    if (
        providerId == null ||
        categoryId == null ||
        name == null ||
        description == null ||
        price == null ||
        duration == null
    ) {
        throw makeError("All fields are required", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(providerId)) {
        throw makeError("Invalid provider id", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        throw makeError("Invalid category id", 400);
    }

    const providerExists = await Provider.findById(providerId);
    if (!providerExists) {
        throw makeError("Provider not found", 404);
    }

    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
        throw makeError("Category not found", 404);
    }

    const service = await Service.create({
        provider: providerExists._id,
        category: categoryExists._id,
        name,
        description,
        price: Number(price),
        duration: Number(duration)
    });

    const created = await Service.findById(service._id).populate("provider category");

    return {
        message: "Service created successfully",
        service: created
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

export const getSingleServiceService = async (serviceId) => {
    if (!serviceId) {
        throw makeError("Service id is required", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
        throw makeError("Invalid service id", 400);
    }

    const service = await Service.findById(serviceId).populate("provider category");

    if (!service) {
        throw makeError("Service not found", 404);
    }

    return service;
};

export const updateServiceService = async ({ serviceId, updatedData }) => {
    if (!serviceId) {
        throw makeError("Service id is required", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
        throw makeError("Invalid service id", 400);
    }

    const service = await Service.findById(serviceId);

    if (!service) {
        throw makeError("Service not found", 404);
    }

    if (!updatedData || Object.keys(updatedData).length === 0) {
        throw makeError("No update data provided", 400);
    }

    const allowedFields = ["provider", "category", "name", "description", "price", "duration"];
    const invalidFields = Object.keys(updatedData).filter(
        (field) => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
        throw makeError(`Invalid field(s): ${invalidFields.join(", ")}`, 400);
    }

    if (updatedData.provider && !mongoose.Types.ObjectId.isValid(updatedData.provider)) {
        throw makeError("Invalid provider id", 400);
    }

    if (updatedData.category && !mongoose.Types.ObjectId.isValid(updatedData.category)) {
        throw makeError("Invalid category id", 400);
    }

    if (updatedData.price !== undefined && Number.isNaN(Number(updatedData.price))) {
        throw makeError("Price must be a valid number", 400);
    }

    if (updatedData.duration !== undefined && Number.isNaN(Number(updatedData.duration))) {
        throw makeError("Duration must be a valid number", 400);
    }

    const sanitizedData = {
        ...updatedData,
        ...(updatedData.price !== undefined && { price: Number(updatedData.price) }),
        ...(updatedData.duration !== undefined && { duration: Number(updatedData.duration) })
    };

    const updatedService = await Service.findByIdAndUpdate(
        serviceId,
        sanitizedData,
        { new: true, runValidators: true }
    ).populate("provider category");

    return {
        statusCode: 200,
        message: "Service updated successfully",
        service: updatedService,
    };
};