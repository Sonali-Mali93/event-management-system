const { default: mongoose } = require("mongoose")
const eventModel = require("../models/eventModel")
const invitationModel = require("../models/invitationModel")
const objectId = mongoose.Schema.Types.ObjectId

// 2.Invite (Users) // User can see his created event list and also events in which he is invited.
const inviteUsers = async (req, res)=>{
    try {
        const eventId = req.params.eventId;
        const invitedUserId = req.body.invitedUserId;
    
        // Ensure the user making the request is the event creator
        const event = await eventModel.findOne({ _id: eventId, userId: invitedUserId });
        if (!event) {
          return res.status(401).json({ error: 'Unauthorized' });
        }
    
            const inviteData = await invitationModel.create({
                eventId,
                invitedUserId,
            });
        return res.status(201).send({ status: true, msg: "Users invited successfully.", data: inviteData })

      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}

// const inviteUser = async (req, res) => {
//     try {
//         const body = req.params.eventId
//         const data = req.body

//         const { eventId, invitedUserId} = data


//         let eventDetails = await invitationModel.create(body)

//         // const updatedData = await eventModel.findOneAndUpdate({ _id: body, isDeleted: false }, data, { new: true })

//         if (!updatedData) {
//             return res.status(404).send({ status: false, msg: " No such data found" })
//         }

//         return res.status(200).send({ status: true, msg: "Updated data successfully", data: updatedData })

//     }
//     catch (error) {
//         return res.status(500).send({ status: false, msg: error.message })
//     }
// }


module.exports.inviteUsers = inviteUsers
