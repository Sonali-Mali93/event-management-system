const eventModel = require("../models/eventModel")
const mongoose = require("mongoose")

const userModel = require("../models/userModel")
const invitationModel = require("../models/invitationModel")

const isValidRequestBody = (requestBody) => {
    return Object.keys(requestBody).length > 0
}


const isValid = (value) => {
    {
        if (typeof value === "undefined" || value === null)
            return false

        if (typeof value === "string" && value.trim().length === 0)
            return false
    }
    return true
}

const isValidobjectId = (objectId) => {
    return mongoose.Types.ObjectId.isValid(objectId)
}



// 1. Create (User can create Event)

const createEvent = async function (req, res) {
    try {
        let id = req.userId
        let body = req.body

        if (!isValidRequestBody(body)) {
            return res.status(400).send({ status: false, msg: "Invalid request parameters, please provide valid event details" })
        }

        const { title, description, userId, eventDate, invitedUsers } = body


        if (!isValid(userId)) {
            return res.status(400).send({ status: false, msg: "BAD REQUEST, please provide userId" })
        }

        if (!isValidobjectId(userId)) {
            return res.status(400).send({ status: false, msg: "Invalid userId, please enter valid userId" })
        }

        let userDetails = await userModel.findById(userId)

        if (!userDetails) {
            return res.status(404).send({ status: false, msg: "no user found" })
        }


        if (id !== userId) {
            return res.status(403).send({ status: false, msg: "You are not authorized to edit details" })
        }
        if (!isValid(title)) {
            return res.status(400).send({ status: false, msg: "BAD REQUEST, please provide title" })
        }

        let isUsedTitle = await eventModel.findOne({ title, isDeleted: false })

        if (isUsedTitle) {
            return res.status(400).send({ status: false, msg: `this title=>${title} is already used` })
        }

        if (!isValid(eventDate)) {
            return res.status(400).send({ status: false, msg: "BAD REQUEST, please provide eventDate details" })
        }

        if (!(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/.test(eventDate))) {
            res.status(400).send({ status: false, message: `${eventDate} is invalid format, please enter date in YYYY-MM-DD format` })
            return
        }



        else {
            let eventDetails = await eventModel.create(body)
            return res.status(201).send({ status: true, msg: "Event creted successfully", data: eventDetails })
        }
    }

    catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, msg: err.message })
    }
}

// get event by filter

const getEvent= async (req, res) => {
    try {
        const input = req.query
        const event = await eventModel.find(input, { isDeleted: false }).select({ _id: 1, title: 1, description: 1, userId: 1, eventDate: 1,invitedUsers:1, createdAt: 0, updatedAt: 0,  deletedAt: 0, __v: 0 }).sort({ title: 1 })

        if (event.length == 0) return res.status(404).send({ status: false, msg: "no such  data found" })

        return res.status(200).send({ status: true, msg: "Event lists", data: event })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}


//   4. Event Detail + list of users invited (API to get specific event and invites)
const eventDetail = async( req, res) => {
    try {
        const eventId = req.params.eventId;
    
        const event = await eventModel.findById(eventId).populate('userId', 'username');
        if (!event) {
          return res.status(404).json({ error: 'Event not found' });
        }
        // res.json({ event, });
        const invitations = await invitationModel.find({ event: eventId }).populate('invitedUserId', 'username');
    
        res.json({event,  invitations });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}


//5. update Event  (Event Update) 
const updateEvent = async (req, res) => {
    try {
        const body = req.params.eventId
        const data = req.body
        if (!body) {
            return res.status(400).send({ status: false, msg: "please provide eventId" })

        }
        if (!isValidobjectId(body)) {
            return res.status(400).send({ status: false, msg: "please enter valid eventId" })
        }

        let validBody = await eventModel.findOne({ _id: body, isDeleted: false })
        if (!validBody) {
            return res.status(400).send({ status: false, msg: "eventId is not valid" })
        }

        if (!isValidRequestBody(data)) {
            return res.status(400).send({ status: false, msg: "please enter valid data" })
        }


        const { title, description, eventDate, invitedUsers} = data

        if (title) {

            if (!isValid(title)) {
                return res.status(400).send({ status: false, msg: "please enter valid title" })
            }
            const duplicateTitle = await eventModel.findOne({ title: title, isDeleted: false })

            if (duplicateTitle) {
                return res.status(404).send({ status: false, msg: "title already exist " })
            }
        }

        if (eventDate) {
            if (!isValid(eventDate)) {
                return res.status(400).send({ status: false, msg: "please enter valid eventDate" })
            }

            if (!(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/.test(releasedAt))) {
                return res.status(400).send({ status: false, message: `${releasedAt} is invalid format, please enter date in YYYY-MM-DD format` })

            }
        }


        
        const updatedData = await eventModel.findOneAndUpdate({ _id: body, isDeleted: false }, data, { new: true })

        if (!updatedData) {
            return res.status(404).send({ status: false, msg: " No such data found" })
        }

        return res.status(200).send({ status: true, msg: "Updated data successfully", data: updatedData })

    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}






module.exports.getEvent = getEvent
module.exports.createEvent = createEvent
module.exports.eventDetail = eventDetail
module.exports.updateEvent = updateEvent





