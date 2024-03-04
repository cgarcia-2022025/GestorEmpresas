import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
    categoryName: {
        type: String,
        lowercase: true,
        required: true,
        unique: true
    }
    
})

//pre mongoose
                            //pluralizar
export default mongoose.model('category',categorySchema)