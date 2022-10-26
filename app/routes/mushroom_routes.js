// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for examples
const Mushroom = require('../models/mushroom')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// Index
// /mushrooms
router.get('/mushrooms', requireToken, (req, res, next) => {
    Mushroom.find()
        .then(mushrooms => {
            return mushrooms.map(mushroom => mushroom)
        })
        .then(mushrooms =>  {
            res.status(200).json({ mushrooms: mushrooms })
        })
        .catch(next)
})

//Show
// /mushrooms/:id
router.get('/mushrooms/:id', requireToken, (req, res, next) => {
    Mushroom.findById(req.params.id)
    .then(handle404)
    .then(mushroom => {
        res.status(200).json({mushroom: mushroom })
    })
    .catch(next)

})

// Create
// /mushroom
router.post('/mushrooms', requireToken, (req, res, next) => {
    req.body.mushroom.owner = req.user.id
    
    Mushroom.create(req.body.mushroom)
    .then(mushroom => {
        res.status(201).json({ mushroom: mushroom })
    })
    .catch(next)
    // .catch(error => next(error))

})

// Update
// /mushrooms/:id
router.patch('/mushrooms/:id', requireToken, removeBlanks, (req, res, next) => {
    delete req.body.mushroom.owner

    Mushroom.findById(req.params.id)
    .then(handle404)
    .then(mushroom => {
        requireOwnership(req, mushroom)

        return mushroom.updateOne(req.body.mushroom)
    })
    .then(() => res.sendStatus(204))
    .catch(next)

})

//DESTROY
// /mushrooms/:id
router.delete('/mushrooms/:id', requireToken, (req, res, next) => {
    Mushroom.findById(req.params.id)
    .then(handle404)
    .then((mushroom) => {
        requireOwnership(req, mushroom)
        mushroom.deleteOne()

    })
    .then(() => res.sendStatus(204))
    .catch(next)
})


module.exports = router