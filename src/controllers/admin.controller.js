import User from "../models/user.model.js";


export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password")
        if(!users){
            return res.status(404).json({
                message: "no users found"
            })
        }
        return res.status(200).json({
            message: "users successfully found",
            users
        })
    } catch (error) {
        res.status(500).json({
            message: "internal server error",
            error: error.message
        })
    }
}


// export const toggleUserStatus = async (req, res) => {
//     try {
//         const { userId } = req.params;

//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({
//                 message: "User not found"
//             });
//         }

//         user.isActive = !user.isActive;
//         await user.save();

//         return res.status(200).json({
//             message: user.isActive ? "User activated successfully" : "User deactivated successfully",
//             user
//         });
//     } catch (error) {
//         res.status(500).json({
//             message: "Failed to update user status",
//             error: error.message
//         });
//     }
// }
export const activateUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.isActive = true;
        await user.save();

        return res.status(200).json({
            message: "User activated successfully",
            user
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to activate user",
            error: error.message
        });
    }
}

export const deactivateUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.isActive = false;
        await user.save();

        return res.status(200).json({
            message: "User deactivated successfully",
            user
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to deactivate user",
            error: error.message
        });
    }
}


export const deleteUser = async (req, res) => {
    try {
        const {userId} = req.params
        let user = await User.findByIdAndDelete(userId)
        if(!user){
            return res.status(404).json({
                message: "user not found"
            })
        }
        await User.findByIdAndDelete(userId)
        
        return res.status(200).json({
            message: "user successfully deleted"
        })
    } catch (error) {
        res.status(500).json({
            message: "internal server error",
            error: error.message
        })
    }
}