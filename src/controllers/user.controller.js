import User from "../models/user.model.js"


export const getOwnProfile = async (req, res) => {
    try {
        const userId = req.user._id; 
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        return res.status(200).json({
            message: "User profile retrieved successfully",
            user
        });
    } catch (error) {
        res.status(500).json({
            message: "failed to retrieve user profile",
            error: error.message
        });
    }
}

export const updateOwnProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        const updatedData = req.body;

        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true }).select("-password");
        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        return res.status(200).json({
            message: "User profile updated successfully",
            user: updatedUser
        });     
    }
    catch (error) {
        res.status(500).json({
            message: "failed to update user profile",
            error: error.message
        });
    }
}

export const uploadProfilePicture = async (req, res) => {
    try {
        // req.file is populated by the multer middleware
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // When using Cloudinary, the secure URL is provided in req.file.path
        // If local, it will be the local file path (e.g., 'uploads/avatar-123.jpg')
        const fileUrl = req.file.path; 

        // Example: Update the user's document in the database
        // await User.findByIdAndUpdate(req.user.id, { avatarUrl: fileUrl });

        return res.status(200).json({
            message: "File uploaded successfully",
            url: fileUrl
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error uploading file",
            error: error.message
        });
    }
};