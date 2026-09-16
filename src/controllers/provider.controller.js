import { ca } from "zod/locales"
import Provider from "../models/provider.model.js"
import User from "../models/user.model.js"


export const createProvider = async (req, res) => {
    try {
        const { businessName, description, location, phone } = req.body
        const userId = req.user._id

        if (!businessName || !description || !location || !phone) {
            return res.status(400).json({ message: "All fields are required" })
        }
        const existingProvider = await Provider.findOne({user: userId})
        if (existingProvider) {
            return res.status(409).json({
                message: "Provider profile already exists for this user"
            })
        }
        const provider = await Provider.create({
                user: userId,
                businessName,
                description,
                location,
                phone
            })
            return res.status(201).json({
                message: "Provider profile created successfully",
                provider
            })
        }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}

export const getProviderProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        const provider = await Provider.findOne({ user: userId }).populate("user", "name lastname email");
        if (!provider) {
            return res.status(404).json({
                message: "Provider profile not found"
            });
        }
        return res.status(200).json({
            message: "Provider profile retrieved successfully",
            provider
        }); 
    } catch (error) {
        return res.status(500).json({
            message: "Failed to retrieve provider profile",
            error: error.message
        });
    }
}

export const updateProviderProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const updatedData = req.body;

        const updatedProvider = await Provider.findOneAndUpdate({ user: userId }, updatedData, { new: true });
        if (!updatedProvider) {
            return res.status(404).json({
                message: "Provider profile not found"
            });
        }
        return res.status(200).json({
            message: "Provider profile updated successfully",
            provider: updatedProvider
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to update provider profile",
            error: error.message
        });
    }
}

export const setAvailability = async (req, res) => {
    try {
        const userId = req.user._id;
        const { isAvailable } = req.body;

        if (typeof isAvailable !== 'boolean') {
            return res.status(400).json({ message: "isAvailable must be a boolean" });
        }

        const provider = await Provider.findOneAndUpdate(
            { user: userId },
            { isAvailable },
            { new: true }
        );

        if (!provider) {
            return res.status(404).json({
                message: "Provider profile not found"
            });
        }

        return res.status(200).json({
            message: "Availability status updated successfully",
            provider
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to update availability status",
            error: error.message
        });
    }
}

export const viewProviderServices = async (req, res) => {
    try {
        const userId = req.user._id;

        const provider = await Provider.findOne({ user: userId }).populate("services");

        if (!provider) {
            return res.status(404).json({
                message: "Provider profile not found"
            })
        }
        return res.status(200).json({
            message: "Provider services retrieved successfully",
            services: provider.services
        })
    } catch (error) {
        return res.status(500).json({
            message: "Failed to retrieve provider services",
            error: error.message    
        })
    }
}

export const viewProviderBookings = async (req, res) => {
    try {
        const userId = req.user._id;

        const provider = await Provider.findOne({ user: userId }).populate("bookings");

        if (!provider) {
            return res.status(404).json({
                message: "Provider profile not found"
            })
        }
        return res.status(200).json({
            message: "Provider bookings retrieved successfully",
            bookings: provider.bookings
        })
    } catch (error) {
        return res.status(500).json({
            message: "Failed to retrieve provider bookings",
            error: error.message
        })
    }
}

export const acceptBookings = async (req, res) => {
    try {
        const userId = req.user._id;
        const { bookingId } = req.params;

        const provider = await Provider.findOne({ user: userId });
        if (!provider) {
            return res.status(404).json({
                message: "Provider profile not found"
            });
        }
         return res.status(200).json({
            message: "Booking accepted successfully",
            bookingId
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to accept booking",
            error: error.message
        });
    }
}

export const markBookingAsCompleted = async (req, res) => {
    try {
        const userId = req.user._id;

        const { bookingId } = req.params;

        const provider = await Provider.findOne({ user: userId });

        if (!provider) {
            return res.status(404).json({
                message: "Provider profile not found"
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Failed to mark booking as completed",
            error: error.message
        });
    }
}

export const cancelBookingWhenAppropriate = async (req, res) => {
    try {
        const userId = req.user._id;
        const { bookingId } = req.params;

        const provider = await Provider.findOne({ user: userId });
        if (!provider) {
            return res.status(404).json({
                message: "Provider profile not found"
            });
        }
        return res.status(200).json({
            message: "Booking canceled successfully",
            bookingId
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to cancel booking",
            error: error.message
        });
    }
}
