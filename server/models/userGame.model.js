var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var userGame = new Schema({
        title: {
            type: String,
            require: true
        },
        category: {
            type: String,
            require: true
        },
        state: {
            type: String,
            require: true
        },
        description: {
            type: String,
        },
        userID: {
            type: ObjectId,
        },
        gameImage: {
            type: String,
        }
}, {
    versionKey: false
});

module.exports = mongoose.model('userGame', userGame);