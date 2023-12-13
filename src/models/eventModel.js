const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const eventModel = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description:{
        type: String,
        required: true
    },
    userId: {
        type:  mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    eventDate: {
        type: Date,
        required: true,
    },
    invitedUsers: 
    { type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    deletedAt: {
        type: Date,
        required: false,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    

},
    { timestamps: true })

module.exports = mongoose.model("Event", eventModel)





