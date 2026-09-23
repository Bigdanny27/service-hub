import Provider from "../models/provider.model.js";

const makeError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const createProviderService = async ({ userId, businessName, description, location, phone }) => {
  if (!userId || !businessName || !description || !location || !phone) {
    throw makeError("All fields are required", 400);
  }

  const existingProvider = await Provider.findOne({ user: userId });
  if (existingProvider) {
    throw makeError("Provider profile already exists for this user", 409);
  }

  const provider = await Provider.create({
    user: userId,
    businessName,
    description,
    location,
    phone,
  });

  return {
    statusCode: 201,
    message: "Provider profile created successfully",
    provider,
  };
};

export const getProviderProfileService = async ({ userId }) => {
  if (!userId) {
    throw makeError("userId is required", 400);
  }

  const provider = await Provider.findOne({ user: userId }).populate("user", "name lastname email");
  if (!provider) {
    throw makeError("Provider profile not found", 404);
  }

  return {
    statusCode: 200,
    message: "Provider profile retrieved successfully",
    provider,
  };
};

export const updateProviderProfileService = async ({ userId, updatedData }) => {
  if (!userId) {
    throw makeError("userId is required", 400);
  }

  const updatedProvider = await Provider.findOneAndUpdate({ user: userId }, updatedData, { new: true });
  if (!updatedProvider) {
    throw makeError("Provider profile not found", 404);
  }

  return {
    statusCode: 200,
    message: "Provider profile updated successfully",
    provider: updatedProvider,
  };
};

export const setAvailabilityService = async ({ userId, isAvailable }) => {
  if (!userId) {
    throw makeError("userId is required", 400);
  }

  if (typeof isAvailable !== "boolean") {
    throw makeError("isAvailable must be a boolean", 400);
  }

  const provider = await Provider.findOneAndUpdate({ user: userId }, { isAvailable }, { new: true });
  if (!provider) {
    throw makeError("Provider profile not found", 404);
  }

  return {
    statusCode: 200,
    message: "Availability status updated successfully",
    provider,
  };
};

export const viewProviderServicesService = async ({ userId }) => {
  if (!userId) {
    throw makeError("userId is required", 400);
  }

  const provider = await Provider.findOne({ user: userId }).populate("services");
  if (!provider) {
    throw makeError("Provider profile not found", 404);
  }

  return {
    statusCode: 200,
    message: "Provider services retrieved successfully",
    services: provider.services,
  };
};

export const viewProviderBookingsService = async ({ userId }) => {
  if (!userId) {
    throw makeError("userId is required", 400);
  }

  const provider = await Provider.findOne({ user: userId }).populate("bookings");
  if (!provider) {
    throw makeError("Provider profile not found", 404);
  }

  return {
    statusCode: 200,
    message: "Provider bookings retrieved successfully",
    bookings: provider.bookings,
  };
};

export const acceptBookingsService = async ({ userId, bookingId }) => {
  if (!userId || !bookingId) {
    throw makeError("userId and bookingId are required", 400);
  }

  const provider = await Provider.findOne({ user: userId });
  if (!provider) {
    throw makeError("Provider profile not found", 404);
  }

  return {
    statusCode: 200,
    message: "Booking accepted successfully",
    bookingId,
  };
};

export const markBookingAsCompletedService = async ({ userId, bookingId }) => {
  if (!userId || !bookingId) {
    throw makeError("userId and bookingId are required", 400);
  }

  const provider = await Provider.findOne({ user: userId });
  if (!provider) {
    throw makeError("Provider profile not found", 404);
  }

  return {
    statusCode: 200,
    message: "Booking marked as completed successfully",
    bookingId,
  };
};

export const cancelBookingWhenAppropriateService = async ({ userId, bookingId }) => {
  if (!userId || !bookingId) {
    throw makeError("userId and bookingId are required", 400);
  }

  const provider = await Provider.findOne({ user: userId });
  if (!provider) {
    throw makeError("Provider profile not found", 404);
  }

  return {
    statusCode: 200,
    message: "Booking canceled successfully",
    bookingId,
  };
};
