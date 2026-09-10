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