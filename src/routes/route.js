const express = require('express');
const router = express.Router();
const UserController = require("../controllers/userController")
const EventController = require("../controllers/eventController")
const InvitationController = require("../controllers/invitationController")
const mid = require("../middlware/middlware")


//1.  Create (User can create Event)
router.post('/register', UserController.CreateUser)

router.post("/login", UserController.logIn)

// 1.  Create (User can create Event)
router.post("/event", mid.authentication, EventController.createEvent)

router.get("/event", mid.authentication, EventController.getEvent)

// 2. Invite (Users) // User can see his created event list and also events in which he is invited.
router.post("/invite/:eventId", mid.authentication, mid.authorization, InvitationController.inviteUsers)

// 4. Event Detail + list of users invited (API to get specific event and invites)
router.get('/eventDetail/:eventId', mid.authentication, mid.authorization, EventController.eventDetail);

//  5. Event update (Event Update)
router.put("/updateevent/:eventId", mid.authentication, mid.authorization, EventController.updateEvent)


module.exports = router
