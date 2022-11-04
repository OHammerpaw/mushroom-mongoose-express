const mongoose = require('mongoose')

const fairySchema = require('./fairy')

const mushroomSchema = new mongoose.Schema(
	{
		commonName: {
			type: String,
			required: true,
		},
		scientificName: {
			type: String,
			required: true,
		},
        isEdible: {
            type: Boolean,
            required: true,
        },
        fairies: [fairySchema],
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('Mushroom', mushroomSchema)