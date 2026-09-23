import {
  createProviderService,
  getProviderProfileService,
  updateProviderProfileService,
  setAvailabilityService,
  viewProviderServicesService,
  viewProviderBookingsService,
  acceptBookingsService,
  markBookingAsCompletedService,
  cancelBookingWhenAppropriateService,
} from "../services/provider.service.js";

const handleServiceError = (error, res) => {
  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    message: error.message || "internal server error",
    ...(statusCode >= 500 ? { error: error.message } : {}),
  });
};

export const createProvider = async (req, res) => {
  try {
    const result = await createProviderService({
      userId: req.user._id,
      ...req.body,
    });

    return res.status(result.statusCode).json({
      message: result.message,
      provider: result.provider,
    });
  } catch (error) {
    return handleServiceError(error, res);
  }
};

export const getProviderProfile = async (req, res) => {
  try {
    const result = await getProviderProfileService({ userId: req.user._id });
    return res.status(result.statusCode).json({
      message: result.message,
      provider: result.provider,
    });
  } catch (error) {
    return handleServiceError(error, res);
  }
};

export const updateProviderProfile = async (req, res) => {
  try {
    const result = await updateProviderProfileService({
      userId: req.user._id,
      updatedData: req.body,
    });

    return res.status(result.statusCode).json({
      message: result.message,
      provider: result.provider,
    });
  } catch (error) {
    return handleServiceError(error, res);
  }
};

export const setAvailability = async (req, res) => {
  try {
    const result = await setAvailabilityService({
      userId: req.user._id,
      isAvailable: req.body.isAvailable,
    });

    return res.status(result.statusCode).json({
      message: result.message,
      provider: result.provider,
    });
  } catch (error) {
    return handleServiceError(error, res);
  }
};

export const viewProviderServices = async (req, res) => {
  try {
    const result = await viewProviderServicesService({ userId: req.user._id });
    return res.status(result.statusCode).json({
      message: result.message,
      services: result.services,
    });
  } catch (error) {
    return handleServiceError(error, res);
  }
};

export const viewProviderBookings = async (req, res) => {
  try {
    const result = await viewProviderBookingsService({ userId: req.user._id });
    return res.status(result.statusCode).json({
      message: result.message,
      bookings: result.bookings,
    });
  } catch (error) {
    return handleServiceError(error, res);
  }
};

export const acceptBookings = async (req, res) => {
  try {
    const result = await acceptBookingsService({
      userId: req.user._id,
      bookingId: req.params.bookingId,
    });

    return res.status(result.statusCode).json({
      message: result.message,
      bookingId: result.bookingId,
    });
  } catch (error) {
    return handleServiceError(error, res);
  }
};

export const markBookingAsCompleted = async (req, res) => {
  try {
    const result = await markBookingAsCompletedService({
      userId: req.user._id,
      bookingId: req.params.bookingId,
    });

    return res.status(result.statusCode).json({
      message: result.message,
      bookingId: result.bookingId,
    });
  } catch (error) {
    return handleServiceError(error, res);
  }
};

export const cancelBookingWhenAppropriate = async (req, res) => {
  try {
    const result = await cancelBookingWhenAppropriateService({
      userId: req.user._id,
      bookingId: req.params.bookingId,
    });

    return res.status(result.statusCode).json({
      message: result.message,
      bookingId: result.bookingId,
    });
  } catch (error) {
    return handleServiceError(error, res);
  }
};
