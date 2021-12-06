const Joi = require('joi');
const mongoose = require('mongoose');
const {user} = require('./user')

const friendsSchema = new mongoose.Schema(
    {
        requester: { type: Schema.Types.ObjectId, ref: 'user'},
        recipient: { type: Schema.Types.ObjectId, ref: 'user'},
        status: {
            type: Number,
            enums: [
                0,  //'add friend',
                1,  //'requested',
                2,  //'pending',
                3,  //'friends'
            ]
        }
        
    }, {timestamps: true}
)

module.exports = mongoose.model('Friends', friendsSchema);