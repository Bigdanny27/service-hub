import mongoose from "mongoose"

 const categorySchema = new mongoose.Schema({
     name: {
         type: String,
         required: true,
         trim: true
     },
     description: {
         type: String,
         required: true,
         trim: true
     },
     slug: {
         type: String,
         required: true,
         unique: true,
         lowercase: true,
         trim: true
     },
     isDeleted: {
         type: Boolean,
         default: false
     },
     deletedAt: {
         type: Date,
         default: null
     }
 }, { timestamps: true })
 
 const Category = mongoose.model("Category", categorySchema)
 
 export default Category