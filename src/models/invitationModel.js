const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const invitationModel = new mongoose.Schema({
    eventId: 
    {
         type: mongoose.Schema.Types.ObjectId,
          ref: 'Event', required: true 
    },
    invitedUserId:
     { type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
          required: true
     },
    status: 
    { type: String,
         enum: ['Pending', 'Accepted', 'Declined'],
          default: 'Pending' 
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

module.exports = mongoose.model("Invitation", invitationModel)





