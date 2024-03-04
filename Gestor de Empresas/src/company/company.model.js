import mongoose from "mongoose";

const companySchema = mongoose.Schema({
    companyName: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    companyDescription: {
        type: String,
        required: true
    },
    levelOfImpact: {
        type: String,
        required: true
    },
    trayectory: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
})

//pre mongoose
                            //pluralizar
export default mongoose.model('company',companySchema)