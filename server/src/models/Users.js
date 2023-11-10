const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: String, // Change the type to String to store it as a formatted string
        default: () => {
            const now = new Date();
            const options = {
                year: "numeric",
                month: "long",
                day: "numeric",
            };
            return new Intl.DateTimeFormat("en-US", options).format(now);
        }
    },
    edited: {
        type: Boolean,
    },
    labels: [String],

});

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    notes: [noteSchema]
});

module.exports = mongoose.model("User", userSchema);
