const mongoose = require('mongoose')
const Mushroom = require('./mushroom')
const db = require('../../config/db')

const startShrooms = [
    { commonName: "Lion's Mane", scientificName: 'Hericium erinaceus', isEdible: true},
    { commonName: 'Puffball', scientificName: 'Basidiomycota', isEdible: true},
    { commonName: 'Indigo Milk Cap', scientificName: 'Lactarius indigo', isEdible: true},
    { commonName: 'Latticed Stinkhorn', scientificName: 'Clathrus ruber', isEdible: true}
]

// first we need to connect to the database
mongoose.connect(db, {
    useNewUrlParser: true
})
    .then(() => {
       
        Mushroom.deleteMany({ owner: null })
            .then(deletedMushrooms => {
                console.log('deletedMushrooms', deletedMushrooms)
               
                Mushroom.create(startShrooms)
                    .then(newMushrooms => {
                        console.log('the new mushrooms', newMushrooms)
                        mongoose.connection.close()
                    })
                    .catch(error => {
                        console.log(error)
                        mongoose.connection.close()
                    })
            })
            .catch(error => {
                console.log(error)
                mongoose.connection.close()
            })
    })
    .catch(error => {
        console.log(error)
        mongoose.connection.close()
    })