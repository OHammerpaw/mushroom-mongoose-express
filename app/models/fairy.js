// import dependencies
const mongoose = require('mongoose')

const fairySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    type: {
        type: String,
        enum: ['pixie', 'sprite', 'leprechaun'],
        default: 'pixie'
    }
}, {
    timestamps: true,
    toObject: { virtuals: true },
	toJSON: { virtuals: true }
})


module.exports = fairySchema