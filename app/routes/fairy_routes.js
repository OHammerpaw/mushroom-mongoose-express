const express = require('express')
const passport = require('passport')

// pull in Mongoose model for pets
const Mushroom = require('../models/mushroom')

const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })
const router = express.Router()

// POST -> 
// POST /faeries/<mushroom_id>
router.post('/faeries/:mushroomId', removeBlanks, (req, res, next) => {
    // get the fairy from req.body
    const fairy = req.body.fairy
    const mushroomId = req.params.mushroomId
    // find the shroom by its id
    Mushroom.findById(mushroomId)
        .then(handle404)
        // add the fairy to the shroom
        .then(mushroom => {
            // push the fairy into the shrooms's fairy array and return the saved shroom
            mushroom.faeries.push(fairy)

            return mushroom.save()
        })
        .then(mushroom => res.status(201).json({ mushroom: mushroom }))
        // pass to the next thing
        .catch(next)
})

// UPDATE a fairy
// PATCH -> /faeries/<mushroom_id>/<fairy_id>
router.patch('/faeries/:mushroomId/:fairyId', requireToken, removeBlanks, (req, res, next) => {
    const { mushroomId, fairyId } = req.params

    // find the mushroom
    Mushroom.findById(mushroomId)
        .then(handle404)
        .then(mushroom => {
            // get the specific fairy
            const theFairy = mushroom.fairies.id(fairyId)

            // make sure the user owns the mushroom
            requireOwnership(req, mushroom)

            // update that fairy with the req body
            theFairy.set(req.body.fairy)

            return mushroom.save()
        })
        .then(mushroom => res.sendStatus(204))
        .catch(next)
})

// DESTROY a fairy
// DELETE -> /faeries/<mushroom_id>/<fairy_id>
router.delete('/faeries/:mushroomId/:fairyId', requireToken, (req, res, next) => {
    const { mushroomId, fairyId } = req.params

    // find the mushroom
    Mushroom.findById(mushroomId)
        .then(handle404)
        .then(mushroom => {
            // get the specific fairy
            const theFairy = mushroom.faeries.id(fairyId)

            // make sure the user owns the mushroom
            requireOwnership(req, mushroom)

            // update that fairy with the req body
            theFairy.remove()

            return mushroom.save()
        })
        .then(mushroom => res.sendStatus(204))
        .catch(next)
})

// export router
module.exports = router