const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            enum: ["Mr", "Mrs", "Miss"],
            trim: true
        },
        name: {
            type: String,
            required: true,
            trim: true

        },
        phone: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            match: /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
            match: [/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/]


        },
        password: {
            type: String,
            required: true,
            min:8,
            max:15,
            // match: [/^(?=.[0-9])(?=.[!@#$%^&])[a-zA-Z0-9!@#$%^&]{8,15}$/]
        },
        address: {
            street: String,
            city: String,
            pincode: String
        }

    },
    { timestamps: true });

module.exports = mongoose.model("User", userSchema)