const mongoose = require('mongoose')

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