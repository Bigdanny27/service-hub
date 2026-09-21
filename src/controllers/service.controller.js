import mongoose from "mongoose"
import Service from "../models/service.model.js"
import Provider from "../models/provider.model.js"
import Category from "../models/category.model.js"

export const createService = async (req, res) => {
    try {
        const { name, description, price, duration } = req.body
        const { categoryId } = req.params
        const { providerId } = req.params

        if (!name || !description || !price || !duration) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const provider = await Provider.findById(providerId)
        if (!provider) {
            return res.status(404).json({ message: "Provider not found" })
        }

        const category = await Category.findById(categoryId)
        if (!category) {
            return res.status(404).json({ message: "Category not found" })
        }

        const service = await Service.create({
            provider: providerId,
            category: categoryId,
            name,
            description,
            price,
            duration
        })

        return res.status(201).json({
            message: "Service created successfully",
            service
        })  
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}